import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    component: () => import('../views/Index.vue'),
    children: [{
        path: '/',
        component: () => import('../views/Main.vue'),
      },
      {
        path: '/user',
        component: () => import('../views/User.vue'),
      },
      {
        path: '/person',
        component: () => import('../views/Person.vue'),
      },
      {
        path: '/goods',
        component: () => import('../views/Goods.vue'),
      },
      {
        path: '/role',
        component: () => import('../views/Role.vue'),
      },
      {
        path: '/goodsCategory',
        component: () => import('../views/GoodsCategory.vue'),
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router