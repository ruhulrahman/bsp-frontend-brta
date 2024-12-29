import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
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
import helpers from '../../../../utils/helpers';

const AddNew = ({ t, show, onHide, onSave, editData, allServiceList, documentTypeList }) => {

    const { activeStatusList, loading, listData } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        serviceId: '',
        documentTypeId: '',
        priority: '',
        isDocumentRequired: false,
    })

    const resetValues = {
        serviceId: '',
        documentTypeId: '',
        priority: '',
        isDocumentRequired: false,
    };

    const validationSchema = Yup.object().shape({
        serviceId: Yup.string().required('Service is required'),
        documentTypeId: Yup.string().required('Document Type is required'),
        // priority: Yup.string().required('Priority is required'),
        isDocumentRequired: Yup.string().required('Is Document Required is required'),
    });

    useEffect(() => {
        // getAllServiceList()
        // getDocumentTypeList()
        if (editData) {
            setInitialValues(editData);
        } else {
            setInitialValues(resetValues)
        }
    }, [editData, show]);




    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };

    const onSubmit = async (values, setSubmitting, resetForm) => {
        onSave(values, setSubmitting, resetForm);
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('serviceDocumentMap')}</Offcanvas.Title>
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
                        {({ values, resetForm, isSubmitting, handleChange, setFieldValue }) => {

                            const getSelectedServices = (options, selectedIds) => {
                                const selectedOptions = options.filter((option) => selectedIds.includes(option.value));
                                console.log('selectedOptions', selectedOptions)
                                return selectedOptions.map((option) => option.label).join(', ')
                            }

                            return (
                                <FormikForm>
                                    <Loading loading={loading} loadingText={t('submitting')} />

                                    <Form.Group className="mb-3" controlId="serviceId">
                                        <Form.Label>{t('service')}</Form.Label>
                                        <Field
                                            name="serviceId"
                                            component={ReactSelect}
                                            options={allServiceList}
                                            placeholder={t('selectService')}
                                            value={values.serviceId}
                                            onChange={(option) => {
                                                setFieldValue('serviceId', option ? option.value : '')
                                            }}
                                        />
                                        <ErrorMessage name="serviceId" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="documentTypeId">
                                        <Form.Label>{t('documentType')}</Form.Label>
                                        <Field
                                            name="documentTypeId"
                                            component={ReactSelect}
                                            options={documentTypeList}
                                            placeholder={t('selectStatusGroup')}
                                            value={values.documentTypeId}
                                            onChange={(option) => {
                                                setFieldValue('documentTypeId', option ? option.value : '')
                                            }} // Update Formik value
                                        />
                                        <ErrorMessage name="documentTypeId" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="isDocumentRequired">
                                        <Checkbox id="custom-switch" name="isDocumentRequired" className="" label={values.isDocumentRequired ? t('documentRequired') : t('documentNotRequired')} />
                                        <ErrorMessage name="isDocumentRequired" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="priority">
                                        <Form.Label>{t('priority')}</Form.Label>
                                        <Field type="number" min="1" name="priority" className="form-control" placeholder="Enter priority number" />
                                        <ErrorMessage name="priority" component="div" className="text-danger" />
                                    </Form.Group>

                                    <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{editData ? t('save_changes') : t('save')}</button>
                                    <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('reset')}</button>
                                </FormikForm>
                            )
                        }}
                    </Formik>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default withNamespaces()(AddNew);