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

const VehicleInspection = ({ t, editData }) => {

    const dispatch = useDispatch();
    const { hasPermission } = useCommonFunctions();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        inspectorId: '',
        forwardDateForInspection: '',
        inspectionRemarks: '',
        inspectionDate: '',
        inspectionStatusId: '',
    })

    const validationSchema = Yup.object().shape({
        inspectorId: Yup.string().required('This field is required'),
    });

    const [isViewable, setIsViewable] = useState(false)


    // useEffect(() => {
    //     // setIsViewable(true);
    //     console.log('editData', editData);
    //     const newObject = {...editData}
    //     setInitialValues(newObject);

    //     if (editData && editData?.inspectorId) {
    //         setIsViewable(true)
    //     }
    // }, [editData.id])

    useEffect(() => {
        // setIsViewable(true);
        if (editData) {
            const updatedData = {
                ...editData,
            }
            updatedData.forwardDateForInspection = updatedData.forwardDateForInspection ? updatedData.forwardDateForInspection.split("T")[0] : ""
            updatedData.inspectionDate = updatedData.inspectionDate ? updatedData.inspectionDate.split("T")[0] : ""
            setInitialValues(updatedData);
        }
        if (editData && editData?.inspectorId) {
            setIsViewable(true)
        }
    }, [editData]);

    const submitData = async (values, setSubmitting, resetForm) => {
        const params = Object.assign({}, values)
        params.forwardDateForInspection = params.forwardDateForInspection ? new Date(params.forwardDateForInspection) : ''
        params.inspectionDate = params.inspectionDate ? new Date(params.inspectionDate) : ''
        const postUrl = hasPermission('vehicle_application_approval') ? 'api/v1/vservice-request/update-inpection-by-authority' :
            'api/v1/vservice-request/update-inpection-by-inspector';
        dispatch(setLoading(true));
        try {
            const { data } = await RestApi.post(postUrl, params)
            toaster(hasPermission('vehicle_application_approval') ? 'Application has been forwarded to inspector successfully' : "Vehicle Inspection Report submitted successfully");
        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <div>
            {/* <h1>{t('vehicleInspection')}</h1> */}
            {/* <hr /> */}
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
                                <Form.Group className="mb-1" controlId="inspectorId">
                                    {/* <Form.Label>{t('inspectorId')} <span className='text-red-500'>*</span></Form.Label> */}
                                    <Field
                                        disabled={editData && editData.inspectorId}
                                        id="inspectorId"
                                        name="inspectorId"
                                        component={ReactSelect}
                                        options={dropdowns.userList}
                                        placeholder={t('dropdownDefaultSelect')}
                                        value={values.inspectorId}
                                        onChange={(option) => {
                                            setFieldValue('inspectorId', option ? option.value : '')
                                        }} // Update Formik value
                                    />
                                    <ErrorMessage name="inspectorId" component="div" className="text-danger" />
                                </Form.Group>
                            </div>
                        </div>
                        {isViewable && (
                            <>

                                <div className="row">
                                    <div className="col-md-4">
                                        <Form.Label>{t('inspectionStatus')} <span className='text-red-500'>*</span></Form.Label>
                                    </div>
                                    <div className="col-md-8">
                                        <Form.Group className="mb-1" controlId="inspectionStatusId">
                                            {/* <Form.Label>{t('inspectorId')} <span className='text-red-500'>*</span></Form.Label> */}
                                            <Field
                                                id="inspectionStatusId"
                                                name="inspectionStatusId"
                                                component={ReactSelect}
                                                options={dropdowns.inspectionStatusList}
                                                placeholder={t('dropdownDefaultSelect')}
                                                value={values.inspectionStatusId}
                                                onChange={(option) => {
                                                    setFieldValue('inspectionStatusId', option ? option.value : '')
                                                }} // Update Formik value
                                            />
                                            <ErrorMessage name="inspectionStatusId" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <Form.Label>{t('remarks')} <span className='text-red-500'>*</span></Form.Label>
                                    </div>
                                    <div className="col-md-8">
                                        <Form.Group className="mb-1" controlId="inspectionRemarks">
                                            <Field type="text" name="inspectionRemarks" className="form-control" placeholder={t('remarks')} />
                                            <ErrorMessage name="inspectionRemarks" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <Form.Label>{t('forwardDate')} <span className='text-red-500'>*</span></Form.Label>
                                    </div>
                                    <div className="col-md-8">
                                        <Form.Group className="mb-1" controlId="forwardDateForInspection">
                                            <Field type="date" name="forwardDateForInspection" className="form-control" placeholder={t('forwardDateForInspection')} disabled={editData && editData.forwardDateForInspection} />
                                            <ErrorMessage name="forwardDateForInspection" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <Form.Label>{t('inspectionDate')} <span className='text-red-500'>*</span></Form.Label>
                                    </div>
                                    <div className="col-md-8">
                                        <Form.Group className="mb-1" controlId="inspectionDate">
                                            <Field type="date" name="inspectionDate" className="form-control" placeholder={t('inspectionDate')} />
                                            <ErrorMessage name="inspectionDate" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                </div>
                            </>
                        )}

                        {editData && !editData.inspectionStatusId && (
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

export default withNamespaces()(VehicleInspection);