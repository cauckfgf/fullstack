# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
import rest_framework_filters
from rest_framework import viewsets,generics,pagination,filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import *
from .serializers import *
from rest_framework.decorators import detail_route, list_route

# Create your views here.

class SystemFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = System
        fields = {
            'name' : ['exact','in'],
            'create_time' : ['month__gte']
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
    class Meta:
        model = Device
        fields = {
            'name':['exact','in'],
            'system':['exact','in'],
        }

class DeviceSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = DeviceFilter




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