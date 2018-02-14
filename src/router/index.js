import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import UserConfig from '@/components/UserConfig'
import PersonsHome from '@/components/Persons'
import Addperson from '@/components/Addperson'
import AppConfiguration from '@/components/AppConfiguration'

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
    }, {
      path: '/persons',
      name: 'Persons',
      component: PersonsHome
    }, {
      path: '/modperson/:personId',
      name: 'modperson',
      component: Addperson
    }, {
      path: '/addperson',
      name: 'Addperson',
      component: Addperson
    }, {
      path: '/config_system',
      name: 'AppConfiguration',
      component: AppConfiguration
    }
  ]
})
