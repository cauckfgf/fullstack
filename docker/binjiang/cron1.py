# -*- coding:utf-8 -*-
# 1小时填充一次SensorDataTime
import os
import sys
import django
import json
import httplib
import datetime
import traceback
from dateutil.relativedelta import relativedelta
from django.db.models import Max,Min
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "binjiang.settings")
django.setup()

from Device.models  import *
def sensordatatimetask():
    now = datetime.datetime.now()
    # 前一小时
    t = now + relativedelta(hours=-1)

    querysetlist = []
    sensors = S_Sensor.objects.all()

    for s  in sensors:
        t = S_SensorDataTime()
        t.sensor = s
        t.data = s.lastdata
        querysetlist.append(t)
    SensorDataTime.objects.bulk_create(querysetlist)

sensordatatimetask()
