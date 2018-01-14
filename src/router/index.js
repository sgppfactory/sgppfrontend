import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import UserConfig from '@/components/UserConfig'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    {
      path: '/',
      redirect: { name: 'Login' }
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/home',
      name: 'Home',
      component: Home
    }, {
      path: '/userconfig',
      name: 'UserConfig',
      component: UserConfig
    }
  ]
})
