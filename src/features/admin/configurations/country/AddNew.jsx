import Checkbox from '@/components/ui/Checkbox';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withNamespaces } from 'react-i18next';
import * as Yup from 'yup';

const AddNew = ({ t, show, onHide, onSave, editData }) => {

    const handleClose = () => setFormOpen(false);
    const handleShow = () => setFormOpen(true);

    const [initialValues, setInitialValues] = useState({
        name_en: '',
        name_bn: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        is_active: true,
    })

    

    useEffect(() => {
        if (editData) {
            setInitialValues(editData);
        }
    }, [editData, show]);

    // const handleInputChange = (e) => {
    //     console.log('Input changed:', e.target.name, e.target.value);
    //     setInitialValues((prevValues) => ({
    //         ...prevValues,
    //         [e.target.name]: e.target.value,
    //     }));
    // };

    const validationSchema = Yup.object().shape({
        name_bn: Yup.string().required('Name is required'),
        name_en: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
            .min(8, 'Must be at least 8 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                'Must contain at least one uppercase letter and one lowercase letter'
            )
            .matches(
                /^(?=.*\d)/,
                'Must contain at least one number'
            )
            .matches(
                /^(?=.*[@$!%*?&]).+$/,
                'Must contain at least one special character'
            ),
        confirmPassword: Yup.string().label('Confirm Password').required().oneOf([Yup.ref('password')], 'Passwords does not match'),
        is_active: Yup.string().required('Is active is required'),
    });

    const resetValues = {
        name_bn: '',
        name_en: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        is_active: '',
    };

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };

    useEffect(() => {
        console.log('initialValues', initialValues)
    }, []);


    // console.log('values', values);

    // const onSubmit = (values, { setSubmitting }) => {
    //     // Perform form submission logic here
    //     console.log('Form submitted:', values);
    //     setSubmitting(false);
    // };

    const onSubmit = async (values) => {
        // Perform form submission logic here
        console.log('Form submitted:', values);
        onSave(values);
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? 'Edit' : 'Add New'} {t('Country')}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            onSubmit(values);
                        }}
                    >
                        {({ values, resetForm }) => (
                            <FormikForm>
                                <Form.Group className="mb-3" controlId="name_en">
                                    <Form.Label>{t('name')} ({t('en')})</Form.Label>
                                    <Field type="text" name="name_en" className="form-control" placeholder="Enter name" />
                                    <ErrorMessage name="name_en" component="div" className="text-danger" />
                                    {/* {touched.name_en && error.name_en ? <div>{error.name_en}</div> : null} */}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="name_bn">
                                    <Form.Label>{t('name')} ({t('bn')})</Form.Label>
                                    <Field type="text" name="name_bn" className="form-control" placeholder="Enter name" />
                                    <ErrorMessage name="name_bn" component="div" className="text-danger" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>{t('email')}</Form.Label>
                                    <Field type="email" name="email" className="form-control" placeholder="Enter email" />
                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label>{t('username')}</Form.Label>
                                    <Field type="text" name="username" className="form-control" placeholder="Enter username" />
                                    <ErrorMessage name="username" component="div" className="text-danger" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>{t('password')}</Form.Label>
                                    <Field type="password" name="password" className="form-control" placeholder="Enter password" />
                                    <ErrorMessage name="password" component="div" className="text-danger" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="confirmPassword">
                                    <Form.Label>{t('confirmPassword')}</Form.Label>
                                    <Field type="password" name="confirmPassword" className="form-control" placeholder="Enter confirm Password" />
                                    <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="is_active">
                                    <Checkbox id="custom-switch" name="is_active" className="" label={values.is_active ? t('active') : t('inactive')} />
                                    <ErrorMessage name="is_active" component="div" className="text-danger" />
                                </Form.Group>
                                <button type='submit' className='btn btn-success btn-rounded btn-xs'>
                                    {editData ? 'Save Changes' : 'Add User'}
                                </button>
                                <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>Reset</button>
                            </FormikForm>
                        )}
                    </Formik>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default withNamespaces()(AddNew);