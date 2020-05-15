import Vue from 'vue'
import App from './App.vue'
import router from './router'
import globalConst from './plugins/globalConst'
import './plugins/element.js'

Vue.use(globalConst);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
