FROM docker.m.daocloud.io/nginx:1.21-alpine

WORKDIR /app

COPY . /app

EXPOSE 80

COPY nginx.conf /etc/nginx/nginx.conf

RUN cp -r dist/* /usr/share/nginx/html \
    && rm -rf /app
