FROM kstromeiraos/django-rest-framework
ADD ./package /
RUN pip install djangorestframework-filters
RUN pip install django-ckeditor
RUN pip install Pillow
RUN pip install ipython
ENTRYPOINT ["/docker-entrypoint.sh","runserver", "0.0.0.0:8000"]
#CMD python /app/manage.py runserver 0.0.0.0:8000
