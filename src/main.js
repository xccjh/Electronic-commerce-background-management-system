// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'

// 引入store
import store from '@/store/store.js'

// 引入element-ui
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import VueAMap from 'vue-amap'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ECharts from 'vue-echarts'
Vue.use(VueAMap)
// 使用ElementUI框架
Vue.use(ElementUI)

Vue.config.productionTip = false
// 使用富文本编辑器
Vue.use(VueQuillEditor)
Vue.component('chart', ECharts)

// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '6a204f2b675f32f8849ec4b6b7c21e5c',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
})

// 添加路由全局守卫
router.beforeEach((to, from, next) => {
  // 1.获取令牌：token
  var token = localStorage.getItem('mytoken')
  // 如果token有值，说明曾经登陆地 ，说明拥有合法访问的令牌
  if (token) {
    next()
  } else {
    // 如果是访问默认可以访问的页，如登陆，那么也不需要有令牌
    if (to.path === '/login') { // 判断是不是访问登陆页面
      next()
    } else {
      next({path: '/login'})
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 注入store--使用store
  store: store,
  components: { App },
  template: '<App/>'
})
