import Vue from 'vue';
import App from './App';
import router from './plugins/router';

Vue.config.productionTip = false;

new Vue({
  components: { App },
  template: '<App/>',
  router,
}).$mount('#app');
