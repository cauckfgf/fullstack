FROM kstromeiraos/django-rest-framework
ADD ./package /
RUN python /package/taobao-sdk-PYTHON/setup.py install
RUN pip install djangorestframework-filters
RUN pip install top
ENTRYPOINT ["/docker-entrypoint.sh","runserver", "0.0.0.0:8000"]
#CMD python /app/manage.py runserver 0.0.0.0:8000
