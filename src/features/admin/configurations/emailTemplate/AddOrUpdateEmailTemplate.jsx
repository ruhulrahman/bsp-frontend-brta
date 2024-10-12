import Loading from '@/components/common/Loading';
import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import TextEditor from '@/components/ui/TextEditor';
import i18n from '@/i18n';
import { toaster } from '@/utils/helpers.js';
import RestApi from '@/utils/RestApi';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import { withNamespaces } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

const AddOrUpdateEmailTemplate = ({ t }) => {

    const { id } = useParams()
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const findItem = listData?.find((item) => item.id == id)

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
        if (findItem) {
            const updatedData = { ...findItem }
            delete updatedData.service;
            console.log('updatedData', updatedData);
            setInitialValues(updatedData); // This is asynchronous
        } else {
            setInitialValues(resetValues);
        }
    }, [findItem]);

    // New useEffect to monitor state changes
    useEffect(() => {
        console.log('initialValues after update:', initialValues); // Will log the updated values after state change
    }, [initialValues]);

    const getStatusGroupList = async () => {

        try {
            const { data } = await RestApi.get('api/v1/admin/configurations/status-group/active-list')
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

    const onSubmit = async (values, setSubmitting, resetForm) => {
        values.serviceId = parseInt(values.serviceId)
        handleSave(values, setSubmitting, resetForm);
    };


    const handleSave = async (values, setSubmitting, resetForm) => {

        try {
            let result = ''
            if (values.id) {
                result = await RestApi.put(`api/v1/admin/configurations/email-template/update/${values.id}`, values)
            } else {
                result = await RestApi.post('api/v1/admin/configurations/email-template/create', values)
            }

            if (result.data.success) {
                toaster(result.data.message)
                navigate('/admin/configurations/email-template-list')
            }

        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setSubmitting(false)
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }],
            ['link'],
            ['clean']                                         // remove formatting button
        ]
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{id ? t('edit') : t('add_new')} {t('emailTemplate')}</CardTitle>
                </CardHeader>
                <CardBody>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
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
                                    <Field name="messageEn" component={TextEditor} placeholder="Enter Email Body" />
                                    <ErrorMessage name="messageEn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="messageBn">
                                    <Form.Label>{t('emailBody')} ({t('bn')})</Form.Label>
                                    <Field name="messageBn" component={TextEditor} placeholder="Enter Email Body" />
                                    <ErrorMessage name="messageBn" component="div" className="text-danger" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="isActive">
                                    <Checkbox id="custom-switch" name="isActive" className="" label={values.isActive ? t('active') : t('inactive')} />
                                    <ErrorMessage name="isActive" component="div" className="text-danger" />
                                </Form.Group>

                                <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{id ? t('save_changes') : t('save')}</button>
                                <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('reset')}</button>
                            </FormikForm>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </div>
    );
};

export default withNamespaces()(AddOrUpdateEmailTemplate);