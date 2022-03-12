import Vue from 'vue';
import App from '../App.vue';
import router from '../plugins/router';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: (h) => h(App),
});
