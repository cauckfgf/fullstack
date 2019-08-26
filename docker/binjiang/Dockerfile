FROM django:1.9.8-python2 
RUN  pip install --upgrade pip
RUN  pip install djangorestframework==3.6.3
RUN  pip install djangorestframework-filters
RUN  pip install Pillow
RUN  pip install django-ckeditor
RUN  pip install ipython
RUN  pip install paho-mqtt
#RUN  pip install django-crontab
RUN mkdir /app
#ENTRYPOINT ["/docker-entrypoint.sh","runserver", "0.0.0.0:8000"]
CMD python /app/getlast.py 
