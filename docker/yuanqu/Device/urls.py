# -*- coding: utf-8 -*-
from django.conf.urls import include, url
from rest_framework import routers
from .views import *
router = routers.DefaultRouter()
router.register(r'device', DeviceSet)
router.register(r'device2device', Device2DeviceSet)
router.register(r'system', SystemSet)
router.register(r'sensordata', SensorDataSet)
router.register(r'timer', TimerTuYaSet)




urlpatterns = [
    url(r'^rest/', include(router.urls)),
]
