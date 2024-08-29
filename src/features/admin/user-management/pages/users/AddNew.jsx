import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Formik, Form as FormikForm, Field, ErrorMessage, useFormikContext } from 'formik';
import { FormCheck } from 'react-bootstrap';
import * as Yup from 'yup';
import { withNamespaces } from 'react-i18next';

const AddNew = ({ t, ...props }) => {

    // const { setFieldValue } = useFormikContext();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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

    const initialValues = {
        name_bn: 'Ruhul',
        name_en: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        is_active: '',
    };

    const handleReset = (resetForm) => {
        resetForm({
            values: initialValues, // Reset to initial values
        });
    };

    //   useEffect(() => {
    //     handleReset();
    //   }, []);


    // console.log('values', values);

    // const onSubmit = (values, { setSubmitting }) => {
    //     // Perform form submission logic here
    //     console.log('Form submitted:', values);
    //     setSubmitting(false);
    // };

    const onSubmit = async (values) => {
        // Perform form submission logic here
        console.log('Form submitted:', values);
    };

    // const onSubmit = async (values) => {
    //     await sleep(500);
    //     alert(JSON.stringify(values, null, 2));
    //   }

    return (
        <div>
            <button className='btn btn-black btn-rounded btn-sm' onClick={handleShow}>{t('add_new')}</button>

            <Offcanvas size="sm" show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add New User</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>

                    <div>
                        <h1>Initial Values</h1>
                        <div>
                            {/* <p>Name (EN): {values.name_en}</p>
                            <p>Name (BN): {values.name_bn}</p>
                            <p>Email: {values.email}</p>
                            <p>Username: {values.username}</p>
                            <p>Password: {values.password}</p>
                            <p>Confirm Password: {values.confirmPassword}</p>
                            <p>Is Active: {values.is_active}</p> */}
                        </div>
                    </div>

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
                                    <Form.Label>{t('active')}</Form.Label>
                                    {/* <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label={t('active')}
                                /> */}
                                    <Field name="is_active">
                                        {({ field }) => (
                                            <FormCheck type="switch" {...field} id="custom-switch" label={t('active')} />
                                        )}
                                    </Field>
                                    <ErrorMessage name="is_active" component="div" className="text-danger" />
                                </Form.Group>
                                <button type='submit' className='btn btn-success btn-rounded btn-xs'>Save</button>
                                {/* <button type='reset' className='btn btn-outline-black btn-rounded btn-xs ml-2'>Reset</button> */}
                                <button
                                    type="button"
                                    onClick={() => handleReset(resetForm)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Reset Form
                                </button>
                                <div>
                                    <h3>Initial Values</h3>
                                    {Object.keys(values).map((key) => (
                                        <p key={key}>
                                            {key}: {values[key]}
                                        </p>
                                    ))}
                                </div>
                            </FormikForm>
                        )}
                    </Formik>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default withNamespaces()(AddNew);