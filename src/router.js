import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/split',
      name: 'split',
      component: () => import(/* webpackChunkName: "split" */ './views/split.vue')
    },
    {
      path: '/split-responsive',
      name: 'split-responsive',
      component: () => import(/* webpackChunkName: "split" */ './views/split-responsive.vue')
    },
    {
      path: '/tree-view',
      name: 'tree-view',
      component: () => import(/* webpackChunkName: "tree-view" */ './views/tree-view.vue')
    },
    {
      path: '/master-detail',
      name: 'master-detail',
      component: () => import(/* webpackChunkName: "master-detail" */ './views/master-detail.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '*',
      component: () => import(/* webpackChunkName: "404" */ './views/404.vue')
    }
  ]
})
