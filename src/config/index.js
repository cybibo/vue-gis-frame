export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '道枢-前端开发框架',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  baseUrl: {
    dev: 'http://10.168.4.14:9080',
    pro: 'http://15.128.22.21:9080',
    tes: 'http://10.168.4.242:9080'
  },
  messageUrl: {
    dev: 'http://10.168.4.172:8083',
    pro: 'http://15.128.22.21:8083',
    tes: 'http://10.168.4.242:8083'
  },
  eventUrl: {
    dev:'http://10.168.4.14:9080',
    pro:'http://15.128.22.21:9080',
    tes:'http://10.168.4.242:9080'
  },
  adminUrl: {
    dev:'http://10.168.4.14:9080',
    pro:'http://15.128.22.21:9080',
    tes:'http://10.168.4.242:9080'
  },
  activUrl: {
    dev:'http://15.128.21.192:8080/service',
    pro:'http://15.128.21.192:8080/service',
    tes:'http://15.128.21.192:8080/service'
  },
  login:false,
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}
