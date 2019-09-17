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
    sensordata = SensorData.objects.filter(stime__gt=t).values('sensor','stime').annotate(Max('data'))
    middle = {}
    for each in sensordata:
        if middle.get(each['sensor'], None):
            middle[each['sensor']] = (each['data__max'], each['stime'])

    for key,value in middle.items():
        t = SensorDataTime()
        t.sensor = Sensor.objects.get(id=key)
        t.data = value[0]
        t.stime = value[1]
        querysetlist.append(t)
    SensorDataTime.objects.bulk_create(querysetlist)

sensordatatimetask()
