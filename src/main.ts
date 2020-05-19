import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import globalConst from '@/plugins/globalConst'
import '@/theme/ccxc-dark.scss'

Vue.use(Element);


Vue.use(globalConst);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
