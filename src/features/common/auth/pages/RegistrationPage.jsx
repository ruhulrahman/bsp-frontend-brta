import logo from '@/assets/images/logo.png';
// import logo from '../../../assets/images/logo.png';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react'
import { withNamespaces } from 'react-i18next';
import Loading from '@/components/common/Loading';
import RestApi from '@/utils/RestApi';
import { toaster } from '@/utils/helpers.js';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../authSlice';
import Flatpickr from "react-flatpickr";

const CustomInput = ({ value, defaultValue, inputRef, ...props }) => {
    return <input {...props} defaultValue={defaultValue} ref={inputRef} />;
};

const RegistrationPage = ({ t }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch()


    const [loading, setLoading] = useState(false)
    const [showSearchInfo, setShowSearchInfo] = useState(false)
    const [searchInfo, setSearchInfo] = useState(null)
    const [initialValues, setInitialValues] = useState({
        nid: '',
        dob: '',
        mobile: '',
    })

    const validationSchema = Yup.object().shape({
        nid: Yup.number().min(10).required('NID Number is required'),
        // dob: Yup.date().max(new Date(), 'Date must be in the past').required('Date of birth is required'),
        dob: Yup.string().required('Date of birth is required'),
        mobile: Yup.string()
            .matches(/^\d{11}$/, "Mobile number must be exactly 11 digits")
            .required("Mobile number is required"),
    });

    // Mock JSON data similar to the provided object
    const mockData = {
        operationResult: {
            success: 'true',
        },
        requestId: '1f0195bc-a295-4f8d-a645-0dd509201c42',
        serviceId: null,
        name: 'মোঃ শফিকুল ইসলাম',
        nameEn: 'Md. Shafiqul Islam',
        nid: '1471752053',
        dob: '1992-07-26',
        gender: 'male',
        mobile: '01771752053',
        permanentAddress: 'বাসা/হোল্ডিং: ৬৩, গ্রাম/রাস্তা: নাসির উদ্দিন সর্দার লেন, ডাকঘর: ঢাকা সদর-১১০০, উপজেলা: সুত্রাপুর, জেলা: ঢাকা, বিভাগ: ঢাকা',
        presentAddress: 'বাসা/হোল্ডিং: ৬৩, গ্রাম/রাস্তা: নাসির উদ্দিন সর্দার লেন, ডাকঘর: ঢাকা সদর-১১০০, উপজেলা: সুত্রাপুর, জেলা: ঢাকা, বিভাগ: ঢাকা',
        photo: null,
        spouse: null,
        father: 'মোঃ হারুন উর রশিদ',
        mother: '*',
        religion: 'muslim',
        sm: {
            return: {
                operationResult: {
                    success: 'true',
                },
                requestId: '1f0195bc-a295-4f8d-a645-0dd509201c42',
                serviceId: null,
                nid: '1471752053',
                pin: '19922698842000221',
            },
        },
    }

    const [nidData, setNidData] = useState('');


    const [isSearched, setIsSearched] = useState(false);

    const searchNidData = async (values) => {
        console.log('Form submitted:', values);
        setLoading(true);
        setIsSearched(false);

        try {
            const { data } = await RestApi.post('api/nid/v1/get-data-from-nid-service', values)
            console.log('data', data)
            setInitialNidSearchedValues(data.data);
        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setLoading(false);
            setIsSearched(true);
        }
    };


    const [initialNidSearchedValues, setInitialNidSearchedValues] = useState({
        name: '',
        nameEn: '',
        nid: '',
        dob: '',
        gender: '',
        permanentAddress: '',
        presentAddress: '',
        photo: '',
        spouse: '',
        father: '',
        mother: '',
        religion: '',
        mobile: '',
        nameBn: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: '',
    })


    const validationNidSearchedSchema = Yup.object().shape({
        nid: Yup.number().min(10).required('NID Number is required'),
        dob: Yup.string().required('Date of birth is required'),
        mobile: Yup.number().min(11).required('Mobile number is required'),
        username: Yup.string().required('Username is required'),
        email: Yup.string().email("Invalid email format").required('Email is required'),
        password: Yup.string().matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
        ).required('Password is required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password')], "Confirm password must match")
            .required('Confirm password is required'),
    });


    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpActive, setIsOtpActive] = useState(false);
    const [verified, setVerified] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const [initialOtpValues, setInitialOtpValues] = useState({
        otp: '',
    })

    const validationOtpSchema = Yup.object().shape({
        otp: Yup.string().required('OTP is required'),
    });

    const sendOtpData = async (values) => {
        console.log('Form submitted:', values);
        setLoading(true);
        setOtpSent(false);
        setInitialNidSearchedValues(values);

        try {
            const { data } = await RestApi.post('api/otp/v1/send-user-registrtaion-otp', values)
            console.log('data', data)

            if (data.success) {
                setInitialOtpValues({ otp: data.data });
                setOtpSent(true);
                setIsOtpActive(true);
                setTimeLeft(120);
                toaster('OTP has been sent successfully')
            } else {
                toaster(data.message, 'error')
            }
        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let timer;
        if (isOtpActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timer);
            setIsOtpActive(false);
            console.log("Time's up!");
        }
        return () => clearInterval(timer);
    }, [isOtpActive, timeLeft]);


    // Display formatted time as MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secondsRemaining = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
    };

    const verifyOtpData = async (values) => {
        setLoading(true);
        console.log('initialNidSearchedValues', initialNidSearchedValues)

        const params = Object.assign({}, initialNidSearchedValues);
        params.otp = values.otp
        console.log('params', params)

        try {
            const { data } = await RestApi.post('api/otp/v1/verify-user-registrtaion-otp', params)
            console.log('data', data)
            if (data.data) {
                // setVerified(true);
                // setOtpSent(false);
                // setInitialOtpValues({ otp: '' });
                // setIsOtpActive(false);
                navigate('/login');
                toaster('Your OTP has been verified successfully')
            } else {
                toaster(data.message, 'error')
            }
        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="relative py-4 mb-[150px]">
            <div className="min-h-96 px-8 py-8 mt-4 text-left bg-white  sm:max-w-xs md:max-w-[650px] mx-auto dark:bg-gray-900 rounded-xl">

                {!isOtpActive && (
                    <div className="flex flex-col items-center justify-center">
                        <h2 className='text-center font-bold text-[30px] mb-[16px]'>{t('register')}</h2>
                        <span className="text-xs text-center text-[#8B8E98] mb-[32px]">{t('before_register_your_account')}</span>
                    </div>
                )}

                {isOtpActive && (
                    <div className="flex flex-col items-center justify-center">
                        <h2 className='text-center font-bold text-[30px] mb-[16px]'>{t('OTP Verification')}</h2>
                        <span className="text-xs text-center text-[#8B8E98] mb-[32px]">{t('A 6 digit OTP has been sent to your mobile number. Please Enter your OTP to verify your mobile number and complete the registration.')}</span>
                    </div>
                )}

                {isOtpActive && (
                    <div>
                        <p>OTP will expire in: {formatTime(timeLeft)}</p>
                    </div>
                )}

                <Loading loading={loading} />

                {!isOtpActive && (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            searchNidData(values);
                        }}
                    >
                        {({ values, resetForm }) => (
                            <FormikForm>

                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="nid">
                                            <Form.Label>{t('nid_number')}</Form.Label>
                                            <Field type="text" name="nid" id="nid" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter NID Number" />
                                            <ErrorMessage name="nid" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="dob">
                                            <Form.Label>{t('date_of_birth')}</Form.Label>
                                            <Field type="date" name="dob" id="dob" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Date of Birth" />
                                            <ErrorMessage name="dob" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="mobile">
                                            <Form.Label>{t('mobile')}</Form.Label>
                                            <Field type="text" name="mobile" id="mobile" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter Mobile Number" />
                                            <ErrorMessage name="mobile" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <button type='submit' className="btn btn-success w-full md:mt-[23px]">{t('search')}</button>
                                    </div>
                                </div>

                            </FormikForm>
                        )}
                    </Formik>
                )}

                {!isOtpActive && (
                    <div className="row mt-1">
                        <div className="col">
                            <p className="m-0 mt-2 text-[13px] dark:text-white">Already have an account? Please <Link to="/login" className="text-blue-500 text-decoration-underline">Login</Link></p>
                        </div>
                    </div>
                )}

                {isSearched && !isOtpActive && initialNidSearchedValues.mobile && (
                    <Formik
                        initialValues={initialNidSearchedValues}
                        validationSchema={validationNidSearchedSchema}
                        onSubmit={(values, { resetForm }) => {
                            sendOtpData(values);
                        }}
                    >
                        {({ values, resetForm }) => (
                            <FormikForm>

                                <div className="row mt-[20px]">
                                    <hr className=' mb-[20px]' />
                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="name">
                                            <Form.Label>{t('nid_number')}</Form.Label>
                                            <Field disabled type="text" name="name" id="name" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter NID Number" />
                                            <ErrorMessage name="name" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="father">
                                            <Form.Label>{t('fatherName')}</Form.Label>
                                            <Field disabled type="text" name="father" id="father" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter father Number" />
                                            <ErrorMessage name="father" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="gender">
                                            <Form.Label>{t('gender')}</Form.Label>
                                            <Field disabled type="text" name="gender" id="gender" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter gender Number" />
                                            <ErrorMessage name="gender" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="permanentAddress">
                                            <Form.Label>{t('permanentAddress')}</Form.Label>
                                            <Field disabled type="text" name="permanentAddress" id="permanentAddress" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter permanentAddress Number" />
                                            <ErrorMessage name="permanentAddress" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="username">
                                            <Form.Label>{t('username')}</Form.Label>
                                            <Field type="text" name="username" id="username" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter username Number" />
                                            <ErrorMessage name="username" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="email">
                                            <Form.Label>{t('email')}</Form.Label>
                                            <Field type="email" name="email" id="email" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter email Number" />
                                            <ErrorMessage name="email" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="password">
                                            <Form.Label>{t('password')}</Form.Label>
                                            <Field type="password" name="password" id="password" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter password Number" />
                                            <ErrorMessage name="password" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="confirmPassword">
                                            <Form.Label>{t('confirmPassword')}</Form.Label>
                                            <Field type="password" name="confirmPassword" id="confirmPassword" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter confirmPassword Number" />
                                            <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <button type='submit' className="btn btn-success w-full md:mt-[23px]">{t('register')}</button>
                                    </div>
                                </div>

                            </FormikForm>
                        )}
                    </Formik>
                )}

                {otpSent && isOtpActive && initialOtpValues && (
                    <Formik
                        initialValues={initialOtpValues}
                        validationSchema={validationOtpSchema}
                        onSubmit={(values, { resetForm }) => {
                            verifyOtpData(values);
                        }}
                    >
                        {({ values, resetForm }) => (
                            <FormikForm>

                                <div className="row mt-[20px]">
                                    <hr className=' mb-[20px]' />
                                    <div className="col-sm-12 col-md-6">
                                        <Form.Group className="mb-[24px]" controlId="otp">
                                            <Form.Label>{t('OTP Number')}</Form.Label>
                                            <Field type="text" name="otp" id="otp" className="form-control h-[40px] placeholder:text-gray-400 placeholder:font-light" placeholder="Enter 6 digit OTP number" />
                                            <ErrorMessage name="otp" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <button type='submit' className="btn btn-success w-full md:mt-[23px]">{t('verify')}</button>
                                    </div>
                                </div>

                            </FormikForm>
                        )}
                    </Formik>
                )}


            </div>
        </div>
    )
}

export default withNamespaces()(RegistrationPage)
