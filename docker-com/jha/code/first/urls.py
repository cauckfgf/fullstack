# -*- coding: utf-8 -*-
from django.conf.urls import include, url
from rest_framework import routers
from .views import *
router = routers.DefaultRouter()
router.register(r'file', FileSet)


urlpatterns = [
    url(r'^rest/', include(router.urls)),
    url(r'^news/$', news),
]
