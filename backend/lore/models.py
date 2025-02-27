from operator import mod
from typing import ClassVar
import uuid

from django.contrib.auth.models import AbstractUser, BaseUserManager, Group
from django.db import models


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
            raise ValueError("Users must have an email address")
        if not first_name:
            raise ValueError("Users must have a first name")

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

    REQUIRED_FIELDS: ClassVar[list[str]] = ["first_name", "last_name"]
    USERNAME_FIELD = "email"
    users = LoreUserManager()

    def __str__(self) -> str:
        """Get the user's email."""
        return self.email


class LoreGroupManager(models.Manager):
    """The manager for lore groups."""

    def create_group(self, name: str, owner: "LoreUser") -> "LoreGroup":
        """Create a Lore group with the given name and the specified owner."""
        join_code = uuid.uuid4().hex[:6]

        group = self.model(
            name=name,
            join_code=join_code,
        )

        group.save(using=self._db)
        group.members.add(owner.pk)

        return group


class LoreGroup(models.Model):
    """The model representing a lore group."""

    name = models.CharField(max_length=32, unique=True)
    join_code = models.CharField(max_length=8, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    # Django creates intermediate rep for us
    members = models.ManyToManyField(LoreUser)

    groups = LoreGroupManager()

    def __str__(self) -> str:
        """Return."""
        return "e"


class Quote(models.Model):
    """Represents a quote that someone said.

    Takes a text field with at most 2048 characters and a 'saidby' field
    with the user that said the quote
    """

    text = models.CharField(max_length=2048)
    said_by = models.ForeignKey(LoreUser, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS: ClassVar[list[str]] = ["text"]


class Image(models.Model):
    """Represents an image sent by a group.

    Requires an image url with max length 256,
    a descrption with a max length of 128,
    and a group foreign key
    """

    image_url = models.URLField(max_length=256)
    descrption = models.CharField(max_length=128)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS: ClassVar[list[str]] = ["image_url", "descrption"]


class Achievement(models.Model):
    """Represents a groups achievements.

    Requires a title with max length 128,
    a descrption with max length 1024,
    an image url with max length 128,
    and a group foreign key
    """

    title = models.CharField(max_length=128)
    description = models.CharField(max_length=1024)
    image_url = models.URLField(max_length=128)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    achieved_by = models.ManyToManyField(LoreUser)
    created = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS: ClassVar[list[str]] = [
        "image_url",
        "descrption",
        "title",
    ]
