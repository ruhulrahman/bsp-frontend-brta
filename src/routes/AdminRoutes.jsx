import AdminLayout from '../components/layout/AdminLayout.jsx';

import AuthGuard from './AuthGuard';
import DashboardPage from '../features/admin/dashboard/pages/DashboardPage.jsx';
import ChangePassword from '../features/common/profile-management/pages/ChangePassword.jsx';
import Profile from '../features/common/profile-management/pages/Profile.jsx';
import CountryList from '../features/admin/configurations/country/CountryList.jsx';
import UserList from '../features/admin/user-management//user/UserList.jsx';
import DesignationList from '../features/admin/user-management/designation/DesignationList.jsx';
import StatusGroupList from '../features/admin/configurations/statusGroup/StatusGroupList.jsx';
import StatusList from '../features/admin/configurations/status/StatusList.jsx';

const adminRoutes = [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'profile', element: <Profile /> },
    { path: 'change-password', element: <ChangePassword /> },
    { path: 'configurations/country-list', element: <CountryList /> },
    { path: 'configurations/location-list', element: <CountryList /> },
    { path: 'configurations/status-group-list', element: <StatusGroupList /> },
    { path: 'configurations/status-list', element: <StatusList /> },
    { path: 'user-management/user', element: <UserList /> },
    { path: 'user-management/designation', element: <DesignationList /> },
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
  
