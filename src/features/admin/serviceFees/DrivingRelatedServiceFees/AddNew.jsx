import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import i18n from '@/i18n';
import Loading from '@/components/common/Loading';

const AddNew = ({ show = false, onHide = () => {}, onSave = () => {}, editData = null, serviceIds }) => {
const { t } = useTranslation();

    const { activeStatusList, loading, listData } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        serviceId: '',
        isYearlyFee: true,
        mainFee: '',
        lateFee: 0,
        effectiveStartDate: '',
        effectiveEndDate: '',
        isActive: true,
    })

    const resetValues = {
        serviceId: '',
        isYearlyFee: true,
        mainFee: '',
        lateFee: 0,
        effectiveStartDate: '',
        effectiveEndDate: '',
        isActive: true,
    };

    const validationSchema = Yup.object().shape({
        serviceId: Yup.string().required('Service is required'),
        mainFee: Yup.number().required('Main Fee is required'),
        // lateFee: Yup.string().required('Late Fee is required'),
        effectiveStartDate: Yup.date().required('Effective Start Date is required'),
        // effectiveEndDate: Yup.string().required('Effective End Date is required'),
        isActive: Yup.boolean().required('Is active is required'),
    });

    useEffect(() => {
        getAllServiceList()
        if (editData) {
            const updatedData = {
                ...editData,
            }
            updatedData.effectiveStartDate = updatedData.effectiveStartDate ? updatedData.effectiveStartDate.split("T")[0] : ""
            updatedData.effectiveEndDate = updatedData.effectiveEndDate ? updatedData.effectiveEndDate.split("T")[0] : ""
            setInitialValues(updatedData);
        } else {
            setInitialValues(resetValues)
        }
    }, [editData, show]);


    const [allServiceList, setAllServiceList] = useState([]);
    const getAllServiceList = async () => {

        const parentServiceCode = 'driving_license_related_fees'
        try {
            const { data } = await RestApi.get(`api/v1/admin/configurations/service/all-active-child-services-with-additional/${parentServiceCode}`)
            if (data.success) {
                if (data.data.length > 0) {
                    console.log('editData', editData)
                    if (editData) {
                        setAllServiceList(data.data)
                    } else {
                        const filteredData = data.data.filter((item) => !serviceIds.includes(item.id))
                        setAllServiceList(filteredData)
                    }
                }
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };

    const onSubmit = async (values, setSubmitting, resetForm, setErrors) => {
        onSave(values, setSubmitting, resetForm, setErrors);
    };

    return (
        <div>
            <Offcanvas size="sm" show={show} onHide={onHide} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editData ? t('edit') : t('add_new')} {t('service')}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            if (values.effectiveStartDate) {
                                values.effectiveStartDate = new Date(values.effectiveStartDate)
                            }
                            if (values.effectiveEndDate) {
                                values.effectiveEndDate = new Date(values.effectiveEndDate)
                            }

                            onSubmit(values, setSubmitting, resetForm, setErrors);
                        }}
                    >
                        {({ values, resetForm, isSubmitting, handleChange, setFieldValue }) => {

                            const getSelectedServices = (options, selectedIds) => {
                                const selectedOptions = options.filter((option) => selectedIds.includes(option.value));
                                console.log('selectedOptions', selectedOptions)
                                return selectedOptions.map((option) => option.label).join(', ');
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
                                            }} // Update Formik value
                                        />
                                        <ErrorMessage name="serviceId" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="mainFee">
                                        <Form.Label>{t('mainFee')}</Form.Label>
                                        <Field type="number" min="0" step="0.01" name="mainFee" className="form-control" placeholder="Enter main fee" />
                                        <ErrorMessage name="mainFee" component="div" className="text-danger" />
                                    </Form.Group>

                                    {/* <Form.Group className="mb-3" controlId="isYearlyFee">
                                        <Checkbox id="custom-switch" name="isYearlyFee" className="" label={values.isYearlyFee ? t('yes') : t('no')} />
                                        <ErrorMessage name="isYearlyFee" component="div" className="text-danger" />
                                    </Form.Group> */}

                                    {/* <Form.Group className="mb-3" controlId="lateFee">
                                        <Form.Label>{t('lateFee')} ({t('bn')})</Form.Label>
                                        <Field type="text" name="lateFee" className="form-control" placeholder="Enter name" />
                                        <ErrorMessage name="lateFee" component="div" className="text-danger" />
                                    </Form.Group> */}


                                    <Form.Group className="mb-3" controlId="effectiveStartDate">
                                        <Form.Label>{t('effectiveStartDate')}</Form.Label>
                                        <Field type="date" name="effectiveStartDate" className="form-control" placeholder="Enter effectiveStartDate" />
                                        <ErrorMessage name="effectiveStartDate" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="effectiveEndDate">
                                        <Form.Label>{t('effectiveEndDate')}</Form.Label>
                                        <Field type="date" name="effectiveEndDate" className="form-control" placeholder="Enter effectiveEndDate" />
                                        <ErrorMessage name="effectiveEndDate" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="isActive">
                                        <Checkbox id="custom-switch" name="isActive" className="" label={values.isActive ? t('active') : t('inactive')} />
                                        <ErrorMessage name="isActive" component="div" className="text-danger" />
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

export default (AddNew);