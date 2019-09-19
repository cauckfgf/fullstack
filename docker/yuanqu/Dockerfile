FROM django:1.9.8-python2 
RUN  pip install --upgrade pip
RUN  pip install djangorestframework==3.6.3
RUN  pip install djangorestframework-filters
RUN  pip install Pillow
RUN  pip install django-ckeditor
RUN  pip install ipython
RUN pip install python-dateutil
RUN pip install crypto
RUN mkdir /app
ADD  ./widgets.py /usr/local/lib/python2.7/site-packages/ckeditor/widgets.py 
#ENTRYPOINT ["/docker-entrypoint.sh","runserver", "0.0.0.0:8000"]
CMD python /app/manage.py runserver 0.0.0.0:8000
