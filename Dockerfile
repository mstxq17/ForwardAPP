# 引用镜像
FROM node
# 作者
MAINTAINER xq17

# 执行命令，创建文件夹
RUN mkdir -p /home/ForwardApp

# 添加应用目录
ADD ./server /home/ForwardApp

# 添加 etcd
COPY ./tools/etcd-v2.2.5-linux-amd64.tar.gz /home/ForwardApp/etcd-v2.2.5-linux-amd64.tar.gz
# 设置app应用目录
WORKDIR /home/ForwardApp

# 添加国内源
ADD ./sources.list /etc/apt/

# 更新系统软件
RUN apt update -y && apt upgrade -y
# 安装etcd
RUN apt-get install -y golang
# RUN curl -L  https://github.com/coreos/etcd/releases/download/v2.2.5/etcd-v2.2.5-linux-amd64.tar.gz -o etcd-v2.2.5-linux-amd64.tar.gz
RUN tar xzvf etcd-v2.2.5-linux-amd64.tar.gz
RUN cp ./etcd-v2.2.5-linux-amd64/etcd* /usr/local/bin/
# 修改yarn源
RUN yarn config set registry https://registry.npm.taobao.org
# 安装依赖及构建node应用
RUN yarn install
RUN yarn global add nodemon --verbose

# 配置系统变量，指定端口
ENV HOST 0.0.0.0
ENV PORT 3000

EXPOSE 3000

# 自动启动APP
CMD [ "yarn", "start" ]

# 建立镜像
# docker build -t xq17/forwardapp:v1 .

# 建立服务
# docker run -d -v $(pwd)/server:/home/ForwardApp -p 8086:3000 xq17/forwardapp:v1