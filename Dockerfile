FROM docker.m.daocloud.io/nginx:1.21-alpine

WORKDIR /app

COPY ./dist /app

RUN cp -r ./* /usr/share/nginx/html \
    && rm -rf /app

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
