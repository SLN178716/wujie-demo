import type { RouteProps } from 'react-router-dom';

import HelloPage from '../views/hello';
import HomePage from '../views/home';

const router: RouteProps[] = [
  { path: '/', element: HomePage() },
  { path: '/hello', element: HelloPage() },
];

export default router;
