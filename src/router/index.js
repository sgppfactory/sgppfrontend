import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Reports from '@/components/Reports'
import Tasks from '@/components/Tasks'
import Home from '@/components/Home'
import UserConfig from '@/components/UserConfig'
import PersonsHome from '@/components/Persons'
import Addperson from '@/components/Addperson'
import AppConfiguration from '@/components/AppConfiguration'
import AddStructure from '@/components/AddStructure'
import AddReport from '@/components/AddReport'
import Porpose from '@/components/Porpose'

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
    }, {
      path: '/addstructure',
      name: 'AddStructure',
      component: AddStructure
    }, {
      path: '/porposes_projects',
      name: 'PorposesProjects',
      component: Porpose
    }, {
      path: '/reports',
      name: 'Reports',
      component: Reports
    }, {
      path: '/addreport',
      name: 'AddReport',
      component: AddReport
    }, {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks
    }
  ]
})
