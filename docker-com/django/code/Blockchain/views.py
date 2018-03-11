# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, csrf_exempt

from rest_framework import viewsets,generics,filters,pagination
from django_filters.rest_framework import DjangoFilterBackend
import rest_framework_filters
from .serializers import *

class TransactionsSet(viewsets.ModelViewSet):
    """docstring for ClassName"""
    queryset = Transactions.objects.all()
    serializer_class = TransactionsSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)



class BlockSet(viewsets.ModelViewSet):
    """docstring for ClassName"""
    queryset = Block.objects.all()
    serializer_class = BlockSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
