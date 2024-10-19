import ApplicantLayout from '../components/layout/ApplicantLayout.jsx';

import AuthGuard from './AuthGuard.jsx';
import DashboardPage from '../features/admin/dashboard/pages/DashboardPage.jsx';
import ChangePassword from '../features/common/profile-management/pages/ChangePassword.jsx';
import Profile from '../features/common/profile-management/pages/Profile.jsx';
import VehicleRegistrationApplications from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/ApplicationList.jsx';
import VehicleRegistrationPage1 from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage1.jsx';

const applicantRoutes = [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'profile', element: <Profile /> },
    { path: 'change-password', element: <ChangePassword /> },

    // Vehicle Registration Routes
    { path: 'vehicle-registration/application-for-vehicle-registration/application-list', element: <VehicleRegistrationApplications /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration/:page/:id?', element: <VehicleRegistrationPage1 /> },
  ];
  
  const privateRoutes = [
    {
      path: '/applicant-panel',
      element: (
        <AuthGuard>
          <ApplicantLayout />
        </AuthGuard>
      ),
      children: applicantRoutes,
    },
  ];

  export default privateRoutes
  
