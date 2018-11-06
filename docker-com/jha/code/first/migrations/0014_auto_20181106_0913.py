# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2018-11-06 01:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('first', '0013_auto_20181025_1531'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='news',
            name='images',
        ),
        migrations.AddField(
            model_name='news',
            name='author',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name=b'\xe4\xbd\x9c\xe8\x80\x85'),
        ),
        migrations.AddField(
            model_name='news',
            name='image',
            field=models.ImageField(default='', upload_to=b'upload/', verbose_name=b'\xe6\x96\xb0\xe9\x97\xbb\xe5\x9b\xbe\xe7\x89\x87'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='news',
            name='pageviews',
            field=models.IntegerField(default=0, verbose_name=b'\xe6\xb5\x8f\xe8\xa7\x88\xe9\x87\x8f'),
        ),
        migrations.AddField(
            model_name='news',
            name='shorttxt',
            field=models.IntegerField(default=0, verbose_name=b'\xe6\x96\xb0\xe9\x97\xbb\xe7\xae\x80\xe4\xbb\x8b'),
        ),
    ]
