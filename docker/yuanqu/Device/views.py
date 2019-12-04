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
            'users' : ['exact'],
        }

class ProjectSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = ProjectFilter

class SystemTypeSet(viewsets.ModelViewSet):
    queryset = SystemType.objects.all()
    serializer_class = SystemTypeSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    # filter_class = SystemFilter

    @detail_route(methods=['get'])
    def devicetype(self,request,pk):
        devicetype_ids = set(Device.objects.filter(system_id=pk,Sensor__isnull=False).exclude(devicetype_id=4).values_list('devicetype_id',flat=True))
        r = DeviceType.objects.filter(id__in=devicetype_ids).values('id','name')
        return JsonResponse({'data':list(r)})

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

    @detail_route(methods=['get'])
    def devicetype(self,request,pk):
        devicetype_ids = set(Device.objects.filter(system_id=pk,Sensor__isnull=False).exclude(devicetype_id=4).values_list('devicetype_id',flat=True))
        r = DeviceType.objects.filter(id__in=devicetype_ids).values('id','name')
        return JsonResponse({'data':list(r)})


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
            'name':['exact','in','contains'],
            'system':['exact','in'],
            'devicetype':['exact','in'],
            'user__username':['exact'],
            # 'Sensor':['exact','isnull']

        }

class DeviceSet(viewsets.ModelViewSet):
    queryset = Device.objects.all().distinct()
    serializer_class = DeviceSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = DeviceFilter
    @list_route(methods=['get'])

    def userinfo(self,request):
        islogin = request.user.is_authenticated()
        return JsonResponse({
            'islogin' : islogin,
            'username' : request.user.username if islogin else "游客",
            'is_staff': request.user.is_staff if islogin else False
        })

    @list_route(methods=['get'])
    def fenlei(self,request):
        dnames = Device.objects.filter(devicetype=24).values_list('name',flat=True)
        data = []
        for each in dnames:
            data.append(each.split('-')[0])
        return JsonResponse({'results':list(set(data))})

    @list_route(methods=['post'])
    def shoucang(self,request):
        devices = request.POST.getlist('devices[]',[])
        devices_all = request.POST.getlist('devices_all[]',[])
        user = request.user
        for device in Device.objects.filter(id__in=devices_all):
            device.users.remove(user)
        for device in Device.objects.filter(id__in=devices):
            device.users.add(user)
        return JsonResponse({})

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
    def infraredStatus(self,request,pk):
        h = HttpRest()
        t = h.getToken()
        d = Device.objects.get(id=pk)
        # h.switch_on('23506303c44f33b30e1f')
        return JsonResponse(h.getStatusinfrared_one(d))
    
    @detail_route(methods=['post'])
    def infraredSend(self,request,pk):
        h = HttpRest()
        t = h.getToken()
        d = Device.objects.get(id=pk)
        # h.switch_on('23506303c44f33b30e1f')
        power = request.POST.get('power',None)
        mode = request.POST.get('mode',None)
        temp = request.POST.get('temp',None)
        wind = request.POST.get('wind',None)
        swing = request.POST.get('swingg',None)
        # print power,mode,temp,wind,swing
        # h.infraredSend(d, power=None, mode=None, temp=None, wind=None, swing=None)
        return JsonResponse(h.infraredSend(d, power=power, mode=mode, temp=temp, wind=wind, swing=swing))
        # return JsonResponse(h.getStatusinfrared_one(d))

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
        r = {}
        for d in devices:
            devcie = Device.objects.get(id=d)
            # h.delTimer(devcie.tuya_code)
            for t in timers:
                r = h.setTimer(devcie.tuya_code,t['time'],t['functions'][0]['value'],''.join(t['loops']))
        return JsonResponse(r)
