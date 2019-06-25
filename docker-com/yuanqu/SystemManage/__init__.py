# -*- coding: utf-8 -*-
from django.apps import AppConfig
import os
VERBOSE_APP_NAME = u"系统设置"

def get_current_app_name(_file):
    return os.path.split(os.path.dirname(_file))[-1]


class AppVerboseNameConfig(AppConfig):
    name = get_current_app_name(__file__)
    verbose_name = VERBOSE_APP_NAME


default_app_config = get_current_app_name(__file__) + '.__init__.AppVerboseNameConfig'