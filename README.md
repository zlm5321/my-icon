# My Icon
![输入图片说明](public/screenshot.png)

#### 介绍
提供在线图标链接，用于个人 NAS 设备显示使用，禁止用于商业用途

#### 使用
可以创建分类文件夹，上传图标，点击相应图标即可获取URL

#### 命名规范
- 分类文件夹：索引 + “_” + 文件夹名称
- 文件夹图标：Cover.png


#### 项目开发
文件介绍
- my-icon：开发源代码
- express：用于后期打包

运行项目
- npm run server
- npm run serve
- npm run start

学习Express.js
- https://blog.csdn.net/zz00008888/article/details/144242679
- https://www.jianshu.com/p/7f31a898ef17
- https://blog.csdn.net/weixin_44691608/article/details/109371958
- https://blog.csdn.net/weixin_42154189/article/details/120303054
- https://blog.51cto.com/u_16175515/12324197
- https://zhuanlan.zhihu.com/p/51479350

学习Docker打包
- https://www.oryoy.com/news/qing-song-shi-xian-express-xiang-mu-docker-hua-cong-ru-men-dao-shi-zhan-zhi-nan.html


构建镜像
- 先拉取 node 下来：docker pull node:latest
- 创建构建的文件夹中：cd /mnt/user/appdata/express
- 制作打包：docker build -t myicon .
- 创建容器：docker run -d -p 3000:3000 -v /mnt/user/appdata/myicon:/app/public/icon myicon

导出镜像
- docker ps -a
- docker export 4cffb2633446 > /mnt/user/appdata/myicon.tar

上传 Dockerhub
- https://www.cnblogs.com/JerryMouseLi/p/16040807.html
- https://blog.csdn.net/weixin_44649780/article/details/135107176