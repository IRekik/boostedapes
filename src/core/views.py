import requests
from django.shortcuts import render
from django.http import JsonResponse
from core.helpers import get_account
from django.conf import settings

def home(request):
    return render(request, "core/home/index.html")

def api_hello(request):
    return JsonResponse({"msg": "hello world"})

def api_games(request):
    username = request.GET.get("username")
    tag = request.GET.get("tag")
    account = get_account(username,tag)
    puuid = account.get("puuid")

    api_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20"
    api_url += "&api_key=" + settings.RIOT_API_KEY
    
    res = requests.get(api_url)
    return JsonResponse(res.json(), safe=False)
