import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/components/Login/Login.vue'
import Home from '@/components/Home/Home.vue'
import Welcome from '@/components/Welcome/Welcome.vue'
import Users from '@/components/Users/Users.vue'
import Rights from '@/components/Power/Rights.vue'
import Roles from '@/components/Power/Roles.vue'

import store from '@/store'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
    ],
  },
]

const router = new VueRouter({
  routes,
})

// 前置导航守卫
router.beforeEach((to, from, next) => {
  const permissionsPath = ['/home', '/welcome', '/users']
  // 判断要跳转的页面有没有权限
  const token = store.state.userInfo.token
  if (permissionsPath.indexOf(to.path) !== -1) {
    // 如果有token则直接放行
    if (token) {
      return next()
    } else {
      // 如果没有则强制跳转至登录页
      return next('/login')
    }
  } else return next()
})

export default router
