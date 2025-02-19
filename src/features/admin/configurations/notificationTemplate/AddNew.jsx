import Loading from '@/components/common/Loading';
import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withTranslation, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const AddNew = ({ show = false, onHide = () => {}, onSave = () => {}, editData = null }) => {
const { t } = useTranslation();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        serviceId: '',
        titleEn: '',
        titleBn: '',
        messageEn: '',
        messageBn: '',
        isActive: true,
    })

    const resetValues = {
        serviceId: '',
        titleEn: '',
        titleBn: '',
        messageEn: '',
        messageBn: '',
        isActive: true,
    };

    const [statusGroupList, setStatusGroupList] = useState([]);

    useEffect(() => {

        // getStatusGroupList();
        if (editData) {
            const updatedData = {
                ...editData,
                serviceId: editData?.serviceId,
            }
            setInitialValues(updatedData);
        } else {
            setInitialValues(resetValues)
        }
    }, [editData, show]);

    const getStatusGroupList = async () => {

        try {
            const { data } = await RestApi.get('api/v1/admin/configurations/status-group/active-list')
            // console.log('data', data)
            if (data.success) {
                setStatusGroupList(data.data)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const validationSchema = Yup.object().shape({
        serviceId: Yup.string().required('Service Id is required'),
        titleEn: Yup.string().required('Title (English) is required'),
        titleBn: Yup.string().required('Title (Bangla) is required'),
        messageEn: Yup.string().required('Message (English) is required'),
        messageBn: Yup.string().required('Message (Bangla) is required'),
        isActive: Yup.string().required('Is active is required'),
    });

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };

    useEffect(() => {
        // console.log('initialValues', initialValues)
    }, []);

    const onSubmit = async (values, setSubmitting, resetForm, setErrors) => {
        values.serviceId = parseInt(values.serviceId)

        if (values.id) {
            // Remove the statusGroup property
            delete values.statusGroup;
        }

        onSave(values, setSubmitting, resetForm, setErrors);
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('notificationTemplate')}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            onSubmit(values, setSubmitting, resetForm, setErrors);
                        }}
                    >
                        {({ values, resetForm, isSubmitting, handleChange, setFieldValue }) => (
                            <FormikForm>
                                <Loading loading={loading} loadingText={t('submitting')} />

                                <Form.Group className="mb-3" controlId="serviceId">
                                    <Form.Label>{t('Service')}</Form.Label>
                                    <Field
                                        id="serviceId"
                                        name="serviceId"
                                        component={ReactSelect}
                                        options={dropdowns.serviceList}
                                        placeholder={t('selectService')}
                                        value={values.serviceId}
                                        onChange={(option) => {
                                            setFieldValue('serviceId', option ? option.value : '')
                                        }} // Update Formik value
                                    />
                                    <ErrorMessage name="serviceId" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="titleEn">
                                    <Form.Label>{t('title')} ({t('en')})</Form.Label>
                                    <Field type="text" name="titleEn" className="form-control" placeholder="Enter Title" />
                                    <ErrorMessage name="titleEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="titleBn">
                                    <Form.Label>{t('title')} ({t('bn')})</Form.Label>
                                    <Field type="text" name="titleBn" className="form-control" placeholder="Enter Title" />
                                    <ErrorMessage name="titleBn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="messageEn">
                                    <Form.Label>{t('messageEn')}</Form.Label>
                                    <Field as="textarea" name="messageEn" placeholder="Enter Message" className="form-control" rows="4" cols="50" />
                                    <ErrorMessage name="messageEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="messageBn">
                                    <Form.Label>{t('messageBn')}</Form.Label>
                                    <Field as="textarea" name="messageBn" placeholder="Enter Message" className="form-control" rows="4" cols="50" />
                                    <ErrorMessage name="messageBn" component="div" className="text-danger" />
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

export default (AddNew);