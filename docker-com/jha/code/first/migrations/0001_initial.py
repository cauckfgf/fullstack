# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2018-10-22 01:49
from __future__ import unicode_literals

import ckeditor_uploader.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to=b'./')),
            ],
        ),
        migrations.CreateModel(
            name='Leader',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200, null=True, verbose_name=b'\xe5\x90\x8d\xe5\xad\x97')),
                ('position', models.CharField(blank=True, max_length=200, null=True, verbose_name=b'\xe8\x81\x8c\xe4\xbd\x8d')),
                ('txt', models.TextField(blank=True, null=True, verbose_name=b'\xe5\x86\x85\xe5\xae\xb9')),
                ('en_name', models.CharField(blank=True, max_length=200, null=True, verbose_name=b'\xe5\x90\x8d\xe5\xad\x97')),
                ('en_position', models.CharField(blank=True, max_length=200, null=True, verbose_name=b'\xe8\x81\x8c\xe4\xbd\x8d')),
                ('en_txt', models.TextField(blank=True, null=True, verbose_name=b'\xe8\x81\x8c\xe4\xbd\x8d')),
                ('ntime', models.DateTimeField(blank=True, null=True, verbose_name=b'\xe5\x86\x85\xe5\xae\xb9')),
                ('images', models.ManyToManyField(to='first.File', verbose_name=b'\xe4\xb8\x9a\xe5\x8a\xa1\xe8\x8c\x83\xe5\x9b\xb4\xe5\x9b\xbe\xe7\x89\x87')),
            ],
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titile', models.CharField(blank=True, max_length=200, null=True, verbose_name=b'\xe6\x96\xb0\xe9\x97\xbb\xe6\xa0\x87\xe9\xa2\x98')),
                ('txt', ckeditor_uploader.fields.RichTextUploadingField(verbose_name=b'\xe6\x96\xb0\xe9\x97\xbb\xe5\x86\x85\xe5\xae\xb9')),
                ('en_titile', models.CharField(blank=True, max_length=200, null=True, verbose_name=b'\xe6\x96\xb0\xe9\x97\xbb\xe6\xa0\x87\xe9\xa2\x98\xe8\x8b\xb1\xe6\x96\x87')),
                ('en_txt', ckeditor_uploader.fields.RichTextUploadingField(verbose_name=b'\xe6\x96\xb0\xe9\x97\xbb\xe5\x86\x85\xe5\xae\xb9\xe8\x8b\xb1\xe6\x96\x87')),
                ('ntime', models.DateTimeField(blank=True, null=True, verbose_name=b'\xe6\x97\xa5\xe6\x9c\x9f')),
                ('t', models.IntegerField(choices=[(1, b'\xe4\xbc\x81\xe4\xb8\x9a\xe6\x96\xb0\xe9\x97\xbb'), (2, b'\xe5\x85\xac\xe5\x8f\xb8\xe6\x96\xb0\xe9\x97\xbb')], default=1, verbose_name=b'\xe4\xbc\x81\xe4\xb8\x9a\xe6\x96\xb0\xe9\x97\xbb/\xe5\x85\xac\xe5\x8f\xb8\xe6\x96\xb0\xe9\x97\xbb')),
                ('images', models.ManyToManyField(to='first.File', verbose_name=b'\xe6\x96\xb0\xe9\x97\xbb\xe5\x9b\xbe\xe7\x89\x87')),
            ],
        ),
        migrations.CreateModel(
            name='Other',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titile', models.CharField(blank=True, max_length=200, null=True, verbose_name=b'\xe4\xb8\x9a\xe5\x8a\xa1\xe8\x8c\x83\xe5\x9b\xb4\xe6\xa0\x87\xe9\xa2\x98')),
                ('txt', models.TextField(blank=True, null=True, verbose_name=b'\xe4\xb8\x9a\xe5\x8a\xa1\xe8\x8c\x83\xe5\x9b\xb4\xe5\x86\x85\xe5\xae\xb9')),
                ('en_titile', models.CharField(blank=True, max_length=200, null=True, verbose_name=b'\xe4\xb8\x9a\xe5\x8a\xa1\xe8\x8c\x83\xe5\x9b\xb4\xe6\xa0\x87\xe9\xa2\x98\xe8\x8b\xb1\xe6\x96\x87')),
                ('en_txt', models.TextField(blank=True, null=True, verbose_name=b'\xe4\xb8\x9a\xe5\x8a\xa1\xe8\x8c\x83\xe5\x9b\xb4\xe5\x86\x85\xe5\xae\xb9\xe8\x8b\xb1\xe6\x96\x87')),
                ('ntime', models.DateTimeField(blank=True, null=True, verbose_name=b'\xe6\x97\xa5\xe6\x9c\x9f')),
                ('images', models.ManyToManyField(to='first.File', verbose_name=b'\xe4\xb8\x9a\xe5\x8a\xa1\xe8\x8c\x83\xe5\x9b\xb4\xe5\x9b\xbe\xe7\x89\x87')),
            ],
        ),
        migrations.CreateModel(
            name='Scope',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titile', models.CharField(blank=True, max_length=200, null=True, verbose_name=b'\xe4\xb8\x9a\xe5\x8a\xa1\xe8\x8c\x83\xe5\x9b\xb4\xe6\xa0\x87\xe9\xa2\x98')),
                ('txt', ckeditor_uploader.fields.RichTextUploadingField(verbose_name=b'\xe4\xb8\x9a\xe5\x8a\xa1\xe8\x8c\x83\xe5\x9b\xb4\xe5\x86\x85\xe5\xae\xb9')),
                ('en_titile', models.CharField(blank=True, max_length=200, null=True, verbose_name=b'\xe4\xb8\x9a\xe5\x8a\xa1\xe8\x8c\x83\xe5\x9b\xb4\xe6\xa0\x87\xe9\xa2\x98\xe8\x8b\xb1\xe6\x96\x87')),
                ('en_txt', ckeditor_uploader.fields.RichTextUploadingField(verbose_name=b'\xe4\xb8\x9a\xe5\x8a\xa1\xe8\x8c\x83\xe5\x9b\xb4\xe5\x86\x85\xe5\xae\xb9\xe8\x8b\xb1\xe6\x96\x87')),
                ('ntime', models.DateTimeField(blank=True, null=True, verbose_name=b'\xe6\x97\xa5\xe6\x9c\x9f')),
                ('images', models.ManyToManyField(to='first.File', verbose_name=b'\xe4\xb8\x9a\xe5\x8a\xa1\xe8\x8c\x83\xe5\x9b\xb4\xe5\x9b\xbe\xe7\x89\x87')),
            ],
        ),
    ]
