import requests
from django.shortcuts import render
from django.http import JsonResponse
from core.helpers import get_account, format_champion_list
from django.conf import settings

def home(request):
    return render(request, "core/home/index.html")

def api_hello(request):
    return JsonResponse({"msg": "hello world"})

def get_user_game_history(request):
    username = request.GET.get("username")
    tag = request.GET.get("tag")
    account = get_account(username,tag)
    puuid = account.get("puuid")

    api_url = f"https://na1.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20"
    api_url += "&api_key=" + settings.RIOT_API_KEY
    
    res = requests.get(api_url)
    return JsonResponse(res.json(), safe=False)

def get_champion_rotation(request):
    RIOT_API_KEY = settings.RIOT_API_KEY
    url = f"https://na1.api.riotgames.com/lol/platform/v3/champion-rotations"
    headers = {"X-Riot-Token": RIOT_API_KEY}
    
    response = requests.get(url, headers=headers)
    data = response.json()

    formatted_champion_list = format_champion_list(data)
    
    return JsonResponse(formatted_champion_list, safe=False)
