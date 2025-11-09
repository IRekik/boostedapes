from django.urls import path
from . import views
from core.views import home, api_hello, get_user_game_history, get_champion_rotation

urlpatterns = [
    path("", home),
    path("api/hello/", api_hello),
    path("api/games/", get_user_game_history),
    path("api/get_champion_rotation/", get_champion_rotation)
]