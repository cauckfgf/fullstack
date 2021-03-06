# -*- coding:utf-8 -*-
import os
import sys
import django
import json
import httplib
import datetime
import traceback

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "binjiang.settings")
django.setup()

from Device.models  import *


import paho.mqtt.client as mqtt
 
 
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("device_data_out_1")
    client.subscribe("device_data_out_2")
 
 
def on_message(client, userdata, msg):
    print(msg.topic+" " + ":" + str(msg.payload))
 
def runner():
    client = mqtt.Client()
    # client.username_pw_set("admin", "password")
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect("140.207.38.66", 10020, 60)

    client.loop_forever()

if __name__ == '__main__':
    from binjiang.autoreload import run_with_reloader
    run_with_reloader(runner)
