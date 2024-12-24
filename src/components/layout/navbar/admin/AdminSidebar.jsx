import useCommonFunctions from '@/hooks/useCommonFunctions';
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ t, openSidebar }) => {

    const { hasPermission } = useCommonFunctions();

    const [openConfiguration, setOpenConfiguration] = useState(false);
    const [openServiceFees, setOpenServiceFees] = useState(false);
    const [openUserManagement, setOpenUserManagement] = useState(false);

    return (
        <>
            <nav className={`bg-gray-800 text-white w-full`}>
                <ul className='admin-sidebar-ul w-full mb-[50px]'>
                    {hasPermission('permitted') && (
                        <li>
                            <NavLink to="/admin/dashboard">
                                <i className="bi bi-house-door-fill"></i>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('dashboard')}</span>
                            </NavLink>
                        </li>
                    )}

                    {hasPermission('profile') && (
                        <li>
                            <NavLink to="/admin/profile">
                                <i className="bi bi-person-fill"></i>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('profile')}</span>
                            </NavLink>
                        </li>
                    )}

                    {hasPermission('configurations') && (
                        <li>
                            <div onClick={() => setOpenConfiguration(!openConfiguration)} className="flex items-center justify-content-between cursor-pointer">
                                <i className="bi bi-gear-fill"></i>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('configurations')}</span>
                                <span className={`text-sm rotate-180 ml-2 ${openConfiguration ? 'rotate-0' : ''}`}>
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            {openConfiguration && (
                                <ul id="example-collapse-text" className="pl-10" style={{ height: 'auto', visibilty: 'visible' }}>
                                    {hasPermission('countries') && (
                                        <li>
                                            <NavLink to="/admin/configurations/country-list">
                                                {/* <i className="bi bi-chevron-right"></i> */}
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('countries')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('blood_groups') && (
                                        <li>
                                            <NavLink to="/admin/configurations/blood-group-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('bloodGroups')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('status_groups') && (
                                        <li>
                                            <NavLink to="/admin/configurations/status-group-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('statusGroups')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('status') && (
                                        <li>
                                            <NavLink to="/admin/configurations/status-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('status')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('vehicle_colors') && (
                                        <li>
                                            <NavLink to="/admin/configurations/vehicle-color-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleColors')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('fuel_types') && (
                                        <li>
                                            <NavLink to="/admin/configurations/fuel-type-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('fuelTypes')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('services') && (
                                        <li>
                                            <NavLink to="/admin/configurations/service-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('services')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('appointment_timeslots') && (
                                        <li>
                                            <NavLink to="/admin/configurations/appointment-timeslot-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('appointmentTimeslots')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('fiscal_year') && (
                                        <li>
                                            <NavLink to="/admin/configurations/fiscal-year-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('fiscalYears')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('vehicle_routes') && (
                                        <li>
                                            <NavLink to="/admin/configurations/vehicle-route-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleRoutes')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('vehicle_makers') && (
                                        <li>
                                            <NavLink to="/admin/configurations/vehicle-maker-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleMakers')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('vehicle_brands') && (
                                        <li>
                                            <NavLink to="/admin/configurations/vehicle-brand-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleBrands')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('vehicle_classes') && (
                                        <li>
                                            <NavLink to="/admin/configurations/vehicle-class-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleClasses')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('vehicle_types') && (
                                        <li>
                                            <NavLink to="/admin/configurations/vehicle-type-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleTypes')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/admin/configurations/office-jurisdiction-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('officeJurisdiction')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/admin/configurations/exam-center-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('examCenterList')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/admin/configurations/vehicle-registration-mark-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleRegistrationMark')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('notification_template') && (
                                        <li>
                                            <NavLink to="/admin/configurations/notification-template-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('notificationTemplates')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('email_templates') && (
                                        <li>
                                            <NavLink to="/admin/configurations/email-template-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('emailTemplates')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </li>

                    )}

                    {hasPermission('permitted') && (
                        <li>
                            <div onClick={() => setOpenServiceFees(!openServiceFees)} className="flex items-center justify-content-between cursor-pointer">
                                <i className="bi bi-gear-fill"></i>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('serviceFees')}</span>
                                <span className={`text-sm rotate-180 ml-2 ${openServiceFees ? 'rotate-0' : ''}`}>
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            {openServiceFees && (
                                <ul id="example-collapse-text" className="pl-10" style={{ height: 'auto', visibilty: 'visible' }}>
                                    {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/admin/service-fees/driving-related-fees">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('drivingRelatedServiceFees')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/admin/service-fees/vehicle-related-fees">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleRelatedServiceFees')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </li>

                    )}

                    {hasPermission('user_mangement') && (
                        <li>
                            <div onClick={() => setOpenUserManagement(!openUserManagement)} className="flex items-center justify-content-between cursor-pointer">
                                <i className="bi bi-gear-fill"></i>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('userManagement')}</span>
                                <span className={`text-sm rotate-180 ml-2 ${openUserManagement ? 'rotate-0' : ''}`}>
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            {openUserManagement && (
                                <ul id="example-collapse-text" className="pl-10 h-auto visible">
                                    {hasPermission('designations') && (
                                        <li>
                                            <NavLink to="/admin/user-management/designation">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('designations')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('permissions') && (
                                        <li>
                                            <NavLink to="/admin/user-management/permission-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('permissions')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('role_permissions') && (
                                        <li>
                                            <NavLink to="/admin/user-management/role-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('rolePermissions')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('users') && (
                                        <li>
                                            <NavLink to="/admin/user-management/user-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('users')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </li>
                    )}
                </ul>
            </nav>
        </>
    )
}

export default withNamespaces()(AdminSidebar)
