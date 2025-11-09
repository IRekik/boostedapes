import requests
from django.conf import settings

def get_account(username,tag):
    api_url = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{username}/{tag}"
    api_url += "?api_key=" + settings.RIOT_API_KEY
    return requests.get(api_url).json()

def format_champion_list(data):
    """
    Fetches champion data and replaces champion IDs with champion names.
    
    Args:
        data: Dictionary containing 'freeChampionIds' list
        
    Returns:
        List of champion names for the free rotation
    """
    # Fetch champion data from Data Dragon
    response = requests.get("https://ddragon.leagueoflegends.com/cdn/15.6.1/data/en_US/champion.json")
    champion_data = response.json()

    champion_list = {}
    
    # Create a mapping of champion ID to champion name
    # The API returns champions with 'key' (ID as string) and 'name'
    id_to_name = {}
    for champion_name, champion_info in champion_data['data'].items():
        champion_id = int(champion_info['key'])
        id_to_name[champion_id] = champion_info['name']
    
    # Replace champion IDs with champion names
    free_champions = []
    for champion_id in data.get("freeChampionIds", []):
        champion_name = id_to_name.get(champion_id, f"Unknown Champion (ID: {champion_id})")
        free_champions.append(champion_name)

    champion_list["free_champions"] = free_champions

    free_champions_for_new_players = []
    for champion_id in data.get("freeChampionIdsForNewPlayers", []):
        champion_name = id_to_name.get(champion_id, f"Unknown Champion (ID: {champion_id})")
        free_champions_for_new_players.append(champion_name)

    champion_list["free_champions_for_new_players"] = free_champions_for_new_players
    
    return champion_list