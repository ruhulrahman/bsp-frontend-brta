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
        serviceId: '',
        templateName: '',
        subjectEn: '',
        subjectBn: '',
        messageEn: '',
        messageBn: '',
        isActive: true,
    })

    const resetValues = {
        serviceId: '',
        templateName: '',
        subjectEn: '',
        subjectBn: '',
        messageEn: '',
        messageBn: '',
        isActive: true,
    };


    const validationSchema = Yup.object().shape({
        serviceId: Yup.string().required('Service Id is required'),
        templateName: Yup.string().required('Template Name is required'),
        subjectEn: Yup.string().required('Subject (English) is required'),
        subjectBn: Yup.string().required('Subject (Bangla) is required'),
        messageEn: Yup.string().required('Message (English) is required'),
        messageBn: Yup.string().required('Message (Bangla) is required'),
        isActive: Yup.string().required('Is active is required'),
    });

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
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
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('emailTemplate')}</Offcanvas.Title>
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
                                        component="select"
                                        id="serviceId"
                                        name="serviceId"
                                        multiple={false}
                                        className="w-full rounded-md border"
                                    >
                                        <option value="">{t('selectService')}</option>
                                        {dropdowns.serviceList && dropdowns.serviceList.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {currentLanguage === 'en' ? option.nameEn : option.nameBn}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="serviceId" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="templateName">
                                    <Form.Label>{t('templateName')}</Form.Label>
                                    <Field type="text" name="templateName" className="form-control" placeholder="Enter Title" />
                                    <ErrorMessage name="templateName" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="subjectEn">
                                    <Form.Label>{t('subject')} ({t('en')})</Form.Label>
                                    <Field type="text" name="subjectEn" className="form-control" placeholder="Enter Title" />
                                    <ErrorMessage name="subjectEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="subjectBn">
                                    <Form.Label>{t('subject')} ({t('bn')})</Form.Label>
                                    <Field type="text" name="subjectBn" className="form-control" placeholder="Enter Title" />
                                    <ErrorMessage name="subjectBn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="messageEn">
                                    <Form.Label>{t('emailBody')} ({t('en')})</Form.Label>
                                    <Field as="textarea" name="messageEn" placeholder="Enter Message" className="form-control" rows="4" cols="50"/>
                                    <ErrorMessage name="messageEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="messageBn">
                                    <Form.Label>{t('emailBody')} ({t('bn')})</Form.Label>
                                    <Field as="textarea" name="messageBn" placeholder="Enter Message" className="form-control" rows="4" cols="50"/>
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

export default withNamespaces()(AddNew);