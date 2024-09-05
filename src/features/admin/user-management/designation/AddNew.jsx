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
        name_bn: '',
        name_en: '',
        level_number: '',
        parent_designation_id: '',
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
        is_active: Yup.string().required('Is active is required'),
    });

    const resetValues = {
        name_bn: '',
        name_en: '',
        level_number: '',
        parent_designation_id: '',
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

    const onSubmit = async (values) => {
        // Perform form submission logic here
        console.log('Form submitted:', values);
        onSave(values);
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('designation')}</Offcanvas.Title>
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
                                <Form.Group className="mb-3" controlId="level_number">
                                    <Form.Label>{t('level_number')}</Form.Label>
                                    <Field type="number" min="1" name="level_number" className="form-control" placeholder="Enter level_number" />
                                    <ErrorMessage name="level_number" component="div" className="text-danger" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="parent_designation_id">
                                    <Form.Label>{t('parent_designation')}</Form.Label>
                                    <Field type="text" name="parent_designation_id" className="form-control" placeholder="Enter parent designation" />
                                    <ErrorMessage name="parent_designation_id" component="div" className="text-danger" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="is_active">
                                    <Checkbox id="custom-switch" name="is_active" className="" label={values.is_active ? t('active') : t('inactive')} />
                                    <ErrorMessage name="is_active" component="div" className="text-danger" />
                                </Form.Group>
                                <button type='submit' className='btn btn-success btn-rounded btn-xs'>{editData ? t('save_changes') : t('save')}</button>
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