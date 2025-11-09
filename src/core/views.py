import requests
from django.shortcuts import render
from django.http import JsonResponse

API_KEY = "RGAPI-70537a25-57fd-45f8-82dc-57637f9b2a8b"

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
    api_url += "&api_key=" + API_KEY
    
    res = requests.get(api_url)
    return JsonResponse(res.json(), safe=False)


def get_account(username,tag):
    api_url = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{username}/{tag}"
    api_url += "?api_key=" + API_KEY
    return requests.get(api_url).json()