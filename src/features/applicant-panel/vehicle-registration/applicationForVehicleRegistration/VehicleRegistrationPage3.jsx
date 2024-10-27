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

const VehicleRegistrationPage3 = ({ t }) => {

    let { serviceRequestId, isViewable } = useParams()
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        orgId: '',
        applicantNidInfo: {
            nidNumber: '',
            dob: '',
            nameBn: '',
            nameEn: '',
            fatherOrHusbandNameEn: '',
            fatherOrHusbandNameBn: '',
            motherNameEn: '',
            motherNameBn: '',
            addressEn: '',
            addressBn: '',
            mobile: '',
        },
        vehicleInfoId: '',
        serviceRequestId: '',
        vehcleOwner: {
            name: '',
            fatherOrHusbandName: '',
            motherName: '',
            genderId: '',
            nationalityId: '',
            guardianName: '',
            passportNo: '',
            birthCertificateNo: '',
            addressId: '',
            isRecondition: '',
            isJointOwner: '',
            ownerTypeId: '',
            ministryId: '',
            departmentId: '',
            subOfficeUnitGroupId: '',
            unitOrActivityId: '',
            inUse: '',
            usedById: '',
            withinOrganogram: '',
            acquisitionProcessId: '',
            acquisitionOffice: '',
            acquisitionPrice: '',
            dateOfReceipt: '',
            remarks: '',
            isPrimaryOwner: '',
        },
        addressInfo: {
            addressTypeId: '',
            countryId: '',
            divisionId: '',
            districtId: '',
            locationId: '',
            postCode: '',
            holdingHouseVillage: '',
            roadBlockSectorColony: '',
            mobileNumber: '',
        },
        pageCompleted: 3,
    })

    const resetValues = {
        nidNumber: '',
        dob: '',
        nameEn: '',
        nameBn: '',
        fatherOrHusbandNameEn: '',
        fatherOrHusbandNameBn: '',
        motherNameEn: '',
        motherNameBn: '',
        pageCompleted: 2,
    }

    const validationSchema = Yup.object().shape({
        // vehicleTypeId: Yup.string().required('The Field is required'),
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

    const [districtList, setDistrictList] = useState([]);
    const [thanaList, setThanaList] = useState([]);

    const getDistrictListByParentId = async (parentId) => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/common/get-locations-by-parent-location-id/${parentId}`)
            setDistrictList(data.locationList);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getThanaListByParentId = async (parentId) => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/common/get-locations-by-parent-location-id/${parentId}`)
            setThanaList(data.locationList);
        } catch (error) {
            console.log('error', error)
        }
    }

    const [organization, setOrganization] = useState({
        id: '',
        nameEn: '',
        nameBn: '',
    });

    const getOrgnationNameByThanaId = async (thanaId) => {

        try {
            const data = await RestApi.get(`api/v1/admin/common/get-organization-by-thana-id/${thanaId}`)
            setOrganization(data.data);
            setInitialValues({ ...initialValues, orgId: data.data.id });
        } catch (error) {
            console.log('error', error)
        }
    }

    const [isOwnerTypePublic, setIsOwnerTypePublic] = useState(false);

    const setOwnerType = (ownerTypeId) => {
        const selectedOwner = dropdowns.ownerTypeList.find(
            (item) => item.id === ownerTypeId && item.statusCode === 'owner_type_public'
        );
        setIsOwnerTypePublic(!!selectedOwner);  // Set to true if found, false otherwise
    };

    const getVehicleInfoById = async (serviceRequestId) => {

        try {
            // const { data } = await RestApi.get(`api/v1/applicant/vehicle/${id}`)
            const { data } = await RestApi.get(`api/v1/applicant/vehicle/service/${serviceRequestId}`)

            const apiResponse = Object.assign({}, data.applicantNidInfo, data.vehicleInfo, data, { serviceRequestId: data.id });

            if (apiResponse && apiResponse.pageCompleted < 1) {
                navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
            }
            setInitialValues(apiResponse);

        } catch (error) {
            console.log('error', error)
            navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
        }
    }

    const onSubmit = async (values, setSubmitting, resetForm) => {

        try {
            let result = await RestApi.post('api/v1/applicant/vehicle/registration-application-page3', values)

            if (result.data.success) {
                toaster(result.data.message)
                navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page4/${result.data.data.id}`)
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
                    <CardTitle className='mb-2'>{t('applicationForVehicleRegistration')} - {t('page')} - {currentLanguage === 'en' ? 3 : toBengaliNumber(3)}</CardTitle>
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
                        {({ values, resetForm, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue }) => {
                            useEffect(() => {
                                // Check if the vehicleOwner.ownerTypeId is available and set the owner type.
                                if (values.vehicleOwner?.ownerTypeId) {
                                    setOwnerType(values.vehicleOwner.ownerTypeId);
                                }
                            }, [values.vehicleOwner?.ownerTypeId]);

                            return (
                                <FormikForm>
                                    <Loading loading={loading} loadingText={t('submitting')} />

                                    <Card className='mb-3'>
                                        <CardBody>
                                            <div className="row">

                                                <h4 className="my-2 font-bold text-green-900">{t('nidInformation')}</h4>
                                                <hr className='mb-3' />

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('nationalIdentityNo')}</Form.Label>
                                                        <Field disabled={true} type="number" name="applicantNidInfo.nidNumber" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('Date Of Birth')}</Form.Label>
                                                        <Field disabled={true} type="date" name="applicantNidInfo.dob" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('name')} {t('en')}</Form.Label>
                                                        <Field disabled={true} type="text" name="applicantNidInfo.nameEn" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('name')} {t('bn')}</Form.Label>
                                                        <Field disabled={true} type="text" name="applicantNidInfo.nameBn" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('Father/Husband Name')} {t('bn')}</Form.Label>
                                                        <Field disabled={true} type="text" name="applicantNidInfo.fatherOrHusbandNameBn" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('Mother Name (Bangla)')} {t('bn')}</Form.Label>
                                                        <Field disabled={true} type="text" name="applicantNidInfo.motherNameBn" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                            </div>

                                            <div className="row mt-3">

                                                <h4 className="my-2 font-bold text-green-900">{t('Vehicle Owner Information')}</h4>
                                                <hr className='mb-3' />

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehicleOwner.name">
                                                        <Form.Label>{t('Owner Name ')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="vehicleOwner.name" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="vehicleOwner.name" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehicleOwner.nationalityId">
                                                        <Form.Label>{t('Nationality')}</Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="vehicleOwner.nationalityId"
                                                            component={ReactSelect}
                                                            options={dropdowns.countryList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.vehicleOwner?.nationalityId}
                                                            onChange={(option) => {
                                                                setFieldValue('vehicleOwner.nationalityId', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="vehicleOwner.nationalityId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehicleOwner.fatherOrHusbandName">
                                                        <Form.Label>{t('Father/Husband')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="vehicleOwner.fatherOrHusbandName" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="vehicleOwner.fatherOrHusbandName" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehicleOwner.motherName">
                                                        <Form.Label>{t("Mother's Name")} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="vehicleOwner.motherName" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="vehicleOwner.motherName" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehicleOwner.guardianName">
                                                        <Form.Label>{t("Guardian's Name")} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="vehicleOwner.guardianName" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="vehicleOwner.guardianName" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehicleOwner.passportNo">
                                                        <Form.Label>{t("Passport No")} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="vehicleOwner.passportNo" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="vehicleOwner.passportNo" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehicleOwner.birthCertificateNo">
                                                        <Form.Label>{t("Birth Certificate No")} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="vehicleOwner.birthCertificateNo" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="vehicleOwner.birthCertificateNo" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                            </div>

                                            <div className="row mt-3">

                                                <h4 className="my-2 font-bold text-green-900">{t("Owner's Address :")}</h4>
                                                <hr className='mb-3' />

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="bodyColorId">
                                                        <Form.Label>{t('Country')}</Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="bodyColorId"
                                                            component={ReactSelect}
                                                            options={dropdowns.countryList}
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
                                                    <Form.Group className="mb-3" controlId="addressInfo.divisionId">
                                                        <Form.Label>{t('Division')}</Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="addressInfo.divisionId"
                                                            component={ReactSelect}
                                                            options={dropdowns.divisionList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.addressInfo?.divisionId}
                                                            onChange={(option) => {
                                                                const selectedValue = option ? option.value : '';
                                                                setFieldValue('addressInfo.divisionId', selectedValue);
                                                                getDistrictListByParentId(selectedValue);
                                                            }}
                                                        />
                                                        <ErrorMessage name="addressInfo.divisionId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="addressInfo.districtId">
                                                        <Form.Label>{t('Disctrict')}</Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="addressInfo.districtId"
                                                            component={ReactSelect}
                                                            options={districtList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.addressInfo?.districtId}
                                                            onChange={(option) => {
                                                                const selectedValue = option ? option.value : '';
                                                                setFieldValue('addressInfo.districtId', selectedValue);
                                                                getThanaListByParentId(selectedValue);
                                                            }}
                                                        />
                                                        <ErrorMessage name="addressInfo.districtId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="addressInfo.thanaId">
                                                        <Form.Label>{t('Thana')}</Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="addressInfo.thanaId"
                                                            component={ReactSelect}
                                                            options={thanaList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.addressInfo?.thanaId}
                                                            onChange={(option) => {
                                                                const selectedValue = option ? option.value : '';
                                                                setFieldValue('addressInfo.thanaId', selectedValue);
                                                                getOrgnationNameByThanaId(selectedValue);
                                                            }}
                                                        />
                                                        <ErrorMessage name="addressInfo.thanaId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="addressInfo.postCode">
                                                        <Form.Label>{t('Post Code')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="addressInfo.postCode" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="addressInfo.postCode" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="addressInfo.holdingHouseVillage">
                                                        <Form.Label>{t('Holding House/Village')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="addressInfo.holdingHouseVillage" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="addressInfo.holdingHouseVillage" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="addressInfo.roadBlockSectorColony">
                                                        <Form.Label>{t('Road/Block/Sector/Colony')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="addressInfo.roadBlockSectorColony" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="addressInfo.roadBlockSectorColony" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="addressInfo.mobileNumber">
                                                        <Form.Label>{t('Mobile No')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="addressInfo.mobileNumber" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="addressInfo.mobileNumber" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        {/* <Form.Label>{t('Concerned BRTA Office : ')} {currentLanguage === 'en' ? organization.nameEn : organization.nameBn}</Form.Label> */}
                                                        <Form.Label className='font-bold'>{t('Concerned BRTA Office : ')} {organization.nameBn}</Form.Label>
                                                    </Form.Group>
                                                </div>

                                            </div>

                                            <div className="row">
                                                <hr className='mb-3' />

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehicleOwner.isRecondition">
                                                        <Form.Label>{t('Is Recondition ?')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="vehicleOwner.isRecondition"
                                                            component={ReactSelect}
                                                            options={yesNoList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.vehicleOwner?.isRecondition}
                                                            onChange={(option) => {
                                                                setFieldValue('vehicleOwner.isRecondition', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="vehicleOwner.isRecondition" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehicleOwner.isJointOwner">
                                                        <Form.Label>{t('Joint Owner')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="vehicleOwner.isJointOwner"
                                                            component={ReactSelect}
                                                            options={yesNoList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.vehicleOwner?.isJointOwner}
                                                            onChange={(option) => {
                                                                setFieldValue('vehicleOwner.isJointOwner', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="vehicleOwner.isJointOwner" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3" controlId="vehicleOwner.ownerTypeId">
                                                        <Form.Label>{t('Owner type')} <span className='text-red-500'>*</span></Form.Label>
                                                        <Field
                                                            disabled={isViewable}
                                                            name="vehicleOwner.ownerTypeId"
                                                            component={ReactSelect}
                                                            options={dropdowns.ownerTypeList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.vehicleOwner?.ownerTypeId}
                                                            onChange={(option) => {
                                                                const selectedValue = option ? option.value : '';
                                                                setFieldValue('vehicleOwner.ownerTypeId', selectedValue);
                                                                setOwnerType(selectedValue);
                                                            }}
                                                        />
                                                        <ErrorMessage name="vehicleOwner.ownerTypeId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                            </div>

                                            {isOwnerTypePublic && (


                                                <div className="row">
                                                    <hr className='mb-3' />
                                                    <h3 className='font-bold text-center'>{t('Additional Information for Public Vehicle')}</h3>
                                                    <hr className='my-3' />

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.ministryId">
                                                            <Form.Label>{t('Ministry')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="vehicleOwner.ministryId"
                                                                component={ReactSelect}
                                                                options={dropdowns.countryList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.vehicleOwner?.ministryId}
                                                                onChange={(option) => {
                                                                    setFieldValue('vehicleOwner.ministryId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="vehicleOwner.ministryId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.departmentId">
                                                            <Form.Label>{t('Department')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="vehicleOwner.departmentId"
                                                                component={ReactSelect}
                                                                options={dropdowns.countryList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.vehicleOwner?.departmentId}
                                                                onChange={(option) => {
                                                                    setFieldValue('vehicleOwner.departmentId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="vehicleOwner.departmentId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.subOfficeUnitGroupId">
                                                            <Form.Label>{t('Sub Office/Unit Group')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="vehicleOwner.subOfficeUnitGroupId"
                                                                component={ReactSelect}
                                                                options={dropdowns.countryList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.vehicleOwner?.subOfficeUnitGroupId}
                                                                onChange={(option) => {
                                                                    setFieldValue('vehicleOwner.subOfficeUnitGroupId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="vehicleOwner.subOfficeUnitGroupId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.unitOrActivityId">
                                                            <Form.Label>{t('Unit/Activity')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="vehicleOwner.unitOrActivityId"
                                                                component={ReactSelect}
                                                                options={dropdowns.countryList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.vehicleOwner?.unitOrActivityId}
                                                                onChange={(option) => {
                                                                    setFieldValue('vehicleOwner.unitOrActivityId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="vehicleOwner.unitOrActivityId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.inUse">
                                                            <Form.Label>{t('In Use')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="vehicleOwner.inUse"
                                                                component={ReactSelect}
                                                                options={yesNoList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.vehicleOwner?.inUse}
                                                                onChange={(option) => {
                                                                    setFieldValue('vehicleOwner.inUse', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="vehicleOwner.inUse" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.usedById">
                                                            <Form.Label>{t('Used By')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="vehicleOwner.usedById"
                                                                component={ReactSelect}
                                                                options={dropdowns.countryList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.vehicleOwner.usedById}
                                                                onChange={(option) => {
                                                                    setFieldValue('vehicleOwner.usedById', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="vehicleOwner.usedById" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.withinOrganogram">
                                                            <Form.Label>{t('Within Organogram')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="vehicleOwner.withinOrganogram"
                                                                component={ReactSelect}
                                                                options={yesNoList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.vehicleOwner?.withinOrganogram}
                                                                onChange={(option) => {
                                                                    setFieldValue('vehicleOwner.withinOrganogram', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="vehicleOwner.withinOrganogram" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.acquisitionProcessId">
                                                            <Form.Label>{t('Acquisition Process')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="vehicleOwner.acquisitionProcessId"
                                                                component={ReactSelect}
                                                                options={dropdowns.countryList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.vehicleOwner?.acquisitionProcessId}
                                                                onChange={(option) => {
                                                                    setFieldValue('vehicleOwner.acquisitionProcessId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="vehicleOwner.acquisitionProcessId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.acquisitionOffice">
                                                            <Form.Label>{t("Acquisition Office")} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field disabled={isViewable} type="text" name="vehicleOwner.acquisitionOffice" className="form-control" placeholder={t('enterSomething')} />
                                                            <ErrorMessage name="vehicleOwner.acquisitionOffice" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.acquisitionPrice">
                                                            <Form.Label>{t("Acquisition Price")} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field disabled={isViewable} type="text" name="vehicleOwner.acquisitionPrice" className="form-control" placeholder={t('enterSomething')} />
                                                            <ErrorMessage name="vehicleOwner.acquisitionPrice" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.dateOfReceipt">
                                                            <Form.Label>{t("Date of Receipt")} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field disabled={isViewable} type="date" name="vehicleOwner.dateOfReceipt" className="form-control" placeholder={t('enterSomething')} />
                                                            <ErrorMessage name="vehicleOwner.dateOfReceipt" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="vehicleOwner.remarks">
                                                            <Form.Label>{t("Remarks")} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field disabled={isViewable} type="text" name="vehicleOwner.remarks" className="form-control" placeholder={t('enterSomething')} />
                                                            <ErrorMessage name="vehicleOwner.remarks" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                </div>
                                            )}

                                        </CardBody>
                                    </Card>


                                    <div className="row mt-2 mb-6">
                                        <div className="col-md-12 text-right">

                                            <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page2/${initialValues.id}`)}>{t('previous')}</button>
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

export default withNamespaces()(VehicleRegistrationPage3);