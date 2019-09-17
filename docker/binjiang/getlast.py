# -*- coding:utf-8 -*-
import os
import sys
import django
import json
import httplib
import datetime
import traceback
import logging
logging.basicConfig(level=logging.DEBUG,filename='/app/getdata.log',filemode='a',format='%(asctime)s - %(pathname)s[line:%(lineno)d] - %(levelname)s: %(message)s',stream=sys.stdout)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "binjiang.settings")
django.setup()

from Device.models  import *


import paho.mqtt.client as mqtt
 
 
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    for i in DeviceType.objects.all():
        client.subscribe("device_data_out_{}".format(i.id))

# IA => phaseCurrentIA
# IB => phaseCurrentIB
# IC => phaseCurrentIC
# 相电压UA => phaseVoltageUA
# 相电压UB => phaseVoltageUB
# 相电压UC => phaseVoltageUC
# 有功电能 => activeElectricalEnergy
maplib = {
    'phaseCurrentIA':{'unit':'A','倍率':0.1,'name':'A相电流'},
    'phaseCurrentIB':{'unit':'A','倍率':0.1,'name':'B相电流'},
    'phaseCurrentIC':{'unit':'A','倍率':0.1,'name':'C相电流'},
    'phaseVoltageUA':{'unit':'V','倍率':0.1,'name':'A相电压'},
    'phaseVoltageUB':{'unit':'V','倍率':0.1,'name':'B相电压'},
    'phaseVoltageUC':{'unit':'V','倍率':0.1,'name':'C相电压'},
    'activeElectricalEnergy':{'unit':'A','倍率':0.001,'name':'有功电能'},
} 
sensor_map = {
    1 : SensorData_DeviceType1,
    2 : SensorData_DeviceType2,
    3 : SensorData_DeviceType3,
    4 : SensorData_DeviceType4,
    5 : SensorData_DeviceType5,
    6 : SensorData_DeviceType6,
}
def on_message(client, userdata, msg):
    try:
        logging.debug(msg.topic+" " + ":" + str(msg.payload))
        # print(msg.topic+" " + ":" + str(msg.payload))
        data = json.loads(msg.payload)
        code = data.get('code','')
        if not code:
            return 
        device = Device.objects.get(code=code)
        SensorData_OBJ = sensor_map[device.devicetype_id]
        for sensor in data['sensors']:
            if maplib.get(sensor['name'],None):
                m = maplib.get(sensor['name'])
                name = m.get('name')
                unit = m.get('unit')
                bl = m.get('unit')
                s = Sensor.objects.get_or_create(key=sensor['name'],device=device,name=name,unit=unit)[0]
                s.lastdata = str(float(sensor['data']) * bl)
                s.save()
            else:
                s = Sensor.objects.get_or_create(key=sensor['name'],device=device)[0]
                s.lastdata = sensor['data']
                s.save()
            SensorData_OBJ.objects.create(sensor=s,data=sensor['data'])
    except:
        traceback.print_exc()
 
def runner():
    print "[%s]enter..." % os.getpid()
    client = mqtt.Client()
    # client.username_pw_set("admin", "password")
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect("140.207.38.66", 10020, 60)

    client.loop_forever()

if __name__ == '__main__':
    from binjiang.autoreload import run_with_reloader
    run_with_reloader(runner)
