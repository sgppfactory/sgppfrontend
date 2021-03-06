// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Icon from 'vue-awesome/components/Icon'
import Notifications from 'vue-notification'
import 'vue-loading-overlay/dist/vue-loading.min.css'
import Loading from 'vue-loading-overlay'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import exportingInit from 'highcharts/modules/exporting'
// import GoogleMapsLoader from 'google-maps'
import * as VueGoogleMaps from 'vue2-google-maps'
import json from '../credentials/data.json'

exportingInit(Highcharts)
stockInit(Highcharts)

Vue.use(HighchartsVue)
Vue.use(BootstrapVue)
Vue.use(Notifications)
Vue.use(Loading)
// Vue.use(GoogleMapsLoader)

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
