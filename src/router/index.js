import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'zhome',
    component: () => import('../contianer/square/index.vue'),
    meta: {
      title: '首页',
      exclude: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../contianer/login-register/login.vue'),
    meta: {
      title: '登录',
      exclude: false
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../contianer/home/index.vue'),
    meta: {
      title: '首页',
      exclude: true
    }
  },
  {
   path: '/personalCenter/:id',
   name: 'personalCenter',
   component: () => import('../contianer/personal-center/index.vue'),
   meta: {
    title: '个人中心',
    exclude: true
   }
  //  children: [
  //    {
  //       path: ':id',
  //       component: () => import('../contianer/personal-center/index.vue'),
  //    }
  //  ]
  },
  {
    path: '/square',
    name: 'square',
    component: () => import('../contianer/square/index.vue'),
    meta: {
      title: '广场',
      exclude: true
    }
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('../contianer/setting/index.vue'),
    meta: {
      title: '设置',
      exclude: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
