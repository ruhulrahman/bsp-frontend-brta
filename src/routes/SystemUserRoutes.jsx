import SystemUserLayout from '../components/layout/SystemUserLayout.jsx';

import AuthGuard from './AuthGuard.jsx';
import DashboardPage from '../features/admin/dashboard/pages/DashboardPage.jsx';
import ChangePassword from '../features/common/profile-management/pages/ChangePassword.jsx';
import Profile from '../features/common/profile-management/pages/Profile.jsx';
import VehicleRegistrationApplications from '../features/system-user-panel/vehicle-registration/applicationForVehicleRegistration/ApplicationList.jsx';
import VehicleRegistrationPage1 from '../features/system-user-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage1.jsx';
import VehicleRegistrationPage2 from '../features/system-user-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage2.jsx';
import ApplicationForwardList from '../features/system-user-panel/vehicle-registration/applicationForVehicleRegistration/ApplicationForwardList.jsx';
import ApplicationForward from '../features/system-user-panel/vehicle-registration/applicationForVehicleRegistration/ApplicationForward.jsx';
import VehicleInspection from '../features/system-user-panel/vehicle-registration/applicationForVehicleRegistration/VehicleInspection.jsx';
import RevenueCheck from '../features/system-user-panel/vehicle-registration/applicationForVehicleRegistration/RevenueCheck.jsx';
import VehicleApprove from '../features/system-user-panel/vehicle-registration/applicationForVehicleRegistration/VehicleApprove.jsx';
import VehicleRegistrationApprovalList from '../features/system-user-panel/vehicle-registration/approval/ApplicationList.jsx';
import DrivingLicenseApplicationList from '../features/system-user-panel/drivingLicense/ApplicationList.jsx';

const SystemUserRoutes = [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'profile', element: <Profile /> },
    { path: 'change-password', element: <ChangePassword /> },

    // Vehicle Registration Routes
    { path: 'vehicle-registration/application-for-vehicle-registration/application-list', element: <VehicleRegistrationApplications /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1/:id?', element: <VehicleRegistrationPage1 /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page2/:id?', element: <VehicleRegistrationPage2 /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/application-forward-list', element: <ApplicationForwardList /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/application-forward', element: <ApplicationForward /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-inspection', element: <VehicleInspection /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/revenue-check', element: <RevenueCheck /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-approve', element: <VehicleApprove /> },
    { path: 'vehicle-registration/approval-1', element: <VehicleRegistrationApprovalList />},
    { path: 'driving-license-registration/application-for-driving-license', element: <DrivingLicenseApplicationList />},
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
  
