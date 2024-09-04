import Checkbox from '@/components/ui/Checkbox';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withNamespaces } from 'react-i18next';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import { toaster } from '@/utils/helpers.js';
import Loading from '@/components/common/Loading';

const AddNew = ({ t, show, onHide, onSave, editData }) => {

    const handleClose = () => setFormOpen(false);
    const handleShow = () => setFormOpen(true);

    const [initialValues, setInitialValues] = useState({
        name_en: '',
        name_bn: '',
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
        name_bn: Yup.string().required(t('Name is required')),
        name_en: Yup.string().required(t('Name is required')),
        is_active: Yup.string().required(t('Is active is required')),
    });

    const resetValues = {
        name_bn: '',
        name_en: '',
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

    const [loading, setLoading] = useState(false)

    const onSubmit = async (values) => {
        console.log('Form submitted:', values);
        // onSave(values);
        setLoading(true);
        let result = ''
        try {
            console.log('values', values)
            if (values.id) {
                result = await RestApi.post('api/v1/admin/configurations/country/create', values)
            } else {
                result = await RestApi.post('api/v1/admin/configurations/country/create', values)
            }
    
            if (result.status == 201) {
                toaster('Country has been created')
                handleReset(resetForm)
                onHide()
            }
    
        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('country')}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                <Loading loading={loading} />
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
                                    <Field type="text" name="name_en" className="form-control" placeholder={t('Enter name')} />
                                    <ErrorMessage name="name_en" component="div" className="text-danger" />
                                    {/* {touched.name_en && error.name_en ? <div>{error.name_en}</div> : null} */}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="name_bn">
                                    <Form.Label>{t('name')} ({t('bn')})</Form.Label>
                                    <Field type="text" name="name_bn" className="form-control" placeholder={t('Enter name')} />
                                    <ErrorMessage name="name_bn" component="div" className="text-danger" />
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