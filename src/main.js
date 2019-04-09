import Vue from 'vue'
import App from './App'
import router from './router'
import config from '@/config'
import $ from 'jquery'
import '@/assets/styles/elements.css' // 引入element css样式
import store from './store' // 引入状态管理文件
// 引入公共样式
import '@/assets/styles/common.less'

// 引入全局样式
import '@/assets/styles/main.less'
import '@/assets/styles/media.less'

import EarthVideo from '../static/js/earthVideo'
import echarts from 'echarts'
if (process.env.NODE_ENV !== 'production') require('@/mock')
Vue.prototype.$echarts = echarts
Vue.prototype.EarthVideo = EarthVideo
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

new Vue({
  el: '#app',
  router,
  store: store,
  components: { App },
  template: '<App/>',
});
