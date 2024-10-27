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
import useCommonFunctions from '@/hooks/useCommonFunctions';

const RevenueCheck = ({ t, editData }) => {

    const dispatch = useDispatch();
    const { hasPermission } = useCommonFunctions();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        revenueCheckerId: "",
        revenueStatusId: "",
        revenueRemarks: "",
        forwardDateForRevenue: "",
        revenueCheckDate: "",
    })
    const validationSchema = Yup.object().shape({
        revenueCheckerId: Yup.string().required('This field is required'),
    });

    const [isViewable, setIsViewable] = useState(false)


    useEffect(() => {
        if (editData) {
            const updatedData = {
                ...editData,
            }
            updatedData.forwardDateForRevenue = updatedData.forwardDateForRevenue ? updatedData.forwardDateForRevenue.split("T")[0] : ""
            updatedData.revenueCheckDate = updatedData.revenueCheckDate ? updatedData.revenueCheckDate.split("T")[0] : ""
            setInitialValues(updatedData);
        }
        if (editData && editData?.revenueCheckerId) {
            setIsViewable(true);
        }
    }, [editData])

    const submitData = async (values, setSubmitting, resetForm) => {
        const params = Object.assign({}, values)
        params.forwardDateForRevenue = params.forwardDateForRevenue ? new Date(params.forwardDateForRevenue) : ''
        params.revenueCheckDate = params.revenueCheckDate ? new Date(params.revenueCheckDate) : ''
        dispatch(setLoading(true));
        const postUrl = hasPermission('vehicle_application_approval') ? 'api/v1/vservice-request/update-revenue-by-authority' :
            'api/v1/vservice-request/update-revenue-by-revenue-checker';
        try {
            const { data } = await RestApi.post(postUrl, params)
            toaster(hasPermission('vehicle_application_approval') ? 'Application has been forwarded to revenue checker successfully' : 'Revenue Check Report submitted successfully');
        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <div>
            <h1>{t('revenueCheck')}</h1>
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
                                <Form.Label>{t('forwardTo')} <span className='text-red-500'>*</span></Form.Label>
                            </div>
                            <div className="col-md-8">
                                <Form.Group className="mb-1" controlId="revenueCheckerId">
                                    {/* <Form.Label>{t('revenueCheckerId')} <span className='text-red-500'>*</span></Form.Label> */}
                                    <Field
                                        disabled={editData && editData.revenueCheckerId}
                                        id="revenueCheckerId"
                                        name="revenueCheckerId"
                                        component={ReactSelect}
                                        options={dropdowns.userList}
                                        placeholder={t('dropdownDefaultSelect')}
                                        value={values.revenueCheckerId}
                                        onChange={(option) => {
                                            setFieldValue('revenueCheckerId', option ? option.value : '')
                                        }} // Update Formik value
                                    />
                                    <ErrorMessage name="revenueCheckerId" component="div" className="text-danger" />
                                </Form.Group>
                            </div>
                        </div>
                        {isViewable && (
                            <>

                                <div className="row">
                                    <div className="col-md-4">
                                        <Form.Label>{t('revenueStatus')} <span className='text-red-500'>*</span></Form.Label>
                                    </div>
                                    <div className="col-md-8">
                                        <Form.Group className="mb-1" controlId="revenueStatusId">
                                            {/* <Form.Label>{t('revenueCheckerId')} <span className='text-red-500'>*</span></Form.Label> */}
                                            <Field
                                                id="revenueStatusId"
                                                name="revenueStatusId"
                                                component={ReactSelect}
                                                options={dropdowns.revenueCheckStatusList}
                                                placeholder={t('dropdownDefaultSelect')}
                                                value={values.revenueStatusId}
                                                onChange={(option) => {
                                                    setFieldValue('revenueStatusId', option ? option.value : '')
                                                }} // Update Formik value
                                            />
                                            <ErrorMessage name="revenueStatusId" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <Form.Label>{t('remarks')} <span className='text-red-500'>*</span></Form.Label>
                                    </div>
                                    <div className="col-md-8">
                                        <Form.Group className="mb-1" controlId="revenueRemarks">
                                            <Field type="text" name="revenueRemarks" className="form-control" placeholder={t('remarks')} />
                                            <ErrorMessage name="revenueRemarks" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <Form.Label>{t('forwardDate')} <span className='text-red-500'>*</span></Form.Label>
                                    </div>
                                    <div className="col-md-8">
                                        <Form.Group className="mb-1" controlId="forwardDateForRevenue">
                                            <Field type="date" name="forwardDateForRevenue" className="form-control" placeholder={t('forwardDateForRevenue')} disabled={editData && editData.forwardDateForRevenue} />
                                            <ErrorMessage name="forwardDateForRevenue" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <Form.Label>{t('revenueDate')} <span className='text-red-500'>*</span></Form.Label>
                                    </div>
                                    <div className="col-md-8">
                                        <Form.Group className="mb-1" controlId="revenueCheckDate">
                                            <Field type="date" name="revenueCheckDate" className="form-control" placeholder={t('revenueCheckDate')} />
                                            <ErrorMessage name="revenueCheckDate" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                </div>
                            </>
                        )}

                        {editData && !editData.revenueStatusId && (
                            <div className="row mt-1">
                                <div className="col-sm-12 text-right">
                                    <button type='reset' className='btn btn-success btn-rounded btn-xs mr-1'>{t('reset')}</button>
                                    <button type='submit' className='btn btn-success btn-rounded btn-xs'>{t('save')}</button>
                                </div>
                            </div>
                        )}

                    </FormikForm>
                )}
            </Formik>

        </div>

    )

}

export default withNamespaces()(RevenueCheck);