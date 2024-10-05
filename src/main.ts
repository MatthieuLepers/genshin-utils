import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/plugins/router';
import GenerateModifiers from '@/plugins/GenerateModifiers';

const app = createApp(App);

app.directive('icon', {
  created(el, binding) {
    el.classList.add(`icon-${binding.arg}`);
  },
});

app.use(router);
app.use(GenerateModifiers);
app.mount('#app');
