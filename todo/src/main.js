import 'todomvc-app-css/index.css'
import 'todomvc-common/base.css'
import 'todomvc-common/base.js'
import '@/assets/learn.json'

import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
