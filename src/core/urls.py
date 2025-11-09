from django.urls import path
from . import views
from core.views import home, api_hello, api_games

urlpatterns = [
    path("", home),
    path("api/hello/", api_hello),
    path("api/games/", api_games),
]