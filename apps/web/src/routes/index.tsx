import { createBrowserRouter } from 'react-router-dom';

import { PublicLayout } from '@/layouts/PublicLayout';
import { DevCheckRoute } from '@/routes/DevCheckRoute';
import { AppRoute } from '@/utils/routeUtils/routes';

export const router = createBrowserRouter([
  {
    path: AppRoute.HOME,
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <DevCheckRoute />,
      },
    ],
  },
]);
