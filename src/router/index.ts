import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Announcement from '../views/Home/Announcement.vue'
import Scoreboard from '../views/Home/Scoreboard.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/announcement',
    name: 'Announcement',
    component: Announcement
  },
  {
    path: '/scoreboard',
    name: 'Scoreboard',
    component: Scoreboard
  },
  {
    path: '/docs/privacypolicy',
    name: 'PrivacyPolicy',
    component: () => import(/* webpackChunkName: "docs" */ '../views/Docs/PrivacyPolicy.vue')
  },
  {
    path: '/docs/userterms',
    name: 'UserTerms',
    component: () => import(/* webpackChunkName: "docs" */ '../views/Docs/UserTerms.vue')
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
  },
  {
    path: '/forgetpass',
    name: 'ForgetPass',
    component: () => import(/* webpackChunkName: "userAction" */ '../views/UserArea/ForgetPass.vue')
  },
  {
    path: '/resetpass',
    name: 'ResetPass',
    component: () => import(/* webpackChunkName: "userAction" */ '../views/UserArea/ResetPass.vue')
  },
  {
    path: '/myprofile',
    name: 'MyProfile',
    component: () => import(/* webpackChunkName: "userAction" */ '../views/UserArea/MyProfile.vue')
  },
  {
    path: '/userbackend',
    name: 'UserBackend',
    component: () => import(/* webpackChunkName: "userbackend" */ '../views/Admin/AdminHome.vue')
  },
  {
    path: '/userbackend/cachepurge',
    name: 'AdminCachePurge',
    component: () => import(/* webpackChunkName: "userbackend" */ '../views/Admin/CachePurge.vue')
  },
  {
    path: '/userbackend/message',
    name: 'MessageAdmin',
    component: () => import(/* webpackChunkName: "userbackend" */ '../views/Admin/Message.vue')
  },
  {
    path: '/userbackend/answerlog',
    name: 'AnswerLog',
    component: () => import(/* webpackChunkName: "userbackend" */ '../views/Admin/AnswerLog.vue')
  },
  {
    path: '/userbackend/loginlog',
    name: 'LoginLog',
    component: () => import(/* webpackChunkName: "userbackend" */ '../views/Admin/LoginLog.vue')
  },
  {
    path: '/userbackend/announcement',
    name: 'AnnouncementAdmin',
    component: () => import(/* webpackChunkName: "userbackend-editor" */ '../views/Admin/Announcement.vue')
  },
  {
    path: '/userbackend/tempanno',
    name: 'TempAnnoAdmin',
    component: () => import(/* webpackChunkName: "userbackend-editor" */ '../views/Admin/TempAnno.vue')
  },
  {
    path: '/userbackend/user',
    name: 'UserAdmin',
    component: () => import(/* webpackChunkName: "userbackend-editor" */ '../views/Admin/UserAdmin.vue')
  },
  {
    path: '/userbackend/group',
    name: 'GroupAdmin',
    component: () => import(/* webpackChunkName: "userbackend-editor" */ '../views/Admin/GroupAdmin.vue')
  },
  {
    path: '/userbackend/puzzlegroup',
    name: 'PuzzleGroupAdmin',
    component: () => import(/* webpackChunkName: "userbackend-editor" */ '../views/Admin/PuzzleGroup.vue')
  },
  {
    path: '/userbackend/puzzle',
    name: 'PuzzleAdmin',
    component: () => import(/* webpackChunkName: "userbackend-editor" */ '../views/Admin/Puzzle.vue')
  },
  {
    path: '/puzzlegrouplist',
    name: 'PuzzleGroupList',
    component: () => import(/* webpackChunkName: "game-main" */ '../views/Game/PuzzleGroupList.vue')
  },
  {
    path: '/puzzlegroup/:pgid',
    name: 'PuzzleGroupDetail',
    component: () => import(/* webpackChunkName: "game-main" */ '../views/Game/PuzzleGroupDetail.vue')
  },
  {
    path: '/puzzle/:pid',
    name: 'PuzzleDetail',
    component: () => import(/* webpackChunkName: "game-main" */ '../views/Game/PuzzleDetail.vue')
  },
  {
    path: '/finalend',
    name: 'FinalEnd',
    component: () => import(/* webpackChunkName: "game-main" */ '../views/Game/FinalEnd.vue')
  },
  {
    path: '/prologue',
    name: 'Prologue',
    component: () => import(/* webpackChunkName: "game-main" */ '../views/Game/Prologue.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
