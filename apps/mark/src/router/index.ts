export const routes = [
  {
    path: '/',
    component: () => import('../views/Home'),
  },
  {
    path: '/about',
    component: () => import('../views/About'),
  },
];
