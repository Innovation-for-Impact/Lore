from django.urls import path

from . import views

urlpatterns = [path("auth/google/", views.GoogleLogin.as_view(), name="google_login")]
