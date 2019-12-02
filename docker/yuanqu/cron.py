# -*- coding:utf-8 -*-
# 同时设备类型设备
import os
import sys
import django
import json

import traceback
from dateutil.relativedelta import relativedelta
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "yuanqu.settings")
django.setup()

import datetime, time, httplib
import hashlib
import base64
import hmac
from Device.models import *

h = HttpRest()
t = h.getToken()
e = h.getEle()
# s = h.getStatus()