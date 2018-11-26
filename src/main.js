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
import json from '../credentials/data.json'
import 'vue-loading-overlay/dist/vue-loading.min.css'
import Loading from 'vue-loading-overlay'

Vue.use(BootstrapVue)
Vue.use(Notifications)
Vue.use(Loading)
Vue.use(VueGoogleMaps, {
  load: {
    key: json.gmaps,
    libraries: 'places'
    // v: 'OPTIONAL VERSION NUMBER'
  }
})

Vue.config.productionTip = process.env.NODE_ENV === '"production"'

Vue.component('icon', Icon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
