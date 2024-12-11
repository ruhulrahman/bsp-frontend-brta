import logo from '@/assets/images/logo.png';
import i18n from '@/i18n';
import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import slider6 from '@/assets/images/slider/slider-6.jpg';
import carDrive from '@/assets/images/home/car-drive.png';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
// import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import Loading from '@/components/common/Loading';
import { setListData, setLoading, toggleShowFilter } from '@/store/commonSlice';
import { toBengaliNumber } from 'bengali-number';

const TopNavbar = ({ t }) => {

    const currentLanguage = i18n.language;

    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)

    const setLanguage = (language) => {
        localStorage.setItem('preferredLanguage', language);
    }

    const changeLanguage = (lng) => {
        setLanguage(lng)
        const preferredLanguage = localStorage.getItem('preferredLanguage');
        i18n.changeLanguage(preferredLanguage);
    }

    let preferredLanguage = localStorage.getItem('preferredLanguage');
    preferredLanguage = preferredLanguage ? preferredLanguage : 'bn'

    const navigate = useNavigate();

    const isAuthenticated = localStorage.getItem('token') && localStorage.getItem('userTypeCode') ? true : false;
    const userTypeCode = localStorage.getItem('userTypeCode')

    let dashboardRedirectUrl = ''

    if (userTypeCode === 'system_admin') {
        dashboardRedirectUrl = '/admin/dashboard'
    } else if (userTypeCode === 'system_user') {
        dashboardRedirectUrl = '/system-user/dashboard'
    } else if (userTypeCode === 'applicant') {
        dashboardRedirectUrl = '/applicant-panel/dashboard'
    }

    const [initialValues, setInitialValues] = useState({
        transactionNo: '',
        chasisNo: '',
    })
    const validationSchema = Yup.object().shape({
        // vehicleTypeId: Yup.string().required('The Field is required'),
    });

    return (
        <>
            <header className="sticky  inset-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
                <nav className="mx-auto flex gap-8 px-6 transition-all duration-200 ease-in-out lg:px-12 py-3">
                    <div className="relative flex items-center">
                        <Link to="/">
                            <img src={logo} alt="Logo" className="w-10" loading="lazy" style={{ color: 'transparent' }} width="20" height="20" />
                        </Link>
                        <span className='ml-[13px]'>{t('brtaServicePortal')}</span>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="items-center justify-center gap-[13px] flex">
                        <div className="text-right">
                            <p><i className="fa fa-phone"></i> <span className="text-[14px] font-bold">{currentLanguage === 'en' ? 16107 : toBengaliNumber(16107)}</span> <span className='text-sm'>{currentLanguage === 'en' ? '09610 990 998' : toBengaliNumber('09610 990 998')}</span></p>
                            <p className='text-[12px]'>{t('sundayToThursday')}</p>
                        </div>
                        <div className="">
                            {preferredLanguage === 'en' &&
                                <button onClick={() => changeLanguage('bn')} className='btn border hover:bg-gray-100 text-[#6A6A6A]'>
                                    <i className="fa-solid fa-globe"></i>
                                    <span className="text-md ml-2">{t('bangla')}</span>
                                </button>
                            }
                            {preferredLanguage === 'bn' &&
                                <button onClick={() => changeLanguage('en')} className='btn border hover:bg-gray-100 text-[#6A6A6A]'>
                                    <i className="fa-solid fa-globe"></i>
                                    <span className="text-md ml-2">{t('lang')}</span>
                                </button>}
                        </div>
                        {!isAuthenticated &&
                            <div className='ml-[30px]'>
                                <NavLink className='btn btn-success border mr-2' to="/login">{t('login')}</NavLink>
                                <NavLink className='btn border' to="/register">{t('register')}</NavLink>
                            </div>
                        }
                        {isAuthenticated &&
                            <>
                                <NavLink className='font-dm text-sm btn btn-dark' to={dashboardRedirectUrl}>{t('dashboard')}</NavLink>
                            </>
                        }
                    </div>
                </nav>
            </header>

            <div className="container-fluid bg-[#C5D4CB]">
                <div className="row py-2">
                    <div className="col-md-12">
                        <div className="items-center justify-center gap-[24px] flex">
                            <NavLink className={({ isActive }) => isActive ? 'text-green-700 hover:text-gray-600 text-md' : 'hover:text-gray-600 text-md'} to='/'>{t('home')}</NavLink>
                            <NavLink className={({ isActive }) => isActive ? 'text-green-700 hover:text-gray-600 text-md' : 'hover:text-gray-600 text-md'} to='/fitness'>{t('fitnessAppointment')}</NavLink>
                            <NavLink className={({ isActive }) => isActive ? 'text-green-700 hover:text-gray-600 text-md' : 'hover:text-gray-600 text-md'} to='/contact'>{t('contactUs')}</NavLink>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default withNamespaces()(TopNavbar)
