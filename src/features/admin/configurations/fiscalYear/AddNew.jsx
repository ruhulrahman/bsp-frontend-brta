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

const AddNew = ({ t, show, onHide, onSave, editData }) => {

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        nameEn: '',
        nameBn: '',
        startDate: '',
        endDate: '',
        isActive: true,
    })

    const resetValues = {
        nameEn: '',
        nameBn: '',
        startDate: '',
        endDate: '',
        isActive: true,
    };

    const validationSchema = Yup.object().shape({
        nameEn: Yup.string().required('Name (English) is required'),
        nameBn: Yup.string().required('Name (Bangla) is required'),
        startDate: Yup.string().required('Start Date is required'),
        endDate: Yup.string().required('End Date is required'),
        isActive: Yup.string().required('Is active is required'),
    });

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };


    const [statusGroupList, setStatusGroupList] = useState([]);

    useEffect(() => {

        if (editData) {
            const updatedData = {
                ...editData,
            }
            setInitialValues(updatedData);
        } else {
            setInitialValues(resetValues)
        }
    }, [editData, show]);
    useEffect(() => {
        // console.log('initialValues', initialValues)
    }, []);

    const onSubmit = async (values, setSubmitting, resetForm) => {

        if (values.id) {
            // Remove the statusGroup property
            delete values.statusGroup;
        }

        onSave(values, setSubmitting, resetForm);
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('fiscalYear')}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            onSubmit(values, setSubmitting, resetForm);
                        }}
                    >
                        {({ values, resetForm, isSubmitting, handleChange, setFieldValue }) => (
                            <FormikForm>
                                <Loading loading={loading} loadingText={t('submitting')} />

                                <Form.Group className="mb-3" controlId="nameEn">
                                    <Form.Label>{t('name')} ({t('en')})</Form.Label>
                                    <Field type="text" name="nameEn" placeholder="Enter Slot Name" className="form-control" />
                                    <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="nameBn">
                                    <Form.Label>{t('name')} ({t('bn')})</Form.Label>
                                    <Field type="text" name="nameBn" placeholder="Enter Slot Name" className="form-control" />
                                    <ErrorMessage name="nameBn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="startDate">
                                    <Form.Label>{t('startDate')}</Form.Label>
                                    <Field type="date" name="startDate" className="form-control" />
                                    <ErrorMessage name="startDate" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="endDate">
                                    <Form.Label>{t('endDate')}</Form.Label>
                                    <Field type="date" name="endDate" className="form-control" />
                                    <ErrorMessage name="endDate" component="div" className="text-danger" />
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