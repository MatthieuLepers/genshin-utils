import Vue from 'vue';
import VueRouter from 'vue-router';
import ResinView from '../views/ResinView';
import MaterialsView from '../views/MaterialsView';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Resin', component: ResinView },
  { path: '/materials', name: 'Materials', component: MaterialsView },
];

const router = new VueRouter({
  routes,
});

export default router;
