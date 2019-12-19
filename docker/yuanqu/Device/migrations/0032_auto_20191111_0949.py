# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2019-11-11 09:49
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Device', '0031_auto_20191111_0945'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='device',
            name='users',
        ),
        migrations.AddField(
            model_name='device',
            name='users',
            field=models.ManyToManyField(blank=True, null=True, related_name='device2Users', to=settings.AUTH_USER_MODEL, verbose_name='\u6536\u85cf\u8bbe\u5907\u7684\u4eba'),
        ),
    ]
