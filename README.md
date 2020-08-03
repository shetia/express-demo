<!--
 * @Descripttion:
 * @version:
 * @Author: shetia
 * @Date: 2019-09-03 20:47:32
 * @LastEditors: somebody
 * @LastEditTime: 2020-08-02 17:27:38
-->
# express-demo
本demo结合express+node+mysql，实现前后端增删改查和文件上传。

## 起步

克隆代码
```
git clone https://github.com/shetia/express-demo.git
```

安装依赖
```
# 进入项目文件夹
cd .\express-demo

#安装依赖
cnpm i
```
运行服务
```js
// 在终端打开bin文件夹
// 启动后端服务
node www
// 在根文件夹打开终端
// 启动前端
npm start
```

查看mysql是否启动，新建个数据库**abc**，把 **userlist.sql** 和 **uploadfiless.sql** 导入数据库中

然后就可以在**test**文件夹内查看演示,由于图片路径和服务器方式打开的html上传后会刷新页面的原因，
目前建议使用本地方式打开html演示文件，正在寻找解决方案，有大佬知道的话，欢迎留言告知，万分感谢！