# -*- coding: utf-8 -*-
import xadmin
from xadmin import views
from .models import *

class MenuAdmin(object):
    list_editable = ('name','icon', 'url','parent','isshow')
    list_display = ('name','icon', 'url','parent','isshow')
xadmin.site.register(Menu, MenuAdmin)

# class MobileMenuAdmin(object):
#     list_editable = ('name', 'path','parent','isshow','icon')
#     list_display = ('name', 'path','parent','isshow','icon')
# xadmin.site.register(MobileMenu, MobileMenuAdmin)