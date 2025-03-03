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
import { useDispatch } from 'react-redux';
import { setToken, setTokenInfo, setUserPermissions } from '../authSlice';

const LoginPage = () => {
const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch()

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
            console.log('result', result)
                await localStorage.setItem('token', result.tokenInfo?.accessToken)
                await localStorage.setItem('userTypeCode', result.userInfo?.userTypeCode)
                await dispatch(setToken(result.tokenInfo?.accessToken));
                await dispatch(setTokenInfo(result.tokenInfo));
                await dispatch(setUserPermissions(result.tokenInfo?.permissions));
                toaster('Your are logged in successfully')

                if (result.userInfo?.userTypeCode === 'applicant') {
                    navigate('/applicant-panel/dashboard');
                } else if (result.userInfo?.userTypeCode === 'system_admin') {
                    navigate('/admin/dashboard');
                } else if (result.userInfo?.userTypeCode === 'system_user') {
                    navigate('/system-user-panel/dashboard');
                }
                // navigate('/admin/dashboard');
        } catch (error) {
            console.log('error', error)
            setErrorMessage(error.response.data)
            // helper.errorHandler(error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative py-3 sm:max-w-xs sm:mx-auto">
            <div className="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900  rounded-xl shadow-lg">
                <div className="flex flex-col justify-center items-center h-full select-none">
                    <div className="flex flex-col items-center justify-center gap-2 mb-8">
                        <Link to="/">
                            <img src={logo} alt="Logo" className="w-14" />
                        </Link>
                        <p className="m-0 text-[16px] font-semibold dark:text-white">{t('dont_have_an_account')}</p>
                        <span className="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]">{t('login_to_the_portal_to_access_your_account_and_get_access_to_all_the_services')}</span>
                    </div>
                </div>

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
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label>{t('username')}</Form.Label>
                                <Field type="text" name="usernameOrEmail" className="form-control" placeholder="Enter username or email" />
                                <ErrorMessage name="usernameOrEmail" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>{t('password')}</Form.Label>
                                <Field type="password" name="password" className="form-control" placeholder="Enter password" />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </Form.Group>
                            <button type='submit' className="py-1 px-8 bg-blue-500 hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none">{t('login')}</button>
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
