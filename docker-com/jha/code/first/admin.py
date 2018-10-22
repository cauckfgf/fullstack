from django.contrib import admin
from models import *
import sys;
reload(sys);
sys.setdefaultencoding("utf8")
# Register your models here.
class NewsAdmin(admin.ModelAdmin):
    pass
        

admin.site.register(News, NewsAdmin)
admin.site.register(Scope, None)
admin.site.register(Leader, None)