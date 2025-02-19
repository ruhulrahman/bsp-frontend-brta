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
import useCommonFunctions from '@/hooks/useCommonFunctions';

const MviSubmission = ({ editData, onCloseModal, listReload }) => {
const { t } = useTranslation();

    const dispatch = useDispatch();
    const { hasPermission } = useCommonFunctions();

    const disableExamSubmissionSection = () => {
        if (hasPermission('dl_exam_submission') == false) {
            return true
        } else {
            if (initialValues.dlExamDate) {
                return true
            } else {
                return false
            }
        }
    }

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        dlExamSheet: '',
        dlExamStatusId: '',
        dlExamRemarks: '',
        dlExamDate: '',
    })

    const validationSchema = Yup.object().shape({
        dlExamStatusId: Yup.string().required('This field is required'),
        dlExamDate: Yup.string().required('This field is required'),
    });

    const [isViewable, setIsViewable] = useState(false)

    useEffect(() => {
        // setIsViewable(true);
        if (editData) {
            const updatedData = {
                ...editData,
            }
            updatedData.dlExamDate = updatedData.dlExamDate ? updatedData.dlExamDate.split("T")[0] : ""
            setInitialValues(updatedData);
            console.log(updatedData);
        }
        if (editData && editData?.dlExamStatusId) {
            setIsViewable(true)
        }
    }, [editData]);


    const submitData = async (values, setSubmitting, resetForm) => {
        const params = Object.assign({}, values)
        params.dlExamDate = params.dlExamDate ? new Date(params.dlExamDate) : ''
        const postUrl = 'api/v1/dlservice-request/update-mvi-submission';
        dispatch(setLoading(true));
        try {
            const { data } = await RestApi.post(postUrl, params)
            toaster("MVI Report submitted successfully");
            onCloseModal();
            listReload()
        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <div>
            {/* <h1>{t('reportSubmission')}</h1>
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

                    const [isRemarksShow, setIsRemarksShow] = useState(false)
                    useEffect(() => {

                        if (values.dlExamStatusId) {
                            const examStatus = dropdowns.drivingLicenseRecommendationStatusList.find(item => item.id == values.dlExamStatusId)
                            if (examStatus && examStatus.statusCode == 'dl_recommendation_fail') {
                                setIsRemarksShow(true)
                            } else {
                                setIsRemarksShow(false)
                            }
                        }

                    }, [values.dlExamStatusId]);

                    return (
                        <FormikForm>
                            <Loading loading={loading} loadingText={t('submitting')} />
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <Form.Label>{t('dctbExamSheet')} <span className='text-red-500'>*</span></Form.Label>
                                </div>
                                <div className="col-md-6">
                                    {editData && !editData.dlExamStatusId ? (
                                        <Form.Group className="mb-1" controlId="dlExamSheet">
                                            <Field disabled={disableExamSubmissionSection()} type="file" name="dlExamSheet" className="form-control" />
                                            <ErrorMessage name="dlExamSheet" component="div" className="text-danger" />
                                        </Form.Group>
                                    ) : (
                                        <div className="flex align-items-center">
                                            <span className='mr-2'>Attachment</span> <button type='button' className='btn btn-default'><i className="fa fa-eye"></i></button>
                                        </div>
                                    )}
                                </div>
                            </div>



                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Label>{t('mviRecommendationStatus')} <span className='text-red-500'>*</span></Form.Label>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-1" controlId="dlExamStatusId">
                                        <Field
                                            disabled={disableExamSubmissionSection()}
                                            id="dlExamStatusId"
                                            name="dlExamStatusId"
                                            component={ReactSelect}
                                            options={dropdowns.drivingLicenseRecommendationStatusList}
                                            placeholder={t('dropdownDefaultSelect')}
                                            value={values.dlExamStatusId}
                                            onChange={(option) => {
                                                setFieldValue('dlExamStatusId', option ? option.value : '')
                                            }}
                                        />
                                        <ErrorMessage name="dlExamStatusId" component="div" className="text-danger" />
                                    </Form.Group>
                                </div>
                            </div>

                            {isRemarksShow && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Label>{t('remarks')} <span className='text-red-500'>*</span></Form.Label>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-1" controlId="dlExamRemarks">
                                            <Field disabled={disableExamSubmissionSection()} type="text" name="dlExamRemarks" className="form-control" placeholder={t('remarks')} />
                                            <ErrorMessage name="dlExamRemarks" component="div" className="text-danger" />
                                        </Form.Group>
                                    </div>
                                </div>
                            )}
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Label>{t('mviRecommendationDate')} <span className='text-red-500'>*</span></Form.Label>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-1" controlId="dlExamDate">
                                        <Field disabled={disableExamSubmissionSection()} type="date" name="dlExamDate" className="form-control" placeholder={t('inspectionDate')} />
                                        <ErrorMessage name="dlExamDate" component="div" className="text-danger" />
                                    </Form.Group>
                                </div>
                            </div>

                            {!disableExamSubmissionSection() && (
                                <div className="row mt-1">
                                    <div className="col-sm-12 text-right">
                                        <button type='reset' className='btn btn-success btn-rounded btn-xs mr-1'>{t('reset')}</button>
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

export default (MviSubmission);