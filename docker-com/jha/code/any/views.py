# -*- coding: utf-8 -*-
from django.shortcuts import render,render_to_response
# Create your views here.
#from django.contrib import auth
#from django.template import RequestContext
#from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect, csrf_exempt
#from django.contrib.auth.decorators import login_required
#import time,traceback
#from rest_framework import viewsets,generics,filters
#from django_filters.rest_framework import DjangoFilterBackend
# from django.contrib.auth.models import User as DjangoUser
#import sys, urllib2, json
from any.settings import MENUS
import copy

@csrf_exempt
# @login_required(login_url="/login/")
def index(request):
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[0]['active'] = True
    return render(request, 'index.html',locals())



@csrf_exempt
# @login_required(login_url="/login/")
def index2(request):
    # return render_to_response('index.html')
    return render(request, 'index2.html',locals())

@csrf_exempt
# @login_required(login_url="/login/")
def ditu(request):
    # return render_to_response('index.html')
    return render(request, 'map.html',locals())

@csrf_exempt
def page_not_found(request):
    if request.path[-1]=='/':
        return render_to_response('error/error_404.html')
    else:
        return HttpResponseRedirect(request.path+'/')
 
@csrf_exempt
def page_error(request):
    if request.path[-1]=='/':
        return render_to_response('error/error_500.html')
    else:
        return HttpResponseRedirect(request.path+'/')