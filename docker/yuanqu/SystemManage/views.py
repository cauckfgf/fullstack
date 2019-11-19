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
# from rest_framework_extensions.cache.mixins import CacheResponseMixin
# Create your views here.


class ConfigSet(viewsets.ModelViewSet):
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer
    permission_classes = [IsAdminUser]

class UserFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = User
        fields = {
            'groups' : ['exact'],
        }

class UserSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = UserFilter
    permission_classes = [IsAdminUser]

class GroupSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class AuthSet(viewsets.ModelViewSet):
    queryset = Auth.objects.all()
    serializer_class = AuthSerializer
    # permission_classes = [IsAdminUser]
    

    