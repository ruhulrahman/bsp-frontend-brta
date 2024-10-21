import SystemUserLayout from '../components/layout/SystemUserLayout.jsx';

import AuthGuard from './AuthGuard.jsx';
import DashboardPage from '../features/admin/dashboard/pages/DashboardPage.jsx';
import ChangePassword from '../features/common/profile-management/pages/ChangePassword.jsx';
import Profile from '../features/common/profile-management/pages/Profile.jsx';
import VehicleRegistrationApplications from '../features/system-user-panel/vehicle-registration/applicationForVehicleRegistration/ApplicationList.jsx';
import VehicleRegistrationPage1 from '../features/system-user-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage1.jsx';
import VehicleRegistrationPage2 from '../features/system-user-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage2.jsx';

const SystemUserRoutes = [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'profile', element: <Profile /> },
    { path: 'change-password', element: <ChangePassword /> },

    // Vehicle Registration Routes
    { path: 'vehicle-registration/application-for-vehicle-registration/application-list', element: <VehicleRegistrationApplications /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1/:id?', element: <VehicleRegistrationPage1 /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page2/:id?', element: <VehicleRegistrationPage2 /> },
  ];
  
  const privateRoutes = [
    {
      path: '/system-user-panel',
      element: (
        <AuthGuard>
          <SystemUserLayout />
        </AuthGuard>
      ),
      children: SystemUserRoutes,
    },
  ];

  export default privateRoutes
  
