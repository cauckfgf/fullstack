# -*- coding:utf-8 -*-
# 计算每天用电量 每月 
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
now = datetime.datetime.now()

def day():
    # 计算每小时的用电量
    querysetlist = []
    for each in Circuit.objects.all():
        d = each.day()
        q = MonitorDataTime(Circuit=each,D_value=d,type='day')
        querysetlist.append(q)
    MonitorDataTime.objects.bulk_create(querysetlist)

def month():
    # 计算每小时的用电量
    querysetlist = []
    for each in Circuit.objects.all():
        d = each.month()
        q = MonitorDataTime(Circuit=each,D_value=d,type='month')
        querysetlist.append(q)
    MonitorDataTime.objects.bulk_create(querysetlist)

day()

if now.day==1:
    month()