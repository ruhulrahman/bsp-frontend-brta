import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import i18n from '@/i18n';
import Loading from '@/components/common/Loading';
import { useParams, useNavigate } from 'react-router-dom';
import helpers, { toaster } from '@/utils/helpers.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'

const VehicleRegistrationPage1 = () => {
const { t } = useTranslation();

    let { id, isViewable } = useParams()
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const findItem = listData?.find((item) => item.id == id)

    const [initialValues, setInitialValues] = useState({
        billOfEntryNumber: '',
        billOfEntryDate: '',
        billOfEntryOfficeCode: '',
        hsCode: '',
        importerId: '',
        makerId: '',
        makerCountryId: '',
        exporterId: '',
        agent: '',
        productLocation: '',
        productDescription: '',
        invoiceNumber: '',
        invoiceDate: '',
        chassisNumber: '',
        engineNumber: '',
        pageCompleted: 0,
    })

    const resetValues = {
        billOfEntryNumber: '',
        billOfEntryDate: '',
        billOfEntryOfficeCode: '',
        hsCode: '',
        importerId: '',
        makerId: '',
        makerCountryId: '',
        exporterId: '',
        agent: '',
        productLocation: '',
        productDescription: '',
        invoiceNumber: '',
        invoiceDate: '',
        chassisNumber: '',
        engineNumber: '',
        pageCompleted: 1,
    }

    const validationSchema = Yup.object().shape({
        billOfEntryNumber: Yup.string().required('Bill of entry is required'),
        billOfEntryDate: Yup.string().required('Bill of entry date is required'),
        makerCountryId: Yup.string().required('Maker Country is required'),
        invoiceNumber: Yup.string().required('Invoice number is required'),
        invoiceDate: Yup.string().required('Invoice date is required'),
        chassisNumber: Yup.string().required('Chassis number is required'),
        engineNumber: Yup.string().required('Engine number is required'),
    });

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };


    const [parentChildPermissionList, setParentChildPermissionList] = useState([]);


    const [officeList, setOfficeList] = useState([]);

    const [commonDropdowns, setCommonDropdowns] = useState({
        exporterList: [],
        importerList: []
    });

    useEffect(() => {
        getOfficeList();
        getVehicleRegistrationRelatedDropdwonList();
    }, []);

    // Fetch the role by id after the parent-child list is ready
    useEffect(() => {
        if (id) {
            getUserById(id);
        } else {
            setInitialValues(resetValues);
        }
    }, [id, officeList]);

    const getOfficeList = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/common/get-active-orgation-list`)
            console.log('data', data)
            setOfficeList(data);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getVehicleRegistrationRelatedDropdwonList = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/common/get-vehile-registration-related-dropdown-list`)
            setCommonDropdowns(data);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getUserById = async (id) => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/user-management/user/${id}`)
            if (data.userOfficeRoles.length == 0) {
                data.userOfficeRoles = [{
                    orgId: null,
                    roleId: null
                }]
            }
            setInitialValues(data);
            console.log('initialValues', initialValues)

        } catch (error) {
            console.log('error', error)
        }
    }

    const onSubmit = async (values, setSubmitting, resetForm) => {

        try {
            let result = ''
            if (values.id) {
                result = await RestApi.put(`api/v1/applicant/vehicle/registration-application-page1/update/${values.id}`, values)
            } else {
                result = await RestApi.post('api/v1/applicant/vehicle/registration-application-page1', values)
            }

            console.log('result.data', result.data)

            if (result.data.success) {
                toaster(result.data.message)
                navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page2/${result.data.data.id}`)
            }

        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <div>
            <div>
                <CardHeader>
                    {/* <CardTitle className='mb-2'>{id ? t('edit') : t('add_new')} {t('user')}</CardTitle> */}
                    <CardTitle className='mb-2'>{t('applicationForVehicleRegistration')} - {t('page')} - {currentLanguage === 'en' ? 1 : toBengaliNumber(1)}</CardTitle>
                </CardHeader>
                <div>
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
                        {({ values, resetForm, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                            <FormikForm>
                                <Loading loading={loading} loadingText={t('submitting')} />

                                <Card className='mb-3'>
                                    <CardBody>
                                        <div className="row">

                                            {/* <h4 className="my-2 font-bold text-green-900">{t('billOfEntry')}</h4>
                                            <hr className='my-3' /> */}

                                            <div className="col-md-6 col-sm-12">

                                                <h4 className="my-2 font-bold text-green-900">{t('billOfEntry')}</h4>
                                                <hr className='my-3' />

                                                <div className="row mb-3">

                                                    <div className="col-md-12 col-lg-12 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="billOfEntryNumber">
                                                            <Form.Label>{t('billOfEntryNumber')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field disabled={isViewable} type="text" name="billOfEntryNumber" className="form-control" placeholder="Enter bill Of Entry Number" />
                                                            <ErrorMessage name="billOfEntryNumber" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-12 col-lg-12 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="billOfEntryDate">
                                                            <Form.Label>{t('billOfEntryDate')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field disabled={isViewable} type="date" name="billOfEntryDate" className="form-control" />
                                                            <ErrorMessage name="billOfEntryDate" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-12 col-lg-12 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="billOfEntryOfficeCode">
                                                            <Form.Label>{t('entryOfficeCode')}</Form.Label>
                                                            <Field disabled={isViewable} type="text" name="billOfEntryOfficeCode" className="form-control" placeholder="Enter Entry Office Code" />
                                                            <ErrorMessage name="billOfEntryOfficeCode" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-12 col-lg-12 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="hsCode">
                                                            <Form.Label>{t('hsCode')}</Form.Label>
                                                            <Field disabled={isViewable} type="text" name="hsCode" className="form-control" placeholder="Enter hs Code" />
                                                            <ErrorMessage name="hsCode" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-12 col-lg-12 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="agent">
                                                            <Form.Label>{t('agent')}</Form.Label>
                                                            <Field disabled={isViewable} type="text" name="agent" className="form-control" placeholder="Enter agent" />
                                                            <ErrorMessage name="agent" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-12 col-lg-12 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="productLocation">
                                                            <Form.Label>{t('productLocation')}</Form.Label>
                                                            <Field disabled={isViewable} type="text" name="productLocation" className="form-control" placeholder="Enter product location" />
                                                            <ErrorMessage name="productLocation" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <Form.Group className="mb-3" controlId="productDescription">
                                                            <Form.Label>{t('productDescription')}</Form.Label>
                                                            <Field disabled={isViewable} type="text" name="productDescription" className="form-control" placeholder="Enter product description" />
                                                            <ErrorMessage name="productDescription" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>


                                                    <div className="col-md-12">
                                                        <Form.Group className="mb-3" controlId="exporterId">
                                                            <Form.Label>{t('exporterName')}</Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="exporterId"
                                                                component={ReactSelect}
                                                                options={commonDropdowns.exporterList}
                                                                placeholder={t('selectExporterName')}
                                                                value={values.exporterId}
                                                                onChange={(option) => {
                                                                    setFieldValue('exporterId', option ? option.value : '')
                                                                }} // Update Formik value
                                                            />
                                                            <ErrorMessage name="exporterId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <Form.Group className="mb-3" controlId="importerId">
                                                            <Form.Label>{t('importerName')}</Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="importerId"
                                                                component={ReactSelect}
                                                                options={commonDropdowns.importerList}
                                                                placeholder={t('selectImporterName')}
                                                                value={values.importerId}
                                                                onChange={(option) => {
                                                                    setFieldValue('importerId', option ? option.value : '')
                                                                }} // Update Formik value
                                                            />
                                                            <ErrorMessage name="importerId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <Form.Group className="mb-3" controlId="makerCountryId">
                                                            <Form.Label>{t('makerCountry')}</Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="makerCountryId"
                                                                component={ReactSelect}
                                                                options={dropdowns.countryList}
                                                                placeholder={t('selectMakerCountry')}
                                                                value={values.makerCountryId}
                                                                onChange={(option) => {
                                                                    setFieldValue('makerCountryId', option ? option.value : '')
                                                                }} // Update Formik value
                                                            />
                                                            <ErrorMessage name="makerCountryId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="col-md-6 col-sm-12">

                                                <h4 className="my-2 font-bold text-green-900">{t('billOfInvoiceEntry')}</h4>
                                                <hr className='my-3' />

                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <Form.Group className="mb-3" controlId="invoiceNumber">
                                                            <Form.Label>{t('invoiceNumber')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field disabled={isViewable} type="text" name="invoiceNumber" className="form-control" placeholder="Enter invoice number" />
                                                            <ErrorMessage name="invoiceNumber" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <Form.Group className="mb-3" controlId="invoiceDate">
                                                            <Form.Label>{t('invoiceDate')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field disabled={isViewable} type="date" name="invoiceDate" className="form-control" placeholder="Enter invoice date" />
                                                            <ErrorMessage name="invoiceDate" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <Form.Group className="mb-3" controlId="chassisNumber">
                                                            <Form.Label>{t('chassisNumber')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field disabled={isViewable} type="text" name="chassisNumber" className="form-control" placeholder="Enter chassis number" />
                                                            <ErrorMessage name="chassisNumber" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <Form.Group className="mb-3" controlId="engineNumber">
                                                            <Form.Label>{t('engineNumber')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field disabled={isViewable} type="text" name="engineNumber" className="form-control" placeholder="Enter engine number" />
                                                            <ErrorMessage name="engineNumber" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>


                                <div className="row mt-2 mb-6">
                                    <div className="col-md-12 text-right">
                                        {isViewable ? (
                                            <button className='btn btn-secondary btn-rounded btn-xs' onClick={() => navigate(`/admin/user-management/user-list`)}>{t('back')}</button>
                                        ) : (
                                            <>
                                                <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{t('saveAndNext')}</button>
                                                <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('reset')}</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </FormikForm>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default (VehicleRegistrationPage1);