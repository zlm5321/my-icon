# 使用Node.js镜像作为基础
FROM node

# 设置工作目录
WORKDIR /app

# 复制文件
COPY . /app

#设置挂载点
COPY /public/icon /icon
VOLUME ["/icon"]

# 安装项目依赖
RUN npm install

# 暴露应用端口
EXPOSE 3000

# 运行应用
CMD npm start