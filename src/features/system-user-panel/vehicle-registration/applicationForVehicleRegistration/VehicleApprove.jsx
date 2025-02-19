import { withTranslation, useTranslation } from 'react-i18next';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import Loading from '@/components/common/Loading';
import ReactSelect from '@/components/ui/ReactSelect';
import * as Yup from 'yup';
import { setListData, setLoading, toggleShowFilter } from '@/store/commonSlice';
import RestApi from '@/utils/RestApi';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import Button from 'react-bootstrap/Button';
import helpers, { toaster } from '@/utils/helpers.js';

const VehicleApprove = ({ editData, reloadList = () => { } }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        applicationStatusId: "",
        approvalRemarks: "",
    })

    const resetValues = {
        applicationStatusId: "",
        approvalRemarks: "",
    };

    const [remarksMendatory, setRemarksMendatory] = useState(false)

    const validationSchema = Yup.object().shape({
        applicationStatusId: Yup.string().required('This field is required'),
        approvalRemarks: Yup.string().when([], {
            is: () => remarksMendatory, // React to the state value
            then: (schema) => schema.required("Approval remarks are required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    const [isViewable, setIsViewable] = useState(false)

    useEffect(() => {
        if (editData) {
            // setIsViewable(true)
            const updatedData = {
                ...editData,
            }
            setInitialValues(updatedData);
        }
        if (editData?.inspectionStatusId) {
            setIsViewable(true);
        }
    }, [editData])

    const submitData = async (values, setSubmitting, resetForm) => {
        const params = Object.assign({}, values)
        dispatch(setLoading(true));
        try {
            const { data } = await RestApi.post('api/v1/vservice-request/update-approval-by-authority', params)
            reloadList(values.serviceRequestId)
            toaster("Application approval report submitted successfully");
        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

    const disableApprovalSection = () => {
        let returnValue = false

        // console.log('returnValue', returnValue)
        const currentStatus = dropdowns.vehicleApplicationCheckStatusList.find(item => item.id == initialValues.applicationStatusId)

        // return currentStatus && (currentStatus.statusCode == 'vehicle_app_primary_approved' || currentStatus.statusCode == 'vehicle_app_primary_approved') ? true : false
        if (currentStatus) {
            if (currentStatus.statusCode == 'vehicle_app_primary_approved'
                || currentStatus.statusCode == 'vehicle_app_final_approved'
                || currentStatus.statusCode == 'vehicle_app_primary_rejected'
                || currentStatus.statusCode == 'vehicle_app_final_rejected'
                || (!editData.inspectionStatusId && !editData.revenueStatusId)
            ) {
                returnValue = true
            }
        }
        console.log('returnValue', returnValue)
        return returnValue
    }

    const vehicleAprovalStatusList = () => {
        if (dropdowns.vehicleApplicationCheckStatusList) {
            const statusList = dropdowns.vehicleApplicationCheckStatusList.filter(
                item =>
                    item.statusCode === 'vehicle_app_final_approved' ||
                    item.statusCode === 'vehicle_app_final_rejected'
            );
            return statusList;
        } else {
            return [];
        }
    }

    const handleReset = (resetForm) => {
        const resetData = {...editData, applicationStatusId: '', approvalRemarks: ''}
        resetForm({
            values: resetData, // Reset to initial values
        })
    };

    return (
        <div>
            {/* <h1>{t('vehicleApprovalSection')}</h1>
            <hr /> */}
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    // console.log('Form Submitted', values);
                    // You can reset the form here as well after submission
                    // handleReset(resetForm);
                    submitData(values, setSubmitting, resetForm);
                }}
            >
                {({ values, resetForm, isSubmitting, handleChange, setFieldValue }) => {

                    useEffect(() => {
                        if (values.applicationStatusId) {

                            const currentStatus = vehicleAprovalStatusList().find(item => item.id == values.applicationStatusId)

                            if (currentStatus && currentStatus.statusCode == 'vehicle_app_final_rejected') {
                                setRemarksMendatory(true)
                            } else {
                                setRemarksMendatory(false)
                            }
                        }
                    }, [values.applicationStatusId])

                    return (
                        <FormikForm>
                            <Loading loading={loading} loadingText={t('submitting')} />
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <Form.Label className='text-nowrap'>{t('applicationStatus')} <span className='text-red-500'>*</span></Form.Label>
                                </div>
                                <div className="col-md-8">
                                    <Form.Group className="mb-1" controlId="applicationStatusId">
                                        <Field
                                            disabled={disableApprovalSection()}
                                            id="applicationStatusId"
                                            name="applicationStatusId"
                                            component={ReactSelect}
                                            options={vehicleAprovalStatusList()}
                                            placeholder={t('dropdownDefaultSelect')}
                                            value={values.applicationStatusId}
                                            onChange={(option) => {
                                                setFieldValue('applicationStatusId', option ? option.value : '')
                                            }} // Update Formik value
                                        />
                                        <ErrorMessage name="applicationStatusId" component="div" className="text-danger" />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <Form.Label>{t('remarks')} {remarksMendatory && <span className='text-red-500'>*</span>}</Form.Label>
                                </div>
                                <div className="col-md-8">
                                    <Form.Group className="mb-1" controlId="approvalRemarks">
                                        <Field disabled={disableApprovalSection()} type="text" name="approvalRemarks" className="form-control" placeholder={t('remarks')} />
                                        <ErrorMessage name="approvalRemarks" component="div" className="text-danger" />
                                    </Form.Group>
                                </div>
                            </div>

                            {isViewable && !disableApprovalSection() && (
                                <div className="row mt-1">
                                    <div className="col-sm-12 text-right">
                                        <button type='reset' className='btn btn-success btn-rounded btn-xs mr-1' onClick={() => handleReset(resetForm) }>{t('reset')}</button>
                                        <button type='submit' className='btn btn-success btn-rounded btn-xs'>{t('save')}</button>
                                    </div>
                                </div>
                            )}

                        </FormikForm>
                    )
                }}
            </Formik>

        </div>

    )

}

export default (VehicleApprove);