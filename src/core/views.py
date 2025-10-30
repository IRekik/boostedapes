from django.shortcuts import render
from django.http import JsonResponse

def home(request):
    return render(request, "core/index.html")

def api_hello(request):
    return JsonResponse({"msg": "hello world"})