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


def get_champion_rotation(request):
    url = f"https://jp1.api.riotgames.com/lol/platform/v3/champion-rotations"
    headers = {"X-Riot-Token": RIOT_API_KEY}

    response = requests.get(url, headers=headers)
    if not response.status_code != 200:
        return JsonResponse({
            "error": "request response is empty",

        },
            status=500)
    data = response.json()

    formatted_champion_list = format_champion_list(data)

    return JsonResponse(formatted_champion_list, safe=False)


def get_user_game_history(request):
    username = request.GET.get("username")
    tag = request.GET.get("tag")

    safe_tag = urllib.parse.quote(tag.lstrip("#"))

    account = get_account(username, safe_tag)

    # if user not found, return error
    if "puuid" not in account:
        return JsonResponse({"error": "Account not found"}, status=400)

    puuid = account["puuid"]

    match_ids = get_last_10_matches_history(puuid)

    last_10_games_info = []

    for match_id in match_ids:
        game_info = get_match_info(match_id)
        last_10_games_info.append(game_info)

    return JsonResponse(last_10_games_info, safe=False)
