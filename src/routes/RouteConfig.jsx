import AdminLayout from '../components/layout/AdminLayout.jsx';
import HomeLayout from '../components/layout/HomeLayout.jsx';
import LoginLayout from '../components/layout/LoginLayout.jsx';

import LoginPage from '../features/auth/pages/LoginPage.jsx';
import RegistrationPage from '../features/auth/pages/RegistrationPage.jsx';
import DashboardPage from '../features/dashboard/pages/DashboardPage.jsx';
import Profile from '../features/dashboard/pages/Profile.jsx';
import HomePage from '../features/home/pages/HomePage.jsx';
import AuthGuard from './AuthGuard';

export const routeConfig = [
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { path: '', element: <HomePage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginLayout />,
    children: [
      { path: '', element: <LoginPage /> },
    ],
  },
  {
    path: '/register',
    element: <LoginLayout />,
    children: [
      { path: '', element: <RegistrationPage /> },
    ],
  },
  // {
  //   path: '/admin',
  //   element: <AdminLayout />,
  //   children: [
  //     { path: '', element: <DashboardPage /> },
  //     { path: 'profile', element: <Profile /> }
  //   ],
  // },
  {
      path: '/admin',
      element: (
          <AuthGuard>
              <AdminLayout />
          </AuthGuard>
      ),
      children: [
          { path: '', element: <DashboardPage /> },
          { path: 'profile', element: <Profile /> },
      ],
  }
];
