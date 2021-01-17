FROM tiangolo/uwsgi-nginx-flask:python3.8

COPY ./app_wrapper /app

ENV STATIC_URL /static
ENV STATIC_PATH /app/app/static

RUN pip install -r app/requirements.txt;
