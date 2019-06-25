# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from rest_framework import viewsets,generics,filters
from django_filters.rest_framework import DjangoFilterBackend
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render,render_to_response
from django.template import loader,Context,RequestContext
from django.contrib.auth.decorators import login_required
import rest_framework_filters
from  rest_framework.permissions import IsAdminUser
from .models import *
from .serializers import *
import traceback
from rest_framework_extensions.cache.mixins import CacheResponseMixin
# Create your views here.


class ConfigSet(viewsets.ModelViewSet):
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer
    permission_classes = [IsAdminUser]
