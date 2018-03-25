# -*- coding: utf-8 -*-
from django.conf.urls import  url
from .views import *


urlpatterns = [
    url(r'^wx/$', wx),
]
# import platform
# if platform.system()=='Windows':
#     urlpatterns += [
#         url(r'^tensorflow/$', tensorflow),
#     ]
