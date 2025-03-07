import ApplicantLayout from '../components/layout/ApplicantLayout.jsx';

import AuthGuard from './AuthGuard.jsx';
import DashboardPage from '../features/applicant-panel/dashboard/pages/DashboardPage.jsx';
import ApplicantProfile from '../features/applicant-panel/dashboard/pages/ApplicantProfile.jsx';
import ChangePassword from '../features/common/profile-management/pages/ChangePassword.jsx';
// Vehicle Registration routes
import VehicleRegistrationApplications from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/ApplicationList.jsx';
import VehicleRegistrationPage1 from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage1.jsx';
import VehicleRegistrationPage2 from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage2.jsx';
import VehicleRegistrationPage3 from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage3.jsx';
import VehicleRegistrationPage4 from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehicleRegistrationPage4.jsx';
import PaymentForVehicleInspection from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/PaymentForVehicleInspection.jsx';
import VehileRegistrationRelatedReports from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/VehileRegistrationRelatedReports.jsx';
import PaymentForVehicleRegistration from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/PaymentForVehicleRegistration.jsx';
import PaymentSuccessForVehicleRegistration from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/PaymentSuccess.jsx';
// import PaymentSuccess from '../features/applicant-panel/vehicle-registration/applicationForVehicleRegistration/PaymentSuccess.jsx';

// Driving Licesnse routes
import DrivingLicenseApplicationPreRequisites from '../features/applicant-panel/driving-license/new-driving-license/DrivingLicenseApplicationPreRequisites.jsx';
import DrivingLicenseApplicationPage1 from '../features/applicant-panel/driving-license/new-driving-license/DrivingLicenseApplicationPage1.jsx';
import DrivingLicenseApplicationPage2 from '../features/applicant-panel/driving-license/new-driving-license/DrivingLicenseApplicationPage2.jsx';
import PaymentForLearnerDrivingLicense from '../features/applicant-panel/driving-license/new-driving-license/PaymentForLearnerDrivingLicense.jsx';
import DrivingLicenseApplicationList from '../features/applicant-panel/driving-license/new-driving-license/drivingLicenseApplication/ApplicationList.jsx';
import PaymentForDLSmartCard from '../features/applicant-panel/driving-license/new-driving-license/PaymentForDLSmartCard.jsx';
import DrivingLicenseRelatedReports from '../features/applicant-panel/driving-license/new-driving-license/DrivingLicenseRelatedReports.jsx';
import PaymentSuccessPage from '../features/applicant-panel/driving-license/PaymentSuccessPage.jsx';
import PaymentList from '../features/system-user-panel/reports/payment/PaymentList.jsx';

const applicantRoutes = [
  { path: 'dashboard', element: <DashboardPage /> },
  { path: 'profile', element: <ApplicantProfile /> },
  { path: 'change-password', element: <ChangePassword /> },

  // Vehicle Registration Routes
  { path: 'vehicle-registration/application-for-vehicle-registration/application-list', element: <VehicleRegistrationApplications /> },
  { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1/:serviceRequestId?', element: <VehicleRegistrationPage1 /> },
  { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page2/:serviceRequestId?', element: <VehicleRegistrationPage2 /> },
  { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page3/:serviceRequestId?', element: <VehicleRegistrationPage3 /> },
  { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-page4/:serviceRequestId?', element: <VehicleRegistrationPage4 /> },
  // { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-first-payment/:serviceRequestId?', element: <PaymentForVehicleInspection /> },
  { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-first-payment/:serviceRequestId/:serviceRequestNo?', element: <PaymentForVehicleInspection /> },
  { path: 'vehicle-registration/application-for-vehicle-registration/vehicle-registration-second-payment/:serviceRequestId/:serviceRequestNo?', element: <PaymentForVehicleRegistration /> },
  { path: 'vehicle-registration/application-for-vehicle-registration/reports/:serviceRequestId?', element: <VehileRegistrationRelatedReports /> },
  // { path: 'vehicle-registration/payment-success-page/paymentStep/:serviceRequestNo?', element: <PaymentSuccessForVehicleRegistration /> },

  // New Driving License Application Routes
  { path: 'driving-license/new-driving-license/application-pre-requisites/:serviceRequestNo?', element: <DrivingLicenseApplicationPreRequisites /> },
  { path: 'driving-license/new-driving-license/application-page1/:serviceRequestNo?', element: <DrivingLicenseApplicationPage1 /> },
  { path: 'driving-license/new-driving-license/application-page2/:serviceRequestNo?', element: <DrivingLicenseApplicationPage2 /> },
  { path: 'driving-license/new-driving-license/payment-for-learner/:serviceRequestId/:serviceRequestNo?', element: <PaymentForLearnerDrivingLicense /> },
  { path: 'driving-license/new-driving-license/application-for-driving-license', element: <DrivingLicenseApplicationList /> },
  { path: 'driving-license/new-driving-license/payment-for-smart-card-driving-license-issue/:serviceRequestId/:serviceRequestNo?', element: <PaymentForDLSmartCard /> },
  { path: 'driving-license/new-driving-license/reports/:serviceRequestNo?', element: <DrivingLicenseRelatedReports /> },
  { path: 'payment-success-page', element: <PaymentSuccessPage /> },
  { path: 'reports/payment/payment-list', element: <PaymentList /> },
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

