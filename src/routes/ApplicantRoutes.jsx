import ApplicantLayout from '../components/layout/ApplicantLayout.jsx';

import AuthGuard from './AuthGuard.jsx';
import DashboardPage from '../features/admin/dashboard/pages/DashboardPage.jsx';
import ChangePassword from '../features/common/profile-management/pages/ChangePassword.jsx';
import Profile from '../features/common/profile-management/pages/Profile.jsx';
// Vehicle Registration routes
import VehicleRegistrationApplications from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/ApplicationList.jsx';
import VehicleRegistrationPage1 from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage1.jsx';
import VehicleRegistrationPage2 from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage2.jsx';
import VehicleRegistrationPage3 from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage3.jsx';
import VehicleRegistrationPage4 from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage4.jsx';
import VehicleRegistrationFirstPayment from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationFirstPayment.jsx';
import VehileRegistrationRelatedReports from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehileRegistrationRelatedReports.jsx';
import VehicleRegistrationSecondPayment from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationSecondPayment.jsx';
import PaymentSuccess from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/PaymentSuccess.jsx';

// Driving Licesnse routes
import DrivingLicenseApplicationPreRequisites from '../features/applicant-panel/driving-license/new-driving-license/DrivingLicenseApplicationPreRequisites.jsx';
import DrivingLicenseApplicationPage1 from '../features/applicant-panel/driving-license/new-driving-license/DrivingLicenseApplicationPage1.jsx';


const applicantRoutes = [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'profile', element: <Profile /> },
    { path: 'change-password', element: <ChangePassword /> },

    // Vehicle Registration Routes
    { path: 'vehicle-registration/application-for-vehicle-registration/application-list', element: <VehicleRegistrationApplications /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1/:serviceRequestId?', element: <VehicleRegistrationPage1 /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page2/:serviceRequestId?', element: <VehicleRegistrationPage2 /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page3/:serviceRequestId?', element: <VehicleRegistrationPage3 /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page4/:serviceRequestId?', element: <VehicleRegistrationPage4 /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-first-payment/:serviceRequestId?', element: <VehicleRegistrationFirstPayment /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-second-payment/:serviceRequestId?', element: <VehicleRegistrationSecondPayment /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/reports/:serviceRequestId?', element: <VehileRegistrationRelatedReports /> },
    { path: 'vehicle-registration/application-for-vehicle-registration/payment-success-page', element: <PaymentSuccess /> },

    

    // New Driving License Application Routes
    { path: 'driving-license/new-driving-license/application-pre-requisites/:serviceRequestId?', element: <DrivingLicenseApplicationPreRequisites /> },
    { path: 'driving-license/new-driving-license/application-page1/:serviceRequestId?', element: <DrivingLicenseApplicationPage1 /> },
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
  
