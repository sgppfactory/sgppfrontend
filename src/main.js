// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Icon from 'vue-awesome/components/Icon'
import * as VueGoogleMaps from 'vue2-google-maps'
import Notifications from 'vue-notification'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyD5TNutABwoO3iri3CedTXyStO6wxcyoMI'
    // v: 'OPTIONAL VERSION NUMBER'
  }
})
Vue.use(BootstrapVue)
Vue.use(Notifications)

Vue.config.productionTip = false

Vue.component('icon', Icon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
