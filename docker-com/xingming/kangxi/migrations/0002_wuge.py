# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2019-06-02 05:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kangxi', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Wuge',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField(default=0, verbose_name='\u683c\u6570')),
                ('txt', models.TextField(blank=True, null=True, verbose_name='\u5bf9\u5e94\u542b\u4e49')),
            ],
            options={
                'verbose_name': '\u4e94\u683c',
                'verbose_name_plural': '\u4e94\u683c',
            },
        ),
    ]