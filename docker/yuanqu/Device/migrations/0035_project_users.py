# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2019-11-18 12:19
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Device', '0034_auto_20191114_1015'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='users',
            field=models.ManyToManyField(blank=True, related_name='Project2Users', to=settings.AUTH_USER_MODEL, verbose_name='\u80fd\u770b\u5230\u8be5\u7ad9\u70b9\u7684\u4eba'),
        ),
    ]
