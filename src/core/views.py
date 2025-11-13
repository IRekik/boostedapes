import requests
from django.shortcuts import render
from django.http import JsonResponse
from core.helpers import get_account, format_champion_list, get_match_info, get_last_10_matches_history
from django.conf import settings
import urllib.parse

RIOT_API_KEY = settings.RIOT_API_KEY

def home(request):
    return render(request, "core/home/index.html")


def api_hello(request):
    return JsonResponse({"msg": "hello world"})


def get_user_game_history(request):
    username = request.GET.get("username")
    tag = request.GET.get("tag")
    safe_tag = urllib.parse.quote(tag.lstrip("#"))
    account = get_account(username, safe_tag)

    puuid = account.get("puuid")

    last_10_games_history = get_last_10_matches_history(puuid)

    last_10_games_info = []

    for game in last_10_games_history:
        game_info = get_match_info(game)
        last_10_games_info.append(game_info)

    return JsonResponse(last_10_games_info, safe=False)


def get_champion_rotation(request):
    url = f"https://asia.api.riotgames.com/lol/platform/v3/champion-rotations"
    headers = {"X-Riot-Token": RIOT_API_KEY}

    response = requests.get(url, headers=headers)
    data = response.json()

    formatted_champion_list = format_champion_list(data)

    return JsonResponse(formatted_champion_list, safe=False)
