import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

const AdminSidebar = ({ t, openSidebar }) => {

    const [openConfiguration, setOpenConfiguration] = useState(false);
    const [openUserManagement, setOpenUserManagement] = useState(false);

    return (
        <>
            <nav className={`bg-gray-800 text-white w-full`}>
                <ul className='admin-sidebar-ul w-full'>
                    <li>
                        <NavLink to="/admin/dashboard">
                            <i className="bi bi-house-door-fill"></i>
                            <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('dashboard')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/profile">
                            <i className="bi bi-person-fill"></i>
                            <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('profile')}</span>
                        </NavLink>
                    </li>
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
                                <li>
                                    <NavLink to="/admin/configurations/country-list">
                                        {/* <i className="bi bi-chevron-right"></i> */}
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('countries')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/blood-group-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('bloodGroups')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/status-group-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('statusGroups')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/status-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('status')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/vehicle-type-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleTypes')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/vehicle-color-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleColors')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/fuel-type-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('fuelTypes')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/service-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('services')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/appointment-timeslot-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('appointmentTimeslots')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/fiscal-year-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('fiscalYears')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/vehicle-route-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleRoutes')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/vehicle-maker-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleMakers')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/vehicle-brand-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleBrands')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/vehicle-class-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleClasses')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/notification-template-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('notificationTemplates')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/email-template-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('emailTemplates')}</span>
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>
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
                                <li>
                                    <NavLink to="/admin/user-management/permission-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('permissions')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/user-management/role-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('rolePermissions')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/user-management/user">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('users')}</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/user-management/designation">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('designations')}</span>
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default withNamespaces()(AdminSidebar)
