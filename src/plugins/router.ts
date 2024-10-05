import { createWebHashHistory, createRouter } from 'vue-router';

import ResinView from '@/views/ResinView.vue';
import MaterialsView from '@/views/MaterialsView.vue';

const routes = [
  { path: '/', name: 'Resin', component: ResinView },
  { path: '/materials', name: 'Materials', component: MaterialsView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
