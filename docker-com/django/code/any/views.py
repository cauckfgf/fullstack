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

@csrf_exempt
# @login_required(login_url="/login/")
def index(request):
    # return render_to_response('index.html')
    return render(request, 'index.html',locals())
