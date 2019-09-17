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
    querysetlist = []
    sensors = S_Sensor.objects.all()

    for s  in sensors:
        t = S_SensorDataTime()
        t.sensor = s
        t.data = s.lastdata
        querysetlist.append(t)
    S_SensorDataTime.objects.bulk_create(querysetlist)

def dianliang():
    # 计算每小时的用电量
    querysetlist = []
    for each in Circuit.objects.all():
        d = each.hour()
        q = MonitorDataTime(Circuit=each,D_value=d,type='hour')
        querysetlist.append(q)
    MonitorDataTime.objects.bulk_create(querysetlist)
sensordatatimetask()
dianliang()
