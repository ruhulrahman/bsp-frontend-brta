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
import helpers, { toaster } from '@/utils/helpers.js';

const DrivingLicenseApprove = ({ t, editData }) => {

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
    const disableExamSubmissionSection = () => {
        return true
    }


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
            const { data } = await RestApi.post('api/v1/dlservice-request/update-approval-by-authority', params)
            toaster("Application approval report submitted successfully");
        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

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

                    return (
                        <FormikForm>
                            <Loading loading={loading} loadingText={t('submitting')} />
                            <div className="row">
                                <div className="col-md-4">
                                    <Form.Label>{t('applicationStatus')} </Form.Label>
                                </div>
                                <div className="col-md-8">
                                    <Form.Group className="mb-3" controlId="applicationStatusId">
                                        <Field
                                            disabled={true}
                                            id="applicationStatusId"
                                            name="applicationStatusId"
                                            component={ReactSelect}
                                            options={dropdowns.drivingLicenseApplicationStatusList}
                                            placeholder={t('dropdownDefaultSelect')}
                                            value={values.applicationStatusId}
                                            onChange={(option) => {
                                                setFieldValue('applicationStatusId', option ? option.value : '')
                                            }}
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <Form.Label>{t('remarks')}</Form.Label>
                                </div>
                                <div className="col-md-8">
                                    <Form.Group className="mb-1" controlId="approvalRemarks">
                                        <Field disabled={true} type="text" name="approvalRemarks" className="form-control" placeholder={t('remarks')} />
                                    </Form.Group>
                                </div>
                            </div>

                        </FormikForm>
                    )
                }}
            </Formik>

        </div>

    )

}

export default withNamespaces()(DrivingLicenseApprove);