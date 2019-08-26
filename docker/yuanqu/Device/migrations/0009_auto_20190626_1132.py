# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2019-06-26 03:32
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Device', '0008_auto_20190626_1018'),
    ]

    operations = [
        migrations.AddField(
            model_name='sensor',
            name='status',
            field=models.IntegerField(default=0, verbose_name='\u72b6\u6001'),
        ),
        migrations.AlterField(
            model_name='sensor',
            name='device',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Sensor', to='Device.Device', verbose_name='\u8bbe\u5907'),
        ),
    ]
