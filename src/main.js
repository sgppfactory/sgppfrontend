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

Number.prototype.formatMoney = function(places, symbol, thousand, decimal) {
	places = !isNaN(places = Math.abs(places)) ? places : 2
	symbol = symbol !== undefined ? symbol : "$"
	thousand = thousand || ","
	decimal = decimal || "."
	var number = this
	var negative = number < 0 ? "-" : ""
	var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + ""
	var j = (j = i.length) > 3 ? j % 3 : 0
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "")
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
