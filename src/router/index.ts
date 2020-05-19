import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/reg',
    name: 'Reg',
    component: () => import(/* webpackChunkName: "userAction" */ '../views/UserArea/Reg.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "userAction" */ '../views/UserArea/Login.vue')
  },
  {
    path: '/repass',
    name: 'RePass',
    component: () => import(/* webpackChunkName: "userAction" */ '../views/UserArea/RePass.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
