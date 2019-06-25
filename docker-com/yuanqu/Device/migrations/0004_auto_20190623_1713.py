# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2019-06-23 09:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Device', '0003_device2device'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='devicetype',
            name='icon',
        ),
        migrations.AddField(
            model_name='devicetype',
            name='icon1',
            field=models.FileField(blank=True, null=True, upload_to=b'', verbose_name='\u8bbe\u5907\u62d3\u6251\u56fe\u72b6\u60011\u56fe\u6807'),
        ),
        migrations.AddField(
            model_name='devicetype',
            name='icon2',
            field=models.FileField(blank=True, null=True, upload_to=b'', verbose_name='\u8bbe\u5907\u62d3\u6251\u56fe\u72b6\u60012\u56fe\u6807'),
        ),
        migrations.AddField(
            model_name='devicetype',
            name='icon3',
            field=models.FileField(blank=True, null=True, upload_to=b'', verbose_name='\u8bbe\u5907\u62d3\u6251\u56fe\u72b6\u60013\u56fe\u6807'),
        ),
    ]
