# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from rest_framework import routers
from .views import *
from django.views.decorators.cache import cache_page

router = routers.DefaultRouter()

router.register(r'config', ConfigSet)
router.register(r'user', UserSet)
router.register(r'auth', AuthSet)
router.register(r'group', GroupSet)

urlpatterns = [

#restframe
    url(r'^rest/', include(router.urls)),

]