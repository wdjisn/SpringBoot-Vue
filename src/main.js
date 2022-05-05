import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import './assets/css/element-variables.scss'
import './assets/css/main.css';
import './assets/css/color-dark.css';
import VueClipboard from 'vue-clipboard2'
import echarts from 'echarts'

Vue.use(VueClipboard)
Vue.use(Element, { size: 'small', zIndex: 3000 })
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

// 使用钩子函数对路由进行权限验证
router.beforeEach((to, from, next) => {
  var menu = sessionStorage.getItem('spba-menu');
  if (to.path == '/login') {
    next()
  } else if (to.path !== '/login' && !menu) {
    next('/login')
  } else if (menu) {
    var lock = false
    var menuJson = JSON.parse(menu)
    menuJson.forEach(function (item, index) {
      item.children.forEach(function (val, key) {
        if (to.path == '/' + val.path) {
            lock = true
            return false
        }
      })
    })
    if (lock == false) {
      sessionStorage.removeItem("spba-username")
      sessionStorage.removeItem("spba-avatar")
      sessionStorage.removeItem("spba-token")
      sessionStorage.removeItem("spba-menu")
      sessionStorage.removeItem("spba-perms")
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
