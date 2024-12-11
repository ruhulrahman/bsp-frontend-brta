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
        nidNumber: '',
        dob: '',
        mobile: '',
    })

    const handleDateChange = (e) => {
        console.log('Date selected:', e)
        console.log('Date:', new Date(e[0]))
        setInitialValues((prevValues) => ({ ...prevValues, dob: e[0] }));
        setInitialValues((prevValues) => ({ ...prevValues, dob: '14-02-2023' }));
        console.log('initialValues', initialValues)
        // e => setInitialValues({...initialValues, dob: e.target.value})
    }

    const validationSchema = Yup.object().shape({
        nidNumber: Yup.number().min(10).required('NID Number is required'),
        // dob: Yup.date().max(new Date(), 'Date must be in the past').required('Date of birth is required'),
        dob: Yup.string().required('Date of birth is required'),
        mobile: Yup.number().min(11).required('Mobile number is required'),
    });


    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);

    const onSubmit = async (values) => {
        console.log('Form submitted:', values);
        setLoading(true);

        navigate('/admin/dashboard');
        try {
            const result = await RestApi.post('api/auth/v1/login', values)
            console.log('result', result)
            if (result.status == 200) {
                toaster('Your are logged in successfully')
                localStorage.setItem('token', result.data.accessToken)
                dispatch(
                    setAuthUser({
                        accessToken: result.accessToken,
                        user: result,
                    })
                );
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setLoading(false);
        }
    };


    return (

        <div className="relative py-3 sm:mx-auto">
            <div className="min-h-96 max-w-[480px] px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900 rounded-xl shadow-lg">

                <div className="flex flex-col items-center justify-center gap-2 mb-2">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="w-14" />
                    </Link>
                    <p className="m-0 text-[16px] font-semibold dark:text-white">{t('register')}</p>
                    <span className="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]">{t('before_register_your_account')}</span>
                </div>
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
                            <Row className="mb-3">
                                <Form.Group as={Col} md="12" controlId="nidNumber">
                                    <Form.Label>{t('nid_number')}</Form.Label>
                                    <Field type="text" name="nidNumber" id="nidNumber" className="form-control" placeholder="Enter NID Number" />
                                    <ErrorMessage name="nidNumber" component="div" className="text-danger" />
                                </Form.Group>
                                <Form.Group as={Col} md="12 mt-3" controlId="dob">
                                    <Form.Label>{t('date_of_birth')}</Form.Label>
                                    <Field type="date" name="dob" id="dob" className="form-control" placeholder="Date of Birth" />
                                    <ErrorMessage name="dob" component="div" className="text-danger" />
                                </Form.Group>
                                {/* <Form.Group as={Col} md="12 mt-3" controlId="dob">
                                    <Form.Label>{t('date_of_birth')}</Form.Label>
                                    <Flatpickr
                                        name="dob"
                                        className='form-control'
                                        value={values.dob}
                                        // onChange={e => setInitialValues({...initialValues, dob: e.target.value})}
                                        onChange={handleDateChange}
                                        placeholder='Select Date of Birth'
                                    />
                                    <ErrorMessage name="dob" component="div" className="text-danger" />
                                </Form.Group> */}
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="12" controlId="mobile">
                                    <Form.Label>{t('mobile')}</Form.Label>
                                    <Field type="text" name="mobile" id="mobile" className="form-control" placeholder="Enter Mobile Number" />
                                    <ErrorMessage name="mobile" component="div" className="text-danger" />
                                </Form.Group>
                                <Form.Group as={Col} md="12 mt-3" >
                                    <Button className='w-full btn-success btn-sm' type="submit">Search</Button>
                                </Form.Group>
                            </Row>
                            <div className="row">
                                <div className="col">
                                    <p className="m-0 mt-2 text-[13px] dark:text-white">Already have an account? Please <Link to="/login" className="text-blue-500 text-decoration-underline">Login</Link></p>
                                </div>
                            </div>
                        </FormikForm>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default withNamespaces()(RegistrationPage)
