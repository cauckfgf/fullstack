FROM python:2.7.14-alpine
RUN pip install --upgrade pip 
RUN pip install Flask
RUN pip install Flask-APScheduler
RUN pip install apscheduler
RUN pip install SQLAlchemy 
RUN mkdir -p /var/www
CMD python /var/www/flask-ap.py
