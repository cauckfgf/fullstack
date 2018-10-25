# -*- coding: utf-8 -*-
import os
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from .models import *
import traceback
import random
from any.settings import MENUS
import copy
from rest_framework import viewsets,generics,filters,pagination
from django_filters.rest_framework import DjangoFilterBackend
import rest_framework_filters
from .serializers import *

class FileSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)


@csrf_exempt
# @login_required(login_url="/login/")
def index(request):
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[0]['active'] = True
    slides = SLIDE.objects.all()
    xiaolunbo = range(6)
    # print slides,slides.count()
    return render(request, 'index.html',locals())

@csrf_exempt
# @login_required(login_url="/login/")
def about(request):
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[1]['active'] = True
    return render(request, 'about.html',locals())


@csrf_exempt
# @login_required(login_url="/login/")
def news(request):
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[2]['active'] = True
    hangye = News.objects.filter(t=1).order_by('-id')[:6]
    gongsi = News.objects.filter(t=2).order_by('-id')[:6]
    return render(request, 'index.html',locals())
    # return render(request, 'news.html',locals())


@csrf_exempt
# @login_required(login_url="/login/")
def news_detail(request,ID):
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[2]['active'] = True
    detail = News.objects.get(id=ID)
    return render(request, 'index.html',locals())
    # return render(request, 'news_detail.html',locals())

@csrf_exempt
# @login_required(login_url="/login/")
def yewu(request):
    # 业务范围
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[3]['active'] = True
    return render(request, 'index.html',locals())
    # return render(request, 'portfolio.html',locals())

@csrf_exempt
# @login_required(login_url="/login/")
def xiangmu(request):
    # 项目展示
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[4]['active'] = True
    return render(request, 'index.html',locals())
    # return render(request, 'services.html',locals())