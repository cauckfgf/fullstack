# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
import rest_framework_filters
from rest_framework import viewsets,generics,pagination,filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import *
from .serializers import *
from rest_framework.decorators import detail_route, list_route
import json
# Create your views here.


class ProjectFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Project
        fields = {
            'name' : ['exact','in'],
        }

class ProjectSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = ProjectFilter

class SystemFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = System
        fields = {
            'name' : ['exact','in'],
            'create_time' : ['month__gte'],
            'project':['exact'],
        }

class SystemSet(viewsets.ModelViewSet):
    queryset = System.objects.all()
    serializer_class = SystemSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = SystemFilter





class DeviceTypeFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = DeviceType
        fields = {
            'name':['exact','in'],
        }

class DeviceTypeSet(viewsets.ModelViewSet):
    queryset = DeviceType.objects.all()
    serializer_class = DeviceTypeSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = DeviceTypeFilter




class DeviceFilter(rest_framework_filters.FilterSet):
    Sensor__isnull = rest_framework_filters.BooleanFilter(name='Sensor__isnull',label=u"是否由传感器", method='filter_Sensor__isnull')
    
    def filter_Sensor__isnull(self, qs, name, value):
        return qs.filter(Sensor__isnull=value)

    class Meta:
        model = Device
        fields = {
            'name':['exact','in'],
            'system':['exact','in'],
            'devicetype':['exact','in'],
            'user__username':['exact'],
            # 'Sensor':['exact','isnull']

        }

class DeviceSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = DeviceFilter

    @detail_route(methods=['get'])
    def switch_off(self,request,pk):
        h = HttpRest()
        t = h.getToken()
        d = Device.objects.get(id=pk)
        h.switch_off(d.tuya_code)
        s = h.getStatus()
        # h.switch_on('23506303c44f33b30e1f')
        return JsonResponse({})

    @detail_route(methods=['get'])
    def switch_on(self,request,pk):
        h = HttpRest()
        t = h.getToken()
        d = Device.objects.get(id=pk)
        h.switch_on(d.tuya_code)
        s = h.getStatus()
        return JsonResponse({})
        # h.switch_off('23506303c44f33b30e1f')
        # h.switch_on('23506303c44f33b30e1f')
    @detail_route(methods=['get','post','delete'])
    def timer(self,request,pk):
        if request.method == 'GET':
            h = HttpRest()
            t = h.getToken()
            d = Device.objects.get(id=pk)
            p = h.getTimer(d.tuya_code)
            return JsonResponse(p)
        elif request.method == 'POST':
            # print request.data
            body = request.data
            print type(body)
            h = HttpRest()
            t = h.getToken()
            d = Device.objects.get(id=pk)
            h.delTimer(d.tuya_code)
            for t in body['timers']:
                h.setTimer(d.tuya_code,t['time'],t['functions'][0]['value'],''.join(t['loops']))
            return JsonResponse({})
        elif request.method == 'DELETE':
            request.DELETE.get('')
            return JsonResponse({})



class Device2DeviceFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Device2Device
        fields = {
            'id':['exact','in'],
            'system':['exact','in'],
        }

class Device2DeviceSet(viewsets.ModelViewSet):
    queryset = Device2Device.objects.all()
    serializer_class = Device2DeviceSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = Device2DeviceFilter
    pagination_class = None

    @list_route(methods=['post'])
    def setdevicepostion(self,request):
        x = request.POST.get('x','')
        y = request.POST.get('y','')
        device = request.POST.get('device')
        system = request.POST.get('system')
        print x,y,device,system
        Device2Device.objects.filter(system_id=system,device_from_id=device).update(position_from='{},{}'.format(x,y))
        Device2Device.objects.filter(system_id=system,device_to_id=device).update(position_to='{},{}'.format(x,y))
        return JsonResponse({})


class SensorDataFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = SensorData
        fields = {
            'id':['exact','in'],
            'sensor__device':['exact','in'],
            'stime':['gte']
        }
class SensorDataSet(viewsets.ModelViewSet):
    queryset = SensorData.objects.all()
    serializer_class = SensorDataSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = SensorDataFilter
    pagination_class = None

class TimerTuYaSet(viewsets.ModelViewSet):
    queryset = TimerTuYa.objects.all()
    serializer_class = TimerTuYaSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    # filter_class = SensorDataFilter
    # pagination_class = None
    @detail_route(methods=['get','post','delete'])
    def add2device(self,request,pk):
        body = request.data
        print body
        tuya = TimerTuYa.objects.get(id=pk)
        timers = json.loads(tuya.data)['timers']
        h = HttpRest()
        h.getToken()
        devices = body.get('devices')
        for d in devices:
            devcie = Device.objects.get(id=d)
            # h.delTimer(devcie.tuya_code)
            for t in timers:
                h.setTimer(devcie.tuya_code,t['time'],t['functions'][0]['value'],''.join(t['loops']))
        return JsonResponse({})
