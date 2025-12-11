# 选择node镜像
FROM docker.m.daocloud.io/nginx:1.21-alpine

# 指定工作目录
WORKDIR /app

# 把当前所有目录下文件拷贝到工作目录
COPY . /app/

COPY ./replace.sh /

RUN chmod +x /replace.sh
# 运行时容器提供服务端口
EXPOSE 80


# 1. 安装依赖
# 2. 构建打包
# 3. 把dist目录下文件拷贝到 nginx目录下
# 4. 删除工作目录下的文件 减少镜像体积

RUN cp -r dist/* /usr/share/nginx/html \
    && rm -rf /app

# RUN npm install --registry=https://registry.npm.taobao.org \
#    && npm run build \
#    && cp -r dist/* /var/www/html \
#    && rm -rf /app

# 启动nginx
CMD ["/replace.sh"]
# CMD ["nginx", "-g", "daemon off;"]
