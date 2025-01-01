import ReactSelect from '@/components/ui/ReactSelect';
import Checkbox from '@/components/ui/Checkbox';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import i18n from '@/i18n';
import Loading from '@/components/common/Loading';

const AddNew = ({ t, show, onHide, onSave, editData, ...props }) => {

    const { activeStatusList, loading, listData, dropdowns, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        nameBn: '',
        nameEn: '',
        username: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        userTypeId: '',
        designationId: '',
        isActive: true,
    })

    const resetValues = {
        nameBn: '',
        nameEn: '',
        username: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        userTypeId: '',
        designationId: '',
        isActive: true,
    };

    useEffect(() => {
        if (editData) {
            const updatedData = {
                ...editData
            };
            setInitialValues(updatedData);
        } else {
            setInitialValues(resetValues);
        }
    }, [editData, show]);

    const validationSchema = Yup.object().shape({
        nameBn: Yup.string().required('Name is required'),
        nameEn: Yup.string().required('Name is required'),
        username: Yup.string().required('Username is required'),
        mobile: Yup.string()
            .matches(/^\d{11}$/, "Mobile number must be exactly 11 digits")
            .required("Mobile number is required"),
        email: Yup.string().email("Invalid email format").required('Email is required'),
        password: Yup.string()
            .when('id', {
                is: (id) => !id,  // When id is not present (new entry)
                then: schema => schema.matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
                    "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
                ).required('Password is required'),
                // then: schema => schema.required('Password is required')
                //     .matches(
                //         /^(?=.*[A-Z]).+$/,
                //         'Must contain at least one uppercase letter'
                //     )
                //     .matches(
                //         /^(?=.*[a-z]).+$/,
                //         'Must contain at least one lowercase letter'
                //     )
                //     .matches(
                //         /^(?=.*\d)/,
                //         'Must contain at least one number'
                //     )
                //     .matches(
                //         /^(?=.*[@$!%*?&]).+$/,
                //         'Must contain at least one special character'
                //     ).min(8, 'Must be at least 8 characters'),
                otherwise: schema => schema.optional(),
            }),
        confirmPassword: Yup.string()
            .when('id', {
                is: (id) => !id,  // When id is not present (new entry)
                then: schema => schema.oneOf([Yup.ref('password'), null], "Confirm password must match")
                    .required('Confirm password is required'),
                otherwise: schema => schema.optional(),
            }),
        userTypeId: Yup.string().required('User type is required'),
        designationId: Yup.string().required('Designation is required'),
        isActive: Yup.boolean().required('Is active is required'),
    });

    // const validationSchema = Yup.object().shape({
    //     nameBn: Yup.string().required('Name is required'),
    //     nameEn: Yup.string().required('Name is required'),
    //     username: Yup.string().required('Username is required'),
    //     mobile: Yup.string()
    //         .matches(/^\d{11}$/, "Mobile number must be exactly 11 digits")
    //         .required("Mobile number is required"),
    //     email: Yup.string().email("Invalid email format").required('Email is required'),
    //     password: Yup.string()
    //         .when('id', {
    //             is: (id) => !id,  // When id is not present (new entry)
    //             then: Yup.string().matches(
    //                 /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //                 "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
    //             ).required('Password is required'),
    //             otherwise: Yup.string().notRequired() // Not required for edit mode
    //         }),
    //     confirmPassword: Yup.string()
    //         .when('id', {
    //             is: (id) => !id,  // When id is not present (new entry)
    //             then: Yup.string()
    //                 .oneOf([Yup.ref('password'), null], "Confirm password must match")
    //                 .required('Confirm password is required'),
    //             otherwise: Yup.string().notRequired() // Not required for edit mode
    //         }),
    //     userTypeId: Yup.string().required('User type is required'),
    //     designationId: Yup.string().required('Designation is required'),
    //     isActive: Yup.boolean().required('Is active is required'),
    // });


    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };

    useEffect(() => {
        // console.log('initialValues', initialValues)
    }, []);

    const onSubmit = async (values, setSubmitting, resetForm) => {
        // values.type = parseInt(values.type)
        onSave(values, setSubmitting, resetForm);
    };

    const validateUserData = async (data) => {
        try {
            await validationSchema.validate({
                ...data,
                id: data.id || null, // Pass id for validation
            });
            console.log("Valid data");
        } catch (err) {
            console.error(err.errors); // Handle validation errors
        }
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('user')}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            // You can reset the form here as well after submission
                            // validateUserData(values);
                            onSubmit(values, setSubmitting, resetForm);
                        }}
                    >
                        {({ values, resetForm, isSubmitting, handleChange, setFieldValue }) => (
                            <FormikForm>
                                <Loading loading={loading} loadingText={t('submitting')} />

                                <Form.Group className="mb-3" controlId="nameEn">
                                    <Form.Label>{t('name')} ({t('en')})</Form.Label>
                                    <Field type="text" name="nameEn" className="form-control" placeholder="Enter name" />
                                    <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="nameBn">
                                    <Form.Label>{t('name')} ({t('bn')})</Form.Label>
                                    <Field type="text" name="nameBn" className="form-control" placeholder="Enter name" />
                                    <ErrorMessage name="nameBn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label>{t('username')}</Form.Label>
                                    <Field type="text" name="username" className="form-control" placeholder="Enter username" />
                                    <ErrorMessage name="username" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="mobile">
                                    <Form.Label>{t('mobile')}</Form.Label>
                                    <Field type="text" name="mobile" className="form-control" placeholder="Enter mobile" />
                                    <ErrorMessage name="mobile" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>{t('email')}</Form.Label>
                                    <Field type="text" name="email" className="form-control" placeholder="Enter email" />
                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                </Form.Group>

                                {!values.id &&
                                    <Form.Group className="mb-3" controlId="password">
                                        <Form.Label>{t('password')}</Form.Label>
                                        <Field type="password" name="password" className="form-control" placeholder="Enter password" />
                                        <ErrorMessage name="password" component="div" className="text-danger" />
                                    </Form.Group>
                                }

                                {!values.id &&
                                    <Form.Group className="mb-3" controlId="confirmPassword">
                                        <Form.Label>{t('confirmPassword')}</Form.Label>
                                        <Field type="password" name="confirmPassword" className="form-control" placeholder="Enter confirm password" />
                                        <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                    </Form.Group>
                                }
                                <Form.Group className="mb-3" controlId="userTypeId">
                                    <Form.Label>{t('userType')}</Form.Label>
                                    <Field
                                        name="userTypeId"
                                        component={ReactSelect}
                                        options={dropdowns.userTypeList}
                                        placeholder={t('selectUserType')}
                                        value={values.userTypeId}
                                        onChange={(option) => {
                                            setFieldValue('userTypeId', option ? option.value : '')
                                        }} // Update Formik value
                                    />
                                    <ErrorMessage name="userTypeId" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="designationId">
                                    <Form.Label>{t('designation')}</Form.Label>
                                    <Field
                                        name="designationId"
                                        component={ReactSelect}
                                        options={dropdowns.designationList}
                                        placeholder={t('selectDesignation')}
                                        value={values.designationId}
                                        onChange={(option) => {
                                            setFieldValue('designationId', option ? option.value : '')
                                        }} // Update Formik value
                                    />
                                    <ErrorMessage name="designationId" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="isActive">
                                    <Checkbox id="custom-switch" name="isActive" className="" label={values.isActive ? t('active') : t('inactive')} />
                                    <ErrorMessage name="isActive" component="div" className="text-danger" />
                                </Form.Group>

                                <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{editData ? t('save_changes') : t('save')}</button>
                                <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('reset')}</button>
                            </FormikForm>
                        )}
                    </Formik>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default withNamespaces()(AddNew);