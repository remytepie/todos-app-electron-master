import { createRouter, createWebHashHistory } from 'vue-router';

import VinPage from '../pages/VinPage.vue';
import VinDetailsPage from '../pages/VinDetailsPage.vue';
import MouvementsPage from '../pages/MouvementsPage.vue';
import AdminPage from '../pages/AdminPage.vue';
import { useAuth } from '../services/authService';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/vins' },
    { path: '/vins', component: VinPage },
    { path: '/vin/:id', component: VinDetailsPage },
    { path: '/mouvements', component: MouvementsPage },
    { path: '/admin', component: AdminPage, meta: { requiresAdmin: true } },
  ],
});

router.beforeEach((to) => {
  const { isAdmin } = useAuth();

  if (to.meta.requiresAdmin && !isAdmin.value) {
    return '/vins';
  }
});

export default router;
