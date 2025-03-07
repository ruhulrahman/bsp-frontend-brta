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

const VehicleRegistrationPage2 = () => {
const { t } = useTranslation();

    let { serviceRequestId, isViewable } = useParams()
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        vehicleTypeId: '',
        vehicleClassId: '',
        isElectrictVehicle: false,
        ccOrKw: '',
        chassisNumber: '',
        engineNumber: '',
        makerId: '',
        makerCountryId: '',
        manufacturingYear: '',
        bodyColorId: '',
        assemblyOperationId: '',
        mileage: '',
        unladenWeight: '',
        maxLadenWeight: '',
        isHire: false,
        isHirePurchase: false,
        totalSeat: '',
        fuelId: '',
        brandId: '',
        vehiclePrice: '',
        economicLife: '',
        remainingLife: '',
        model: '',
        cylinder: '',
        isAirConditioner: false,
        horsePower: '',
        highestRpm: '',
        wheelBase: '',
        standee: '',
        tyreSize: '',
        tyreNumber: '',
        axleNumber: '',
        frontAxle1: '',
        frontAxle2: '',
        centralAxle1: '',
        centralAxle2: '',
        centralAxle3: '',
        rearAxle1: '',
        rearAxle2: '',
        rearAxle3: '',
        overallLength: '',
        overallWidth: '',
        overallHeight: '',
        overhangsFront: '',
        overhangsRear: '',
        overhangsOther: '',
        pageCompleted: 2,
    })

    const resetValues = {
        vehicleTypeId: '',
        vehicleClassId: '',
        isElectrictVehicle: false,
        ccOrKw: '',
        chassisNumber: '',
        engineNumber: '',
        makerId: '',
        makerCountryId: '',
        manufacturingYear: '',
        bodyColorId: '',
        assemblyOperationId: '',
        mileage: '',
        unladenWeight: '',
        maxLadenWeight: '',
        isHire: false,
        isHirePurchase: false,
        totalSeat: '',
        fuelId: '',
        brandId: '',
        vehiclePrice: '',
        economicLife: '',
        remainingLife: '',
        model: '',
        cylinder: '',
        isAirConditioner: false,
        horsePower: '',
        highestRpm: '',
        wheelBase: '',
        standee: '',
        tyreSize: '',
        tyreNumber: '',
        axleNumber: '',
        frontAxle1: '',
        frontAxle2: '',
        centralAxle1: '',
        centralAxle2: '',
        centralAxle3: '',
        rearAxle1: '',
        rearAxle2: '',
        rearAxle3: '',
        overallLength: '',
        overallWidth: '',
        overallHeight: '',
        overhangsFront: '',
        overhangsRear: '',
        overhangsOther: '',
        pageCompleted: 2,
    }

    const validationSchema = Yup.object().shape({
        vehicleTypeId: Yup.string().required('The Field is required'),
        vehicleClassId: Yup.string().required('The Field is required'),
        isElectrictVehicle: Yup.string().required('The Field is required'),
        ccOrKw: Yup.number().required('The Field is required'),
        manufacturingYear: Yup.number().required('The Field is required'),
        bodyColorId: Yup.string().required('The Field is required'),
        assemblyOperationId: Yup.string().required('The Field is required'),
        mileage: Yup.number().required('The Field is required'),
        unladenWeight: Yup.number().required('The Field is required'),
        maxLadenWeight: Yup.number().required('The Field is required'),
        isHire: Yup.string().required('The Field is required'),
        isHirePurchase: Yup.string().required('The Field is required'),
        totalSeat: Yup.number().required('The Field is required'),
        fuelId: Yup.string().required('The Field is required'),
        vehiclePrice: Yup.string().required('The Field is required'),
        tyreSize: Yup.string().required('The Field is required'),
        axleNumber: Yup.string().required('The Field is required'),
        tyreNumber: Yup.string().required('The Field is required'),
    });

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };


    const [officeList, setOfficeList] = useState([]);

    const [commonDropdowns, setCommonDropdowns] = useState({
        exporterList: [],
        importerList: [],
        assembleOperationList: [],
        vehicleMakerList: [],
        vehicleColorList: [],
        vehicleClassList: [],
        fuelTypeList: [],
        vehicleBrandList: [],
    });


    useEffect(() => {
        getOfficeList();
        getVehicleRegistrationRelatedDropdwonList();
    }, []);

    // Fetch the role by id after the parent-child list is ready
    useEffect(() => {
        if (serviceRequestId) {
            getVehicleInfoById(serviceRequestId);
        } else {
            navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
            setInitialValues(resetValues);
        }
    }, [serviceRequestId, officeList]);

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

    const getVehicleInfoById = async (serviceRequestId) => {

        try {
            // const { apiResponse } = await RestApi.get(`api/v1/applicant/vehicle/${id}`)

            const { data } = await RestApi.get(`api/v1/applicant/vehicle/service/${serviceRequestId}`)

            const apiResponse = Object.assign({}, data.applicantNidInfo, data.vehicleInfo, data, { serviceRequestId: data.id });

            if (apiResponse && apiResponse.pageCompleted < 1) {
                navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
            }
            setInitialValues(apiResponse);
            console.log('apiResponse', apiResponse)

        } catch (error) {
            console.log('error', error)
            navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
        }
    }

    const onSubmit = async (values, setSubmitting, resetForm, setErrors) => {

        try {
            let result = await RestApi.post('api/v1/applicant/vehicle/registration-application-page2', values)

            if (result.data.success) {
                toaster(result.data.message)
                // navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page3/${result.data.data.id}`)
                navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page3/${serviceRequestId}`)
            }

        } catch (error) {
            console.log('error', error)
            if (error.response && error.response.data) {
                setErrors(error.response.data)
            }
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
                        onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            onSubmit(values, setSubmitting, resetForm, setErrors);
                        }}
                    >
                        {({ values, resetForm, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue }) => {

                            useEffect(() => {
                                if (values.vehicleTypeId) {
                                    getVehicleClassListByVehicleTypeId(values.vehicleTypeId);
                                }
                            }, [values.vehicleTypeId]);

                            const [remainingLifeInDate, setRemainingLifeInDate] = useState('')

                            useEffect(() => {
                                if (values.economicLife) {
                                    let remainingLife = helpers.calculateRemainingLife(values.economicLife, values.manufacturingYear)
                                    setRemainingLifeInDate(remainingLife)
                                    setFieldValue('remainingLife', remainingLife)
                                }
                            }, [values.economicLife, values.manufacturingYear]);

                            const [vehicleClassList, setVehicleClassList] = useState([])
                            const getVehicleClassListByVehicleTypeId = async (vehicleTypeId) => {

                                try {
                                    const { data } = await RestApi.get(`api/v1/admin/configurations/vehicle-class/get-vehicle-class-list-by-vehicle-type-id/${vehicleTypeId}`)
                                    setVehicleClassList(data);
                                } catch (error) {
                                    console.log('error', error)
                                }
                            }

                            return (
                                <FormikForm>
                                    <Loading loading={loading} loadingText={t('submitting')} />

                                    <Card className='mb-3'>
                                        <CardBody>
                                            <div className="row">

                                                <h4 className="my-2 font-bold text-green-900">{t('vehicleInformation')}</h4>
                                                <hr className='mb-3' />

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehicleTypeId">
                                                        <Form.Label>{t('vehicleType')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="vehicleTypeId"
                                                            component={ReactSelect}
                                                            options={dropdowns.vehicleTypeList}
                                                            placeholder={t('pleaseSelectOne')}
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
                                                        <Form.Label>{t('vehicleClass')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="vehicleClassId"
                                                            component={ReactSelect}
                                                            options={vehicleClassList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.vehicleClassId}
                                                            onChange={(option) => {
                                                                setFieldValue('vehicleClassId', option ? option.value : '')
                                                            }} // Update Formik value
                                                        />
                                                        <ErrorMessage name="vehicleClassId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="isElectrictVehicle">
                                                        <Form.Label>{t('electricVehicle')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="isElectrictVehicle"
                                                            component={ReactSelect}
                                                            options={yesNoList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.isElectrictVehicle}
                                                            onChange={(option) => {
                                                                setFieldValue('isElectrictVehicle', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="isElectrictVehicle" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="ccOrKw">
                                                        <Form.Label>{t('ccOrKw')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="number" name="ccOrKw" className="form-control" placeholder="Enter cc or kw" />
                                                        <ErrorMessage name="ccOrKw" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="chassisNumber">
                                                        <Form.Label>{t('chassisNumber')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="chassisNumber" className="form-control" placeholder="Enter chassis number" />
                                                        <ErrorMessage name="chassisNumber" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="engineNumber">
                                                        <Form.Label>{t('engineNumber')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="engineNumber" className="form-control" placeholder="Enter engine number" />
                                                        <ErrorMessage name="engineNumber" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="manufacturingYear">
                                                        <Form.Label>{t('manufacturingYear')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="number" name="manufacturingYear" className="form-control" placeholder="Enter manufacturing Year" />
                                                        <ErrorMessage name="manufacturingYear" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="bodyColorId">
                                                        <Form.Label>{t('colourCabin')}</Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="bodyColorId"
                                                            component={ReactSelect}
                                                            options={dropdowns.vehicleColorList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.bodyColorId}
                                                            onChange={(option) => {
                                                                setFieldValue('bodyColorId', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="bodyColorId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="assemblyOperationId">
                                                        <Form.Label>{t('assemblyOperation')}</Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="assemblyOperationId"
                                                            component={ReactSelect}
                                                            options={commonDropdowns.assembleOperationList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.assemblyOperationId}
                                                            onChange={(option) => {
                                                                setFieldValue('assemblyOperationId', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="assemblyOperationId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="mileage">
                                                        <Form.Label>{t('mileage')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="number" name="mileage" className="form-control" placeholder="Enter mileage" />
                                                        <ErrorMessage name="mileage" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="unladenWeight">
                                                        <Form.Label>{t('unladenWeight')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="number" name="unladenWeight" className="form-control" placeholder="Enter unladen weight" />
                                                        <ErrorMessage name="unladenWeight" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="maxLadenWeight">
                                                        <Form.Label>{t('maxLadenWeight')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="number" name="maxLadenWeight" className="form-control" placeholder="Enter max laden weight" />
                                                        <ErrorMessage name="maxLadenWeight" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="isHire">
                                                        <Form.Label>{t('hire')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="isHire"
                                                            component={ReactSelect}
                                                            options={yesNoList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.isHire}
                                                            onChange={(option) => {
                                                                setFieldValue('isHire', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="isHire" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="isHirePurchase">
                                                        <Form.Label>{t('hirePurchase')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="isHirePurchase"
                                                            component={ReactSelect}
                                                            options={yesNoList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.isHirePurchase}
                                                            onChange={(option) => {
                                                                setFieldValue('isHirePurchase', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="isHirePurchase" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="totalSeat">
                                                        <Form.Label>{t('totalSeat')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="number" name="totalSeat" className="form-control" placeholder="Enter total seat" />
                                                        <ErrorMessage name="totalSeat" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="fuelId">
                                                        <Form.Label>{t('fuelUsed')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="fuelId"
                                                            component={ReactSelect}
                                                            options={dropdowns.fuelTypeList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.fuelId}
                                                            onChange={(option) => {
                                                                setFieldValue('fuelId', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="fuelId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="brandId">
                                                        <Form.Label>{t('vehicleBrand')}</Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="brandId"
                                                            component={ReactSelect}
                                                            options={commonDropdowns.vehicleBrandList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.brandId}
                                                            onChange={(option) => {
                                                                setFieldValue('brandId', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="brandId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="isAirConditioner">
                                                        <Form.Label>{t('airConditioner')}</Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="isAirConditioner"
                                                            component={ReactSelect}
                                                            options={yesNoList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.isAirConditioner}
                                                            onChange={(option) => {
                                                                setFieldValue('isAirConditioner', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="isAirConditioner" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehiclePrice">
                                                        <Form.Label>{t('vehiclePrice')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="number" name="vehiclePrice" className="form-control" placeholder="Enter vehicle price" />
                                                        <ErrorMessage name="vehiclePrice" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="economicLife">
                                                        <Form.Label>{t('economicLife')}</Form.Label>
                                                        <Field disabled={isViewable} type="number" name="economicLife" className="form-control" placeholder="Enter economic life" />
                                                        <ErrorMessage name="economicLife" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="remainingLife">
                                                        <Form.Label>{t('remainingLife')}</Form.Label>
                                                        <span className="form-control">{remainingLifeInDate}</span>
                                                        {/* <Field disabled={isViewable} type="date" name="remainingLife" className="form-control" placeholder="Enter remaining life" /> */}
                                                        {/* <ErrorMessage name="remainingLife" component="div" className="text-danger" /> */}
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="model">
                                                        <Form.Label>{t('vehicleModel')}</Form.Label>
                                                        <Field disabled={isViewable} type="text" name="model" className="form-control" placeholder="Enter vehicle model" />
                                                        <ErrorMessage name="model" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="cylinder">
                                                        <Form.Label>{t('noOfCylinder')}</Form.Label>
                                                        <Field disabled={isViewable} type="number" name="cylinder" className="form-control" placeholder="Enter cylinder" />
                                                        <ErrorMessage name="cylinder" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="horsePower">
                                                        <Form.Label>{t('horsePower')}</Form.Label>
                                                        <Field disabled={isViewable} type="number" name="horsePower" className="form-control" placeholder="Enter horse power" />
                                                        <ErrorMessage name="horsePower" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="highestRpm">
                                                        <Form.Label>{t('highestRpm')}</Form.Label>
                                                        <Field disabled={isViewable} type="number" name="highestRpm" className="form-control" placeholder="Enter highest rpm" />
                                                        <ErrorMessage name="highestRpm" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="standee">
                                                        <Form.Label>{t('standee')}</Form.Label>
                                                        <Field disabled={isViewable} type="number" name="standee" className="form-control" placeholder="Enter standee" />
                                                        <ErrorMessage name="standee" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="wheelBase">
                                                        <Form.Label>{t('wheelBase')}</Form.Label>
                                                        <Field disabled={isViewable} type="text" name="wheelBase" className="form-control" placeholder="Enter wheelBase" />
                                                        <ErrorMessage name="wheelBase" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                            </div>

                                            <div className="row mt-3">

                                                <h4 className="my-2 font-bold text-green-900">{t('vehicleDetailsInformation')}</h4>
                                                <hr className='mb-3' />

                                                <div className="col-sm-12 col-lg-4 col-xl-4">
                                                    <Form.Group className="mb-3" controlId="tyreSize">
                                                        <Form.Label>{t('tyreSize')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="tyreSize" className="form-control" placeholder="Enter tyre size" />
                                                        <ErrorMessage name="tyreSize" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-4 col-xl-4">
                                                    <Form.Group className="mb-3" controlId="axleNumber">
                                                        <Form.Label>{t('axleNumber')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="number" name="axleNumber" className="form-control" placeholder="Enter axle number" />
                                                        <ErrorMessage name="axleNumber" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-4 col-xl-4">
                                                    <Form.Group className="mb-3" controlId="tyreNumber">
                                                        <Form.Label>{t('tyreNumber')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="number" name="tyreNumber" className="form-control" placeholder="Enter tyre number" />
                                                        <ErrorMessage name="tyreNumber" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                            </div>

                                            <div className="row">
                                                <hr className='my-3' />

                                                <div className="col-sm-11 col-lg-5 col-xl-5 border mr-1 p-2 mt-1">
                                                    <Form.Group className="mb-3" controlId="frontAxle1">
                                                        <Form.Label>{t('frontAxle')} ({t('maximumAxleWeight')} :)</Form.Label>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <Field disabled={isViewable} type="number" name="frontAxle1" className="form-control" placeholder="1" />
                                                                <ErrorMessage name="frontAxle1" component="div" className="text-danger" />
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <Field disabled={isViewable} type="number" name="frontAxle2" className="form-control" placeholder="2" />
                                                                <ErrorMessage name="frontAxle2" component="div" className="text-danger" />
                                                            </div>
                                                        </div>
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-11 col-lg-5 col-xl-5 border p-2 mt-1">
                                                    <Form.Group className="mb-3" controlId="centralAxle1">
                                                        <Form.Label>{t('centralAxle')} ({t('maximumAxleWeight')} :)</Form.Label>
                                                        <div className="row">
                                                            <div className="col-sm-4">
                                                                <Field disabled={isViewable} type="number" name="centralAxle1" className="form-control" placeholder="1" />
                                                                <ErrorMessage name="centralAxle1" component="div" className="text-danger" />
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <Field disabled={isViewable} type="number" name="centralAxle2" className="form-control" placeholder="2" />
                                                                <ErrorMessage name="centralAxle2" component="div" className="text-danger" />
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <Field disabled={isViewable} type="number" name="centralAxle3" className="form-control" placeholder="3" />
                                                                <ErrorMessage name="centralAxle3" component="div" className="text-danger" />
                                                            </div>
                                                        </div>
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-11 col-lg-5 col-xl-5 border p-2 mt-1">
                                                    <Form.Group className="mb-3" controlId="rearAxle1">
                                                        <Form.Label>{t('rearAxle')} ({t('maximumAxleWeight')} :)</Form.Label>
                                                        <div className="row">
                                                            <div className="col-sm-4">
                                                                <Field disabled={isViewable} type="number" name="rearAxle1" className="form-control" placeholder="1" />
                                                                <ErrorMessage name="rearAxle1" component="div" className="text-danger" />
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <Field disabled={isViewable} type="number" name="rearAxle2" className="form-control" placeholder="2" />
                                                                <ErrorMessage name="rearAxle2" component="div" className="text-danger" />
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <Field disabled={isViewable} type="number" name="rearAxle3" className="form-control" placeholder="3" />
                                                                <ErrorMessage name="rearAxle3" component="div" className="text-danger" />
                                                            </div>
                                                        </div>
                                                    </Form.Group>
                                                </div>

                                            </div>

                                            <div className="row mt-2">

                                                <hr className='my-3' />

                                                <h3 className='text-center mb-3 font-semibold'>{t('dimension')} :</h3>

                                                <div className="col-sm-12 col-lg-4 col-xl-4">
                                                    <Form.Group className="mb-3" controlId="overallLength">
                                                        <Form.Label>{t('overallLength')}</Form.Label>
                                                        <Field disabled={isViewable} type="number" name="overallLength" className="form-control" placeholder="" />
                                                        <ErrorMessage name="overallLength" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-4 col-xl-4">
                                                    <Form.Group className="mb-3" controlId="overallWidth">
                                                        <Form.Label>{t('overallWidth')}</Form.Label>
                                                        <Field disabled={isViewable} type="number" name="overallWidth" className="form-control" placeholder="" />
                                                        <ErrorMessage name="overallWidth" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-4 col-xl-4">
                                                    <Form.Group className="mb-3" controlId="overallHeight">
                                                        <Form.Label>{t('overallHeight')}</Form.Label>
                                                        <Field disabled={isViewable} type="number" name="overallHeight" className="form-control" placeholder="" />
                                                        <ErrorMessage name="overallHeight" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                            </div>

                                            <div className="row mt-2">

                                                <hr className='my-3' />

                                                <h3 className='text-center mb-3 font-semibold'>{t('overhangs')} (%) :</h3>

                                                <div className="col-sm-12 col-lg-4 col-xl-4">
                                                    <Form.Group className="mb-3" controlId="overhangsFront">
                                                        <Form.Label>{t('overhangsFront')}</Form.Label>
                                                        <Field disabled={isViewable} type="number" name="overhangsFront" className="form-control" placeholder="" />
                                                        <ErrorMessage name="overhangsFront" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-4 col-xl-4">
                                                    <Form.Group className="mb-3" controlId="overhangsRear">
                                                        <Form.Label>{t('overhangsRear')}</Form.Label>
                                                        <Field disabled={isViewable} type="number" name="overhangsRear" className="form-control" placeholder="" />
                                                        <ErrorMessage name="overhangsRear" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-4 col-xl-4">
                                                    <Form.Group className="mb-3" controlId="overhangsOther">
                                                        <Form.Label>{t('overhangsOther')}</Form.Label>
                                                        <Field disabled={isViewable} type="number" name="overhangsOther" className="form-control" placeholder="" />
                                                        <ErrorMessage name="overhangsOther" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                            </div>

                                        </CardBody>
                                    </Card>


                                    <div className="row mt-2 mb-6">
                                        <div className="col-md-12 text-right">

                                            <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1/${initialValues.id}`)}>{t('previous')}</button>
                                            <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{t('saveAndNext')}</button>
                                            {!isViewable && (
                                                <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('reset')}</button>
                                            )}
                                        </div>
                                    </div>
                                </FormikForm>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default (VehicleRegistrationPage2);