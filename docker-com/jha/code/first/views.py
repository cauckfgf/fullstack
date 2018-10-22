# -*- coding: utf-8 -*-
import os
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from .models import *





import traceback

import random

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
def news(request):
    # return render_to_response('index.html')
    return render(request, 'blog.html',locals())