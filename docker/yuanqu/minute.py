# -*- coding:utf-8 -*-
# 同时设备类型设备
import os
import sys
import django
import json


from dateutil.relativedelta import relativedelta
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "yuanqu.settings")
django.setup()

from Device.models import *

h = HttpRest()
t = h.getToken()
# e = h.getEle()
s = h.getStatus()
# h.switch_off('23506303c44f33b30e1f')
# h.switch_on('23506303c44f33b30e1f')