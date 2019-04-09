export default [
  {
    path: '/',
    redirect:'/home'
  },
  {
    path: '/home',
    name: '首页',
    title: '大屏指挥',
    component: resolve => {
      require(['@/pages/index.vue'], resolve)
    }
  },
  {
    path: '/401',
    name: 'error_401',
    title: '401错误页面',
    meta: {
      hideInMenu: true
    },
    component: resolve => {
      require(['@/pages/error-page/401.vue'], resolve)
    }
  },
  {
    path: '/500',
    name: 'error_500',
    title: '500错误页面',
    meta: {
      hideInMenu: true
    },
    component: resolve => {
      require(['@/pages/error-page/500.vue'], resolve)
    }
  },
  {
    path: '*',
    name: 'error_404',
    title: '404错误页面',
    meta: {
      hideInMenu: true
    },
    component: resolve => {
      require(['@/pages/error-page/404.vue'], resolve)
    }
  }
]
