import requests
from django.conf import settings

def get_account(username,tag):
    api_url = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{username}/{tag}"
    api_url += "?api_key=" + settings.RIOT_API_KEY
    return requests.get(api_url).json()