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
        slotNameEn: '',
        slotNameBn: '',
        slotStartTime: '',
        slotEndTime: '',
        isActive: true,
    })

    const resetValues = {
        slotNameEn: '',
        slotNameBn: '',
        slotStartTime: '',
        slotEndTime: '',
        isActive: true,
    };

    const validationSchema = Yup.object().shape({
        slotNameEn: Yup.string().required('Slot Name (English) is required'),
        slotNameBn: Yup.string().required('Slot Name (Bangla) is required'),
        slotStartTime: Yup.string().required('Start Time is required'),
        slotEndTime: Yup.string().required('End Time is required'),
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
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('appointmentTimeslot')}</Offcanvas.Title>
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

                                <Form.Group className="mb-3" controlId="slotNameEn">
                                    <Form.Label>{t('slotName')} ({t('en')})</Form.Label>
                                    <Field type="text" name="slotNameEn" placeholder="Enter Slot Name" className="form-control" />
                                    <ErrorMessage name="slotNameEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="slotNameBn">
                                    <Form.Label>{t('slotName')} ({t('bn')})</Form.Label>
                                    <Field type="text" name="slotNameBn" placeholder="Enter Slot Name" className="form-control" />
                                    <ErrorMessage name="slotNameBn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="slotStartTime">
                                    <Form.Label>{t('startTime')}</Form.Label>
                                    <Field type="time" name="slotStartTime" className="form-control" />
                                    <ErrorMessage name="slotStartTime" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="slotEndTime">
                                    <Form.Label>{t('endTime')}</Form.Label>
                                    <Field type="time" name="slotEndTime" className="form-control" />
                                    <ErrorMessage name="slotEndTime" component="div" className="text-danger" />
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