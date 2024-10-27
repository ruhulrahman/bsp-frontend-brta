import { withNamespaces } from 'react-i18next';
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
import helper, { toaster } from '@/utils/helpers.js';

const VehicleApprove = ({ t, editData }) => {

    const dispatch = useDispatch();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        applicationStatusId: "",
        approvalRemarks: "",
    })
    const validationSchema = Yup.object().shape({
        applicationStatusId: Yup.string().required('This field is required'),
    });

    const [isViewable, setIsViewable] = useState(false)


    useEffect(() => {
        if (editData) {
            setIsViewable(true)
            const updatedData = {
                ...editData,
            }
            setInitialValues(updatedData);
        }
    }, [editData])

    const submitData = async (values, setSubmitting, resetForm) => {
        const params = Object.assign({}, values)
        dispatch(setLoading(true));
        try {
            const { data } = await RestApi.post('api/v1/vservice-request/update-approval-by-authority', params)
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

    return (
        <div>
            <h1>{t('vehicleApprovalSection')}</h1>
            <hr />
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
                {({ values, resetForm, isSubmitting, handleChange, setFieldValue }) => (
                    <FormikForm>
                        <Loading loading={loading} loadingText={t('submitting')} />
                        <div className="row mt-3">
                            <div className="col-md-4">
                                <Form.Label>{t('applicationStatus')} <span className='text-red-500'>*</span></Form.Label>
                            </div>
                            <div className="col-md-8">
                                <Form.Group className="mb-1" controlId="applicationStatusId">
                                    {/* <Form.Label>{t('forwardTo')} <span className='text-red-500'>*</span></Form.Label> */}
                                    <Field
                                        id="applicationStatusId"
                                        name="applicationStatusId"
                                        component={ReactSelect}
                                        options={dropdowns.vehicleApplicationCheckStatusList}
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
                                <Form.Label>{t('remarks')} <span className='text-red-500'>*</span></Form.Label>
                            </div>
                            <div className="col-md-8">
                                <Form.Group className="mb-1" controlId="approvalRemarks">
                                    <Field type="text" name="approvalRemarks" className="form-control" placeholder={t('remarks')} />
                                    <ErrorMessage name="approvalRemarks" component="div" className="text-danger" />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row mt-1">
                            <div className="col-sm-12 text-right">
                                <button type='button' className='btn btn-success btn-rounded btn-xs mr-1' onClick={() => resetForm()}>{t('reset')}</button>
                                <button type='submit' className='btn btn-success btn-rounded btn-xs'>{t('save')}</button>
                            </div>
                        </div>


                    </FormikForm>
                )}
            </Formik>

        </div>

    )

}

export default withNamespaces()(VehicleApprove);