import { createRouter, createWebHistory } from 'vue-router';

const staticRoutes = [
  {
    path: '/',
    component: () => import('@/views/system/404'),
  },
  {
    path: '/demo1',
    component: () => import('@/views/demo1.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: staticRoutes, // 初始只加载静态路由
});

export default router;
