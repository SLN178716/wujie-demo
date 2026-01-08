import { createRouter, createWebHistory } from 'vue-router';

const staticRoutes = [
  {
    path: '/',
    component: () => import('@/views/system/404'),
  },
  {
    path: '/dashboard',
    component: () => import('@/views/pages/dashboard/index.vue'),
  },
  {
    path: '/test',
    component: () => import('@/views/system/test.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: staticRoutes, // 初始只加载静态路由
});

export default router;
