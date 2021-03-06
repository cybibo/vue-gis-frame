### 目录结构

```bash
├── README.md
├── build 					    # 编译输出目录
|  ├── build.js
|  ├── check-versions.js
|  ├── logo.png
|  ├── utils.js
|  ├── vue-loader.conf.js
|  ├── webpack.base.conf.js
|  ├── webpack.dev.conf.js
|  ├── webpack.prod.conf.js
|  └── webpack.test.conf.js
├── config 						# 环境配置文件
|  ├── dev.env.js
|  ├── index.js
|  ├── prod.env.js
|  └── test.env.js
├── docs 						# 项目文档
├── index.html
├── node_modules 				# node安装依赖包
├── package-lock.json
├── package.json
├── src 						# 项目源码目录
|  ├── App.vue
|  ├── api 						# API请求
|  ├── assets 					# 图片等资源文件,目录中的文件会被webpack处理解析为模块依赖，只支持相对路径形式
|  ├── components 				# 通用组件
|  ├── main.js 					# 入口文件
|  ├── mock 					# API请求拦截器
|  ├── pages 					# 页面文件夹
|  ├── resources 				# mock 数据源
|  ├── router 					# 路由文件夹
|  ├── store 					# 状态管理文件夹
|  └── utils  					# 工具库文件夹
├── static  					# 静态资源文件，目录下的文件并不会被Webpack处理:会直接被复制到最终的打包目录下。必须使用绝对路径
|  └── styles					# 通用样式文件夹
└── test  						# 测试案例文件夹
   ├── e2e
   └── unit
├── .babelrc		 			# 设置转码的规则和插件
├── package.json     			# 项目信息
├── .eslintrc        			# Eslint配置

```
### 快速开始

克隆项目文件:

```bash
git clone 
```

进入目录安装依赖:

```bash
npm install
```

开发：

```bash
npm run dev
打开 http://localhost:8083
```

构建：

```bash
#构建生产环境
npm run build
#构建生产环境并查看打包分析报告
npm run build --report
```

代码检测：

```bash
npm run lint
```
```bash
# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## FAQ


```bash

测试 环境 ：						
预发布环境：						
生产环境：

 ```
