# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from rest_framework import routers
router = routers.DefaultRouter()
# router.register(r'pb', PrecastBeameSet)


urlpatterns = [
    url(r'^rest/', include(router.urls)),
]