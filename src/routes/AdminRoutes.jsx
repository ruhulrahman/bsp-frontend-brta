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
import VehicleTypeList from '../features/admin/configurations/vehicleType/VehicleTypeList.jsx';
import FuelTypeList from '../features/admin/configurations/fuelType/FuelTypeList.jsx';
import ServiceList from '../features/admin/configurations/brtaService/ServiceList.jsx';
import VehicleColorList from '../features/admin/configurations/vehicleColor/VehicleColorList.jsx';
import BloodGroupList from '../features/admin/configurations/bloodGroup/BloodGroupList.jsx';
import NotificationTemplateList from '../features/admin/configurations/notificationTemplate/NotificationTemplateList.jsx';
import EmailTemplateList from '../features/admin/configurations/emailTemplate/EmailTemplateList.jsx';
import AddOrUpdateEmailTemplate from '../features/admin/configurations/emailTemplate/AddOrUpdateEmailTemplate.jsx';
import AppointmentTimeslotList from '../features/admin/configurations/appointmentTimeslot/AppointmentTimeslotList.jsx';
import FiscalYearList from '../features/admin/configurations/fiscalYear/FiscalYearList.jsx';
import VehicleRouteList from '../features/admin/configurations/vehicleRoute/VehicleRouteList.jsx';
import VehicleMakerList from '../features/admin/configurations/vehicleMaker/VehicleMakerList.jsx';
import VehicleClassList from '../features/admin/configurations/vehicleClass/VehicleClassList.jsx';
import VehicleBrandList from '../features/admin/configurations/vehicleBrand/VehicleBrandList.jsx';
import PermissionList from '../features/admin/user-management/permission/PermissionList.jsx';
import RoleListPage from '../features/admin/user-management/role/RoleListPage.jsx';
import AddOrUpdateRole from '../features/admin/user-management/role/AddOrUpdateRole.jsx';

const adminRoutes = [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'profile', element: <Profile /> },
    { path: 'change-password', element: <ChangePassword /> },

    { path: 'configurations/country-list', element: <CountryList /> },
    { path: 'configurations/blood-group-list', element: <BloodGroupList /> },
    { path: 'configurations/status-group-list', element: <StatusGroupList /> },
    { path: 'configurations/status-list', element: <StatusList /> },
    { path: 'configurations/vehicle-type-list', element: <VehicleTypeList /> },
    { path: 'configurations/vehicle-color-list', element: <VehicleColorList /> },
    { path: 'configurations/fuel-type-list', element: <FuelTypeList /> },
    { path: 'configurations/service-list', element: <ServiceList /> },
    { path: 'configurations/notification-template-list', element: <NotificationTemplateList /> },
    { path: 'configurations/email-template-list', element: <EmailTemplateList /> },
    { path: 'configurations/add-or-update-email-template/:id?', element: <AddOrUpdateEmailTemplate /> },
    { path: 'configurations/appointment-timeslot-list', element: <AppointmentTimeslotList /> },
    { path: 'configurations/fiscal-year-list', element: <FiscalYearList /> },
    { path: 'configurations/vehicle-route-list', element: <VehicleRouteList /> },
    { path: 'configurations/vehicle-maker-list', element: <VehicleMakerList /> },
    { path: 'configurations/vehicle-brand-list', element: <VehicleBrandList /> },
    { path: 'configurations/vehicle-class-list', element: <VehicleClassList /> },

    { path: 'user-management/permission-list', element: <PermissionList /> },
    { path: 'user-management/role-list', element: <RoleListPage /> },
    { path: 'user-management/add-or-update-role/:isViewable/:id?', element: <AddOrUpdateRole /> },
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
  
