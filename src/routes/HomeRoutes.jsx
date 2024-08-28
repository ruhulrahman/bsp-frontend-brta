import HomeLayout from '../components/layout/HomeLayout.jsx';
import LoginLayout from '../components/layout/LoginLayout.jsx';

import LoginPage from '../features/common/auth/pages/LoginPage.jsx';
import Logout from '@/components/common/Logout.jsx';
import RegistrationPage from '../features/common/auth/pages/RegistrationPage.jsx';
import HomePage from '../features/home/pages/HomePage.jsx';

const publicRoutes = [
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
      path: '/logout',
      element: <Logout />
    },
    {
      path: '/register',
      element: <LoginLayout />,
      children: [
        { path: '', element: <RegistrationPage /> },
      ],
    },
  ];

  export default publicRoutes