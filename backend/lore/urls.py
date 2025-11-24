from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from . import views

router = routers.SimpleRouter()

router.register(r"groups", views.GroupViewSet, basename="loregroup")
router.register(r"quotes", views.QuoteViewSet, basename="quote")
router.register(r"images", views.ImageViewSet, basename="image")
router.register(
    r"achievements",
    views.AchievementViewSet,
    basename="achievement",
)
router.register(r"users", views.LoreUserViewSet, basename="loreuser")
router.register(
    r"challenges",
    views.ChallengeViewSet,
    basename="challenge",
)

groups_router = routers.NestedSimpleRouter(
    router,
    r"groups",
    lookup="loregroup",
)
groups_router.register(
    r"quotes",
    views.QuoteViewSet,
    basename="loregroup-quote",
)
groups_router.register(
    r"images",
    views.ImageViewSet,
    basename="loregroup-image",
)
groups_router.register(
    r"achievements",
    views.AchievementViewSet,
    basename="loregroup-achievement",
)
groups_router.register(
    r"challenges",
    views.ChallengeViewSet,
    basename="loregroup-challenge",
)
groups_router.register(
    r"members",
    views.MemberViewSet,
    basename="loregroup-loreuser",
)

achievements_router = routers.NestedSimpleRouter(
    router,
    r"achievements",
    lookup="achievement",
)
achievements_router.register(
    r"achievers",
    views.AchievedViewSet,
    basename="achievement-loreuser",
)

challenge_router = routers.NestedSimpleRouter(
    router,
    r"challenges",
    lookup="challenge",
)
challenge_router.register(
    r"participants",
    views.ChallengeParticipantsViewSet,
    basename="challengeparticipant",
)

urlpatterns = [
    path("auth/google/", views.GoogleLogin.as_view(), name="google_login"),
    path("feed/", views.FeedView.as_view(), name="feed"),
    path("", include(router.urls)),
    path("", include(groups_router.urls)),
    path("", include(achievements_router.urls)),
    path("", include(challenge_router.urls)),
]
