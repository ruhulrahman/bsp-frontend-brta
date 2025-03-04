import AdminLayout from '../components/layout/AdminLayout.jsx';

import AuthGuard from './AuthGuard.jsx';
import ChangePassword from '../features/common/profile-management/pages/ChangePassword.jsx';
import Profile from '../features/common/profile-management/pages/Profile.jsx';
import VehicleRegistrationReport from '../features/system-user-panel/reports/vehicle/VehicleRegistrationReport.jsx';

const commonRoutes = [
    { path: 'profile', element: <Profile /> },
    { path: 'change-password', element: <ChangePassword /> },
    { path: 'reports/vehicle/registration-report', element: <VehicleRegistrationReport /> },
  ];
  
  const privateRoutes = [
    {
      path: '/common',
      element: (
        <AuthGuard>
          <AdminLayout />
        </AuthGuard>
      ),
      children: commonRoutes,
    },
  ];

  export default privateRoutes
  
