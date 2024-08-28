import AdminLayout from '../components/layout/AdminLayout.jsx';

import AuthGuard from './AuthGuard';
import DashboardPage from '../features/admin/dashboard/pages/DashboardPage.jsx';
import ChangePassword from '../features/common/profile-management/pages/ChangePassword.jsx';
import Profile from '../features/common/profile-management/pages/Profile.jsx';
import User from '../features/admin/user-management/pages/users/User.jsx';

const adminRoutes = [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'profile', element: <Profile /> },
    { path: 'change-password', element: <ChangePassword /> },
    { path: 'user-management/user', element: <User /> },
  ];
  
  const privateRoutes = [
    {
      path: '/admin',
      element: (
        <AuthGuard>
          <AdminLayout />
        </AuthGuard>
      ),
      children: adminRoutes,
    },
  ];

  export default privateRoutes
  
