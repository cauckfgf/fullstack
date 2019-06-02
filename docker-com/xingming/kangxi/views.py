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

class HanziFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Hanzi
        fields = {
            'bihua':['exact','in'],
            'wuxing': ['exact','in'],
        }

class HanziSet(viewsets.ModelViewSet):
    queryset = Hanzi.objects.all()
    serializer_class = HanziSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = HanziFilter
    # search_fields = ('comment','reportorg__name','location','reportername','reporttype__name','operator__name')
    # pagination_class = myPagination
    @list_route(methods=['get'])
    def xing(self,request):
        x = request.GET.get('xing','')
        level = int(request.GET.get('level',1))
        data = {}
        if x:
            data = Wuge.xing2good(x,level)
        return JsonResponse(data)