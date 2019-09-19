# -*- coding:utf-8 -*-
import os
import sys
import django
import json
import httplib
import datetime
import traceback
import logging
from dateutil.relativedelta import relativedelta
logging.basicConfig(level=logging.DEBUG,filename='/app/getdata.log',filemode='a',format='%(asctime)s - %(pathname)s[line:%(lineno)d] - %(levelname)s: %(message)s',stream=sys.stdout)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "binjiang.settings")
django.setup()

from Device.models  import *


import paho.mqtt.client as mqtt
 
 
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    for i in DeviceType.objects.all():
        client.subscribe("device_data_out_{}".format(i.id))


# sensor_map = {
#     1 : SensorData_DeviceType1,
#     2 : SensorData_DeviceType2,
#     3 : SensorData_DeviceType3,
#     4 : SensorData_DeviceType4,
#     5 : SensorData_DeviceType5,
#     6 : SensorData_DeviceType6,
# }
def on_message(client, userdata, msg):
    try:
        logging.debug(msg.topic+" " + ":" + str(msg.payload))
        # print(msg.topic+" " + ":" + str(msg.payload))
        data = json.loads(msg.payload)
        code = data.get('code','')
        if not code:
            return 
        _t = int(data.get('timestamp',''))
        t = datetime.datetime.utcfromtimestamp(_t/1000) +relativedelta(hours=8)
        circuits = Circuit.objects.filter(code=code)
        if not circuits:
            # 设备点位
            # SensorData_OBJ = sensor_map[device.devicetype_id]
            # 信管
            device = Device.objects.get(code=code)
            result = data.get('sensors')
            if not result:
                result = data.get('result')
            for sensor in result:
                s = Sensor.objects.get_or_create(key=sensor['name'],device=device)[0]
                s.lastdata = sensor['data']
                s.save()
                SensorData.objects.create(sensor=s,data=sensor['data'],stime=t)
            # 四建
            device = S_Device.objects.get(code=code)
            for sensor in result:
                s = S_Sensor.objects.get_or_create(key=sensor['name'],device=device)[0]
                s.lastdata = sensor['data']
                s.save()

        else:
            # 能耗
            # IA => phaseCurrentIA
            # IB => phaseCurrentIB
            # IC => phaseCurrentIC
            # 相电压UA => phaseVoltageUA
            # 相电压UB => phaseVoltageUB
            # 相电压UC => phaseVoltageUC
            # 有功电能 => activeElectricalEnergy
            # dianlib = {
            #     'phaseCurrentIA':'current_A',
            #     'phaseCurrentIB':'current_B',
            #     'phaseCurrentIC':'current_C',
            #     'phaseVoltageUA':'voltage_A',
            #     'phaseVoltageUB':'voltage_B',
            #     'phaseVoltageUC':'voltage_C',
            #     'activeElectricalEnergy':'quantity',
            # } 
            circuit = circuits.first()

            result = data.get('sensors',None)
            if not result:
                result = data.get('result')
            cdata = CircuitMonitorData(circuit=circuit,time=t)
            for sensor in result:
                name = sensor['name']
                value = float(sensor['data'])
                if name=='phaseCurrentIA':
                    cdata.current_A = value
                elif name=='phaseCurrentIB':
                    cdata.current_B = value
                elif name=='phaseCurrentIC':
                    cdata.current_C = value
                elif name=='phaseVoltageUA':
                    cdata.voltage_A = value
                elif name=='phaseVoltageUB':
                    cdata.voltage_B = value
                elif name=='phaseVoltageUC':
                    cdata.voltage_C = value
                elif name=='activeElectricalEnergy':
                    cdata.quantity = value
                elif name=='activeEnergy':
                    cdata.quantity = value
            if cdata.quantity is not None:
                cdata.save()
            circuit.lasthour()
                    
    except:
        logging.debug(sensor['data'])
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
