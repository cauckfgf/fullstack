import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    api: ''
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
