from os import abort
import pathlib
import uuid
from typing import ClassVar, cast

from django.contrib.auth.models import AbstractUser, BaseUserManager, Group
from django.core.files import File
from django.db import models
from django.forms import ValidationError
from django.http import Http404
from django.utils.deconstruct import deconstructible
from rest_framework.fields import MinLengthValidator, ObjectDoesNotExist


# https://stackoverflow.com/questions/25767787/django-cannot-create-migrations-for-imagefield-with-dynamic-upload-to-value
@deconstructible
class PathAndRename:
    """Generate a uuid for the uploaded file and store it in the given path."""

    def __init__(self, sub_path: str) -> None:
        """Take the sub path to store."""
        self.path = sub_path

    def __call__(self, _: File, filename: str) -> pathlib.Path:
        """Generate the unique file path."""
        stem = uuid.uuid4().hex
        ext = pathlib.Path(filename).suffix.lower()
        filename = f"{stem}{ext}"
        return pathlib.Path(self.path) / filename


class LoreUserManager(BaseUserManager["LoreUser"]):
    """Manages the Lore User."""

    def create_user(
        self,
        email: str,
        first_name: str,
        last_name: str,
        password: str,
    ) -> "LoreUser":
        """Commit a User with the given email, first name and password."""
        if not email:
            msg = "Users must have an email address"
            raise ValueError(msg)
        if not first_name:
            msg = "Users must have a first name"
            raise ValueError(msg)

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self,
        email: str,
        first_name: str,
        last_name: str,
        password: str,
    ) -> "LoreUser":
        """Commit a superuser with the given email, first name and password."""
        user = self.create_user(
            email,
            first_name=first_name,
            last_name=last_name,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class LoreUser(AbstractUser):
    """Defines the core user model for the application."""

    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    username = models.CharField("username", max_length=255, unique=False)
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    avatar = models.ImageField(
        upload_to=PathAndRename("avatars"),
        null=True,
    )

    REQUIRED_FIELDS: ClassVar[list[str]] = ["first_name", "last_name"]
    USERNAME_FIELD = "email"
    users = LoreUserManager()

    def is_in_group(self, group_pk: int) -> bool:
        """Return true if the user is in the group with the given pk."""
        return LoreGroup.groups.filter(members=self, pk=group_pk).exists()

    def get_mutual_users(self) -> models.QuerySet["LoreUser", "LoreUser"]:
        """Retrieve users that share groups with this user.

        The query will return this user as well
        """
        groups = LoreGroup.groups.get_groups_with_user(self)
        group_ids = [group.pk for group in groups]
        return (
            LoreUser.users.filter(member_of__in=group_ids)
            .order_by("pk")
            .distinct("pk")
        )

    def __str__(self) -> str:
        """Get the user's email."""
        return self.email


class LoreGroupManager(models.Manager):
    """The manager for lore groups."""

    MAX_QUICK_ADD_USERS = 10

    def get_groups_with_user(
        self,
        user: LoreUser,
    ) -> models.QuerySet["LoreGroup", "LoreGroup"]:
        """Get a list of all the groups the user is in."""
        return self.filter(members=user)

    def create_group(
        self,
        name: str,
        owner: "LoreUser",
        avatar: File | None,
        members: list[LoreUser],
    ) -> "LoreGroup":
        """Create a Lore group.

        At most MAX_QUICK_ADD_USERS members may be added to the group
        upon creaton; this is to prevent spam.
        """
        if len(members) > self.MAX_QUICK_ADD_USERS:
            msg = f"""You may not create a group with
            more than {self.MAX_QUICK_ADD_USERS} members."""
            raise ValueError(msg)

        join_code = uuid.uuid4().hex[:8]
        while self.filter(join_code=join_code).exists():
            join_code = uuid.uuid4().hex[:8]

        group = self.model(name=name, join_code=join_code, avatar=avatar)

        group.save(using=self._db)
        group.members.add(owner.pk)
        group.members.add(*[m.pk for m in members])

        return group

    def join_group(self, join_code: str, user: "LoreUser") -> None:
        """Attempt to join the group with thte given join code.

        If no group with the given join_code exists, raises a 404 error
        """
        try:
            group: LoreGroup = self.get(join_code=join_code)
            group.members.add(user.pk)
        except ObjectDoesNotExist as e:
            raise Http404 from e

    def leave_group(self, group_id: str, user: "LoreUser") -> None:
        """Attempt to leave the group with the given group id.

        Will 404 if the user is not in the group, or the group does not exist
        """
        group: LoreGroup = cast(LoreGroup, self.filter(pk=group_id).first())
        if group is None:
            msg = "Group does not exist"
            raise Http404(msg)

        if not group.members.contains(user):
            msg = "User not in group"
            raise Http404(msg)
        group.members.remove(user.pk)

        # TODO: handle last user leaving


class LoreGroup(models.Model):
    """The model representing a lore group."""

    name = models.CharField(
        max_length=32,
        unique=True,
        validators=[
            MinLengthValidator(1),
        ],
    )
    join_code = models.CharField(max_length=8, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    # Django creates intermediate rep for us
    members = models.ManyToManyField(LoreUser, related_name="member_of")
    avatar = models.ImageField(
        upload_to=PathAndRename("group_avatars"),
        null=True,
    )

    groups = LoreGroupManager()

    def __str__(self) -> str:
        """Output a string with the name and join code."""
        return f"{self.name} {self.join_code}"

    def get_quotes(self) -> list["Quote"]:
        """Get all the quotes related to this group."""
        return Quote.quotes.get_group_quotes(self)

    def has_member(self, user: LoreUser) -> bool:
        """Return true if the user is a member of the group."""
        return self.members.filter(id=user.pk).exists()

    @property
    def num_members(self) -> int:
        """Get the number of members in the group."""
        return self.members.count()


class QuoteManager(models.Manager):
    """The Manager for quotes."""

    def create_quote(
        self,
        text: str,
        said_by_pk: int,
        pinned: bool,
        group: LoreGroup,
    ) -> "Quote":
        """Create a quote with the text, in the given group, said by the user.

        All fields are required and obey the rules of the Quote model
        """
        if not text:
            msg = "Must have text"
            raise ValueError(msg)
        if not said_by_pk:
            msg = "Must have a user that said the quote"
            raise ValueError(msg)

        said_by: LoreUser | None = LoreUser.users.filter(pk=said_by_pk).first()
        if said_by is None:
            msg = "Said by user does not exist"
            raise Http404(msg)

        quote = self.model(
            text=text,
            said_by=said_by,
            pinned=pinned,
            group_id=group.pk,
        )

        quote.save(using=self._db)
        return quote

    def get_group_quotes(self, group: LoreGroup) -> list["Quote"]:
        """Get all quotes in the given group."""
        return cast(list["Quote"], self.filter(group_id=group.pk))


class GroupItem(models.Model):
    """Represents an item that belongs to a LoreGroup."""

    group = models.ForeignKey(LoreGroup, on_delete=models.CASCADE)

    class Meta:
        """Configuration for this model."""

        abstract = True


class Quote(GroupItem):
    """Represents a quote that someone said.

    Takes a text field with at most 2048 characters and a 'saidby' field
    with the user that said the quote
    """

    text = models.TextField(
        max_length=2048,
        validators=[MinLengthValidator(1)],
    )
    said_by = models.ForeignKey(LoreUser, on_delete=models.CASCADE)
    pinned = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS: ClassVar[list[str]] = ["text"]

    quotes = QuoteManager()

    def clean(self) -> None:
        """Validate that said_by is in the same group as the quote."""
        if not self.group.has_member(self.said_by):
            msg = """The person that said a quote must be in
            the same group as the created quote"""
            raise ValidationError(msg)


class ImageManager(models.Manager):
    """The Manager for images."""

    def create_image(
        self, image: File, description: str | None, group: LoreGroup
    ) -> "Image":
        """Create an image with the given image, description, and group.

        All fields are required and obey the rules of the Quote model
        """
        if not image:
            msg = "Must have image"
            raise ValueError(msg)

        if description is None:
            description = ""

        image_model = self.model(
            image=image,
            description=description,
            group_id=group.pk,
        )

        image_model.save(using=self._db)
        return image_model

    def get_group_images(self, group: LoreGroup) -> list["Image"]:
        """Get all image in the given group."""
        return cast(list["Image"], self.filter(group_id=group.pk))


class Image(GroupItem):
    """Represents an image sent by a group.

    Requires an image url with max length 256,
    a description with a max length of 128,
    ans a group foreign key
    """

    image = models.ImageField(upload_to=PathAndRename("group_images"))
    description = models.CharField(max_length=128, default="")
    group = models.ForeignKey(LoreGroup, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS: ClassVar[list[str]] = ["image"]

    images = ImageManager()


class AchievementManager(models.Manager):
    """Manager for handling achievement model functionalities."""

    def create_achievement(
        self,
        title: str,
        description: str,
        image: File | None,
        achieved_by: list[LoreUser],
        group: LoreGroup,
    ) -> "Achievement":
        """Create an achievement object.

        The achievement is attached to the given group.
        """
        achievement_model = self.model(
            title=title,
            image=image,
            description=description,
            group=group,
        )

        achievement_model.save(using=self._db)
        achievement_model.achieved_by.set(achieved_by)
        return achievement_model

    def get_group_achievements(
        self, group: LoreGroup
    ) -> models.QuerySet["Achievement", "Achievement"]:
        """Retrieve all achievements in the given group."""
        return self.filter(group=group)


class Achievement(GroupItem):
    """Represents a groups achievements.

    Requires a title with max length 128,
    a description with max length 1024,
    an image url with max length 128,
    and a group foreign key
    """

    title = models.CharField(max_length=128)
    description = models.CharField(max_length=1024)
    image = models.ImageField(
        upload_to=PathAndRename("achievement_images"),
        null=True,
    )
    group = models.ForeignKey(LoreGroup, on_delete=models.CASCADE)
    achieved_by = models.ManyToManyField(LoreUser)
    created = models.DateTimeField(auto_now_add=True)

    @property
    def num_achieved(self) -> int:
        """Get the number of users that achieved this."""
        return self.achieved_by.count()

    REQUIRED_FIELDS: ClassVar[list[str]] = [
        "image",
        "descrption",
        "title",
    ]

    achievements = AchievementManager()

    def add_achiever(self, user: LoreUser) -> bool:
        """Add the user to the achieved list.

        Return true if the user was added successfully
        Will return false if the group doesn't exist, or the
        user already achieved this.
        """
        if not self.group.has_member(user):
            return False
        if self.has_achiever(user):
            return False
        self.achieved_by.add(user)

        return True

    def remove_achiever(self, user: LoreUser) -> bool:
        """Remove the user from the achieved list.

        Returns true if the user was successfully removed.
        Returns false if the user is not in the group, or if
        they're not on the achieved list.
        """
        if not self.group.has_member(user):
            return False
        if not self.has_achiever(user):
            return False
        self.achieved_by.remove(user)
        return True

    def has_achiever(self, user: LoreUser) -> bool:
        """Check if the user already achieved this.

        Returns True if the user has achieved this
        """
        return self.achieved_by.contains(user)
