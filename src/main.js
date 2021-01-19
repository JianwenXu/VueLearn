import Vue from 'vue'
import App from './App.vue'
// import router from './krouter'
import router from './router'
// import store from './kstore'
import store from './store'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    globalTest() {
      console.log('全局混入测试');
    }
  },
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
