# -*- coding: utf-8 -*-
from rest_framework.pagination import PageNumberPagination

class GlobalPageNumberPagination(PageNumberPagination):
    def __init__(self):
        super(GlobalPageNumberPagination, self).__init__()
        self.page_size_query_param = 'pagesize'
        self.max_page_size = 100  # 这个设置很重要
 

