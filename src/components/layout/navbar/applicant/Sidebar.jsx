import useCommonFunctions from '@/hooks/useCommonFunctions';
import { useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ openSidebar }) => {
    const { t } = useTranslation();

    const { hasPermission } = useCommonFunctions();

    const [openDrivingLicense, setOpenDrivingLicense] = useState(false);
    const [openVehicleRegistration, setOpenVehicleRegistration] = useState(false);
    const [openReports, setOpenReports] = useState(false);

    return (
        <>
            <nav className={`bg-gray-800 text-white w-full`}>
                <ul className='admin-sidebar-ul w-full mb-[50px]'>
                    {hasPermission('permitted') && (
                        <li>
                            <NavLink to="/applicant-panel/dashboard">
                                <i className="bi bi-house-door-fill"></i>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('dashboard')}</span>
                            </NavLink>
                        </li>
                    )}

                    {hasPermission('permitted') && (
                        <li>
                            <NavLink to="/applicant-panel/profile">
                                <i className="bi bi-person-fill"></i>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('profile')}</span>
                            </NavLink>
                        </li>
                    )}

                    {hasPermission('permitted') && (
                        <li>
                            <div onClick={() => setOpenDrivingLicense(!openDrivingLicense)} className={`flex items-center justify-content-between cursor-pointer ${openDrivingLicense ? 'bg-gray-700' : ''}`}>
                                {/* <i className="bi bi-gear-fill"></i> */}
                                <span className="material-symbols-outlined">swap_driving_apps_wheel</span>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('drivingLicense')}</span>
                                <span className={`text-sm rotate-180 ml-2 ${openDrivingLicense ? 'rotate-0' : ''}`}>
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            {openDrivingLicense && (
                                <ul id="example-collapse-text" className="pl-10 h-auto visible sub-menu">
                                    {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/applicant-panel/driving-license/new-driving-license/application-pre-requisites">
                                                <span className="text-[15px] text-gray-200 font-bold">{t('newDrivingLicenseApplication')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/applicant-panel/driving-license/new-driving-license/application-for-driving-license">
                                                <span className="text-[15px] text-gray-200 font-bold">{t('ApplicationList')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {/* {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/applicant-panel/driving-license/new-driving-license/payment-for-learner">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">Fees and Taxes</span>
                                            </NavLink>
                                        </li>
                                    )} */}


                                </ul>
                            )}
                        </li>
                    )}

                    {hasPermission('permitted') && (
                        <li>
                            <div onClick={() => setOpenVehicleRegistration(!openVehicleRegistration)} className={`flex items-center justify-content-between cursor-pointer ${openVehicleRegistration ? 'bg-gray-700' : ''}`}>
                                {/* <i className="bi bi-gear-fill"></i> */}
                                <span className="material-symbols-outlined">directions_car</span>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('vehicleRegistration')}</span>
                                <span className={`text-sm rotate-180 ml-2 ${openVehicleRegistration ? 'rotate-0' : ''}`}>
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            {openVehicleRegistration && (
                                <ul id="example-collapse-text" className="pl-10 h-auto visible sub-menu">
                                    {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/applicant-panel/vehicle-registration/application-for-vehicle-registration/application-list">
                                                <span className="text-[15px] text-gray-200 font-bold">{t('applicationForVehicleRegistration')}</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    {/* {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-first-payment">
                                                <span className="text-[15px] text-gray-200 font-bold">Fees and Taxes</span>
                                            </NavLink>
                                        </li>
                                    )} */}
                                </ul>
                            )}
                        </li>
                    )}

                    {hasPermission('permitted') && (
                        <li>
                            <div onClick={() => setOpenReports(!openReports)} className="flex items-center justify-content-between cursor-pointer">
                                {/* <span className="material-symbols-outlined">lab_profile</span> */}
                                <i className="bi bi-file-earmark-text-fill"></i>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">{t('reports')}</span>
                                <span className={`text-sm rotate-180 ml-2 ${openReports ? 'rotate-0' : ''}`}>
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            {openReports && (
                                <ul id="example-collapse-text" className="pl-10 h-auto visible sub-menu">
                                    {hasPermission('permitted') && (
                                        <li>
                                            <NavLink to="/applicant-panel/reports/payment/payment-list">
                                                <span className="text-[15px] text-gray-200 font-bold">{t('paymentReport')}</span>
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
