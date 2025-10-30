from django.contrib import admin
from django.urls import path
from core.views import home, api_hello

urlpatterns = [
    path("", home),
    path("api/hello/", api_hello),
    path("admin/", admin.site.urls),
]