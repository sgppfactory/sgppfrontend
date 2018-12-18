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
import AddTask from '@/components/AddTask'
import Porpose from '@/components/Porpose'
import AddPorpose from '@/components/AddPorpose'

const NotFound = { template: '<p>Page not found</p>' }

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
      path: '/showreport',
      name: 'ShowReport',
      component: AddReport
    }, {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks
    }, {
      path: '/addtasks',
      name: 'AddTask',
      component: AddTask
    }, {
      path: '/addporpose',
      name: 'AddPorpose',
      component: AddPorpose
    }, {
      path: ':path',
      name: '404',
      component: NotFound
    }
  ]
})
