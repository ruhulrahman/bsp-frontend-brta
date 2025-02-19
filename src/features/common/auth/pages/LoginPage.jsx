import logo from '@/assets/images/logo.png';
import Loading from '@/components/common/Loading';
import RestApi from '@/utils/RestApi';
import helpers, { toaster } from '@/utils/helpers.js';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { withTranslation, useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setTokenInfo, setUserPermissions, setUserOfficeRole, setAuthUser, setOfficeRole } from '../authSlice';
import ChooseOfficeRoleModal from './ChooseOfficeRoleModal';
import i18n from '@/i18n';

const LoginPage = () => {
const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { dropdowns, listData, windowSize, yesNoList, pagination, showFilter } = useSelector((state) => state.common)
    const { userOfficeRole, roleSet, authUser, accessToken } = useSelector((state) => state.auth)
    const currentLanguage = i18n.language;

    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState({
        usernameOrEmail: '',
        password: '',
    })

    const validationSchema = Yup.object().shape({
        usernameOrEmail: Yup.string().required('Username Or Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const [errorMessage, setErrorMessage] = useState(null);

    const onSubmit = async (values) => {
        setLoading(true);

        try {
            const { data: result } = await RestApi.post('api/auth/v1/login', values)
            // console.log('result', result)
            await localStorage.setItem('token', result.tokenInfo?.accessToken)
            await localStorage.setItem('userTypeCode', result.userInfo?.userTypeCode)
            await dispatch(setToken(result.tokenInfo?.accessToken));
            await dispatch(setTokenInfo(result.tokenInfo));
            await dispatch(setUserPermissions(result.tokenInfo?.permissions));
            await dispatch(setAuthUser(result.userInfo));
            toaster('Your are logged in successfully')

            if (result.userInfo?.userTypeCode === 'applicant') {
                navigate('/applicant-panel/dashboard');
            } else if (result.userInfo?.userTypeCode === 'system_admin') {
                // navigate(`/admin/dashboard/${userOfficeRole?.orgId}/${userOfficeRole?.roleId}`);
                navigate(`/admin/dashboard`);
            } else {

                if (result.userInfo?.userOfficeRoles.length > 1) {
                    handleOpenChooseOfficeRoleModal(result.userInfo)
                    // if (result.userInfo?.userTypeCode === 'system_admin') {
                    //     navigate('/admin/dashboard');
                    // } else if (result.userInfo?.userTypeCode === 'system_user') {
                    //     navigate('/system-user-panel/dashboard');
                    // }

                } else {
                    const userOfficeRole = result.userInfo?.userOfficeRoles[0]
                    dispatch(setUserOfficeRole(userOfficeRole));

                    if (result.userInfo?.userTypeCode === 'system_admin') {
                        navigate(`/admin/dashboard/${userOfficeRole?.orgId}/${userOfficeRole?.roleId}`);
                    } else if (result.userInfo?.userTypeCode === 'system_user') {
                        navigate(`/system-user-panel/dashboard/${userOfficeRole?.orgId}/${userOfficeRole?.roleId}`);
                    }
                }
            }
        } catch (error) {
            console.log('error', error)
            setErrorMessage(error.response.data)
            // helper.errorHandler(error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setLoading(false);
        }
    };

    const [chooseOfficeRoleModalOpen, setChooseOfficeRoleModalOpen] = useState(false);
    const [viewData, setViewData] = useState(null);

    const handleOpenChooseOfficeRoleModal = (item) => {
        setViewData(item);
        setChooseOfficeRoleModalOpen(true);
    };

    const handleCloseChooseOfficeRoleModal = (data) => {
        console.log('data', data);
        console.log('authUser', authUser);
        const userOfficeRole = data

        dispatch(setUserOfficeRole(userOfficeRole));

        if (authUser?.userTypeCode === 'system_admin') {
            navigate(`/admin/dashboard/${userOfficeRole?.orgId}/${userOfficeRole?.roleId}`);
        } else if (authUser?.userTypeCode === 'system_user') {
            navigate(`/system-user-panel/dashboard/${userOfficeRole?.orgId}/${userOfficeRole?.roleId}`);
        }
        setChooseOfficeRoleModalOpen(false);
        setViewData(null); // Reset edit data
    }

    return (
        <div className="relative py-4 sm:max-w-xs sm:mx-auto mb-[150px]">
            <div className="min-h-96 px-8 py-8 mt-4 text-left bg-white dark:bg-gray-900  rounded-xl">
                <div className="flex flex-col items-center justify-center">
                    <h2 className='text-center font-bold text-[30px] mb-[16px]'>{t('login')}</h2>
                    <span className="text-xs text-center text-[#8B8E98] mb-[32px]">{t('login_to_the_portal_to_access_your_account_and_get_access_to_all_the_services')}</span>
                </div>

                <ChooseOfficeRoleModal
                    show={chooseOfficeRoleModalOpen}
                    onHide={() => { }}
                    onSave={(data) => {
                        handleCloseChooseOfficeRoleModal(data);
                    }}
                    viewData={viewData}
                />

                {errorMessage && <div className="text-red-500">Username or password not match</div>}

                <Loading loading={loading} />
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        onSubmit(values);
                    }}
                >
                    {({ values, resetForm }) => (
                        <FormikForm>
                            <Form.Group className="mb-[24px]" controlId="username">
                                <Form.Label>{t('username')}</Form.Label>
                                <Field type="text" name="usernameOrEmail" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter username or email" />
                                <ErrorMessage name="usernameOrEmail" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-[24px]" controlId="password">
                                <Form.Label>{t('password')}</Form.Label>
                                <Field type="password" name="password" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter password" />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </Form.Group>
                            <button type='submit' className="btn btn-success w-full">{t('login')}</button>
                        </FormikForm>
                    )}
                </Formik>
                {/* <div className="w-full flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-400">Username</label>
                    <input className="border rounded-lg px-3 py-2 mb-2 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900" placeholder="Username" />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-400">Password</label>
                    <input type="password" className="border rounded-lg px-3 py-2 mb-2 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900" placeholder="••••••••" />
                </div> */}
                <div className="mt-1">
                    {/* <button onClick={handleLogin} className="py-1 px-8 bg-blue-500 hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none">Login</button> */}
                    {/* <ToastContainer /> */}
                    <p className="m-0 mt-2 text-[13px] dark:text-white">{t('dont_have_an_account')} {t('please')} <Link to="/register" className="text-blue-500">{t('register')}</Link></p>
                </div>
            </div>
        </div>
    )
}

export default (LoginPage)
