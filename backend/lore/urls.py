from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"groups", views.GroupViewSet, basename="loregroup")
router.register(r"quotes", views.QuoteViewSet, basename="quote")
router.register(r"users", views.LoreUserViewSet, basename="loreuser")
router.register(r"images", views.ImageViewSet, basename="image")
urlpatterns = [
    path("auth/google/", views.GoogleLogin.as_view(), name="google_login"),
    path("feed/", views.FeedView.as_view(), name="feed"),
    path("", include(router.urls)),
]
