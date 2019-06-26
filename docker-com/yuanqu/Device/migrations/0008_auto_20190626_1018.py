# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2019-06-26 02:18
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Device', '0007_auto_20190625_1706'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='sensor',
            options={'verbose_name': '\u4f20\u611f\u5668', 'verbose_name_plural': '\u4f20\u611f\u5668'},
        ),
        migrations.AddField(
            model_name='sensor',
            name='device',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Device.Device', verbose_name='\u8bbe\u5907'),
        ),
        migrations.AddField(
            model_name='sensor',
            name='isnumber',
            field=models.BooleanField(default=True, verbose_name='\u662f\u5426\u662f\u6570\u503c\u91cf'),
        ),
        migrations.AddField(
            model_name='sensor',
            name='unit',
            field=models.CharField(default='\u2103', max_length=96, verbose_name='\u70b9\u4f4d\u5355\u4f4d'),
        ),
    ]
