from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from api import settings


class GoogleLogin(SocialLoginView):
    """Handles google AUTH.

    Create a post request with the authentication code
    provide by Google on the callback url.
    """

    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_AUTH_REDIRECT_URL
    client_class = OAuth2Client
