FROM docker.m.daocloud.io/nginx:1.21-alpine

WORKDIR /app

COPY . /app

RUN cp -r dist/* /usr/share/nginx/html \
    && rm -rf /app

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
