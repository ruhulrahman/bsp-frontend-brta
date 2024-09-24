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
  
