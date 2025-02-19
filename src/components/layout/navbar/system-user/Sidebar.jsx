import useCommonFunctions from '@/hooks/useCommonFunctions';
import { useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ openSidebar }) => {
const { t } = useTranslation();

    const { hasPermission } = useCommonFunctions();

    const [openVehicleMgmt, setOpenVehicleMgmt] = useState(false);
    const [openDLMgmt, setOpenDLMgmt] = useState(false);

    return (
        <>
            <nav className={`bg-gray-800 text-white w-full`}>
                <ul className='admin-sidebar-ul w-full mb-[50px]'>
                    {hasPermission('permitted') && (
                        <li>
                            <NavLink to="/system-user-panel/dashboard">
                                <i className="bi bi-house-door-fill"></i>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('dashboard')}</span>
                            </NavLink>
                        </li>
                    )}

                    {hasPermission('profile') && (
                        <li>
                            <NavLink to="/system-user-panel/profile">
                                <i className="bi bi-person-fill"></i>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('profile')}</span>
                            </NavLink>
                        </li>
                    )}


                    {hasPermission('driving_license') && (
                        <li>
                            <div onClick={() => setOpenDLMgmt(!openDLMgmt)} className="flex items-center justify-content-between cursor-pointer">
                                {/* <i className="bi bi-gear-fill"></i> */}
                                <span className="material-symbols-outlined">directions_car</span>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('drivingLicense')}</span>
                                <span className={`text-sm rotate-180 ml-2 ${openDLMgmt ? 'rotate-0' : ''}`}>
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            {openDLMgmt && (
                                <ul id="example-collapse-text" className="pl-10 h-auto visible">
                                    {hasPermission('driving_license_application_list') && (
                                        <li>
                                            <NavLink to="/system-user-panel/driving-license-registration/application-for-driving-license">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('drivingLicenseApplication')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </li>
                    )}

                    {hasPermission('vehicle_registration') && (
                        <li>
                            <div onClick={() => setOpenVehicleMgmt(!openVehicleMgmt)} className="flex items-center justify-content-between cursor-pointer">
                                {/* <i className="bi bi-gear-fill"></i> */}
                                <span className="material-symbols-outlined">directions_car</span>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleRegistration')}</span>
                                <span className={`text-sm rotate-180 ml-2 ${openVehicleMgmt ? 'rotate-0' : ''}`}>
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            {openVehicleMgmt && (
                                <ul id="example-collapse-text" className="pl-10 h-auto visible">
                                    {/* {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/system-user-panel/vehicle-registration/application-for-vehicle-registration/application-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('applicationForVehicleRegistration')}</span>
                                            </NavLink>
                                        </li>
                                    )} */}
                                    {/* {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/system-user-panel/vehicle-registration/application-for-vehicle-registration/application-forward-list">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('applicationForward')}</span>
                                            </NavLink>                                            
                                        </li>
                                    )} */}
                                    {hasPermission('application_for_vehicle_registration') && (
                                        <li>
                                            <NavLink to="/system-user-panel/vehicle-registration/approval-1">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('applicationForVehicleRegistration')}</span>
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

export default (AdminSidebar)
