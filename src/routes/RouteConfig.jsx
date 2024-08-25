import HomeLayout from '../components/layout/HomeLayout.jsx';
import LoginLayout from '../components/layout/LoginLayout.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';

import HomePage from '../features/home/pages/HomePage.jsx';
import LoginPage from '../features/auth/pages/LoginPage.jsx';
import RegistrationPage from '../features/auth/pages/RegistrationPage.jsx';
import DashboardPage from '../features/dashboard/pages/DashboardPage.jsx';

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
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { path: '', element: <DashboardPage /> },
      // Add more dashboard-related routes here
    ],
  },
];
