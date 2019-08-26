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







# class DeviceTypeFilter(rest_framework_filters.FilterSet):
#     class Meta:
#         model = DeviceType
#         fields = {
#             'name':['exact','in'],
#         }

# class DeviceTypeSet(viewsets.ModelViewSet):
#     queryset = DeviceType.objects.all()
#     serializer_class = DeviceTypeSerializer
#     filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
#     filter_class = DeviceTypeFilter



