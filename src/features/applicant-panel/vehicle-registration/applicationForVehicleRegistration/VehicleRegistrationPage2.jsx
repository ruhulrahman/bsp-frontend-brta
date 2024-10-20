import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import i18n from '@/i18n';
import Loading from '@/components/common/Loading';
import { useParams, useNavigate } from 'react-router-dom';
import helper, { toaster } from '@/utils/helpers.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'

const VehicleRegistrationPage2 = ({ t }) => {

    let { id, isViewable } = useParams()
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const findItem = listData?.find((item) => item.id == id)

    const [initialValues, setInitialValues] = useState({
        vehicleTypeId: '',
        vehicleClassId: '',
        isElectrictVehicle: '',
        ccOrKw: '',
        chassisNumber: '',
        engineNumber: '',
        makerId: '',
        makerCountryId: '',
        manufacturingYear: '',
        bodyColorId: '',
        productLocation: '',
        productDescription: '',
        invoiceNumber: '',
        invoiceDate: '',
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
        pageCompleted: 0,
    }

    const validationSchema = Yup.object().shape({
        billOfEntryNumber: Yup.string().required('Bill of entry is required'),
        billOfEntryDate: Yup.string().required('Bill of entry date is required'),
        makerId: Yup.string().required('Maker Country is required'),
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

            if (result.data.success) {
                toaster(result.data.message)
                navigate('/admin/user-management/user-list')
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
                    <CardTitle className='mb-2'>{t('applicationForVehicleRegistration')} - {t('page')} - {currentLanguage === 'en' ? 2 : toBengaliNumber(2)}</CardTitle>
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

                                            <h4 className="my-2 font-bold text-green-900">{t('vehicleInformation')}</h4>
                                            <hr className='my-3' />

                                            <div className="col-sm-12 col-lg-6 col-xl-6">
                                                <Form.Group className="mb-3" controlId="vehicleTypeId">
                                                    <Form.Label>{t('vehicleType')}</Form.Label>
                                                    <Field
                                                        disabled={isViewable}
                                                        name="vehicleTypeId"
                                                        component={ReactSelect}
                                                        options={commonDropdowns.exporterList}
                                                        placeholder={t('selectExporterName')}
                                                        value={values.vehicleTypeId}
                                                        onChange={(option) => {
                                                            setFieldValue('vehicleTypeId', option ? option.value : '')
                                                        }} // Update Formik value
                                                    />
                                                    <ErrorMessage name="vehicleTypeId" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-sm-12 col-lg-6 col-xl-6">
                                                <Form.Group className="mb-3" controlId="vehicleClassId">
                                                    <Form.Label>{t('vehicleClass')}</Form.Label>
                                                    <Field
                                                        disabled={isViewable}
                                                        name="vehicleClassId"
                                                        component={ReactSelect}
                                                        options={commonDropdowns.exporterList}
                                                        placeholder={t('selectExporterName')}
                                                        value={values.vehicleClassId}
                                                        onChange={(option) => {
                                                            setFieldValue('vehicleClassId', option ? option.value : '')
                                                        }} // Update Formik value
                                                    />
                                                    <ErrorMessage name="vehicleClassId" component="div" className="text-danger" />
                                                </Form.Group>
                                            </div>

                                            <div className="col-sm-12 col-lg-6 col-xl-6">
                                                <Form.Group className="mb-3" controlId="billOfEntryNumber">
                                                    <Form.Label>{t('billOfEntryNumber')} <span className='text-red-500'>*</span></Form.Label>
                                                    <Field disabled={isViewable} type="text" name="billOfEntryNumber" className="form-control" placeholder="Enter bill Of Entry Number" />
                                                    <ErrorMessage name="billOfEntryNumber" component="div" className="text-danger" />
                                                </Form.Group>
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

export default withNamespaces()(VehicleRegistrationPage2);