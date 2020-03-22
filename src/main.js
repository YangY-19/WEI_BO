import Vue from 'vue'
import App from './App.vue'
import iView from 'iview'
import Antd from 'ant-design-vue'
import api from './service' // 导入api接口
import router from './router/index'
import BaiduMap from 'vue-baidu-map'
// import style

import 'iview/dist/styles/iview.css';
import 'ant-design-vue/dist/antd.css'
import './assets/styles/index.scss'
 
Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: 'YOUR_APP_KEY'
})


Vue.use(iView)
Vue.use(Antd)
Vue.config.productionTip = false

Vue.prototype.$api = api; // 将api挂载到vue的原型上

// router.beforeEach((to, from, next) => {
//   if (to.path !== '/login') {
//     if (localStorage.getItem('token')) {
//       next()
//     } else {
//       if (to.path === '/register') {
//         next()
//       } else {
//         if (to.path === '/change_password') {
//           next()
//         } else {
//           next({ path: '/login' })
//         }
//       }
//     }
//   } else {
//     next()
//   }
// })


// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     if (localStorage.getItem('isLogin')) next()
//   } else (
//     next()
//   )
// })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
