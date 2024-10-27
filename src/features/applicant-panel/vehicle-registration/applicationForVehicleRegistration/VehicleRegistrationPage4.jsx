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

const VehicleRegistrationPage4 = ({ t }) => {

    let { serviceRequestId, isViewable } = useParams()
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        orgId: '',
        vehicleInfoId: '',
        serviceRequestId: '',
        billOfEntry: '',
        pageCompleted: 4,
    })

    const resetValues = {
        nidNumber: '',
        pageCompleted: 2,
    }

    const validationSchema = Yup.object().shape({
        // billOfEntry: Yup.mixed().required('A file is required')
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

        navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-first-payment/${serviceRequestId}`)

        // try {
        //     let result = await RestApi.post('api/v1/applicant/vehicle/registration-application-page4', values)

        //     if (result.data.success) {
        //         toaster(result.data.message)
        //         navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page5/${result.data.data.id}`)
        //     }

        // } catch (error) {
        //     console.log('error', error)
        //     // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        // } finally {
        //     setSubmitting(false)
        // }
    };

    return (
        <div>
            <div>
                <CardHeader>
                    {/* <CardTitle className='mb-2'>{id ? t('edit') : t('add_new')} {t('user')}</CardTitle> */}
                    <CardTitle className='mb-2'>{t('applicationForVehicleRegistration')} - {t('page')} - {currentLanguage === 'en' ? 4 : toBengaliNumber(4)}</CardTitle>
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

                                                <h4 className="my-2 font-bold text-green-900">{t('Add required attachments (File Size Maximum 600 KB)')}</h4>
                                                <hr className='mb-3' />

                                                <div className="col-sm-12 col-lg-12 col-xl-12">

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>BILL OF ENTRY <span className='text-danger'>*</span></Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>OWNERS NID <span className='text-danger'>*</span></Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>OWNER SPECIMEN SIGNATURE <span className='text-danger'>*</span></Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>SALES INTIMATION FOR VEHICLE & OWNERS PARTICULARS <span className='text-danger'>*</span></Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>SHOWROOM SALES INVOICE <span className='text-danger'>*</span></Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>OTHER CUSTOM DOCUMENTS</Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>GATE PASS (MOTOR CYCLE/ TWO WHEELER)</Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>VAT 6.3 (MOTOR CYCLE/ TWO WHEELER/ THREE WHEELER)</Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>T.R. CHALAN (MOTOR CYCLE/ TWO WHEELER/ THREE WHEELER)</Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>TIN COPY (IF AIT REQUIRED)</Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>T.O FORM (RECONDITION VEHICLE)</Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>DEREGISTRATION CERTIFICATE (RECONDITION VEHICLE)</Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>OTHERS DOCUMENT</Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files[0];
                                                                        setFieldValue("file", file);  // Set file value in Formik state
                                                                    }}
                                                                    className="form-control max-w-[350px]"
                                                                />
                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                            </div>
                                                        </Form.Group>
                                                    </div>

                                                </div>

                                            </div>

                                        </CardBody>
                                    </Card>


                                    <div className="row mt-2 mb-6">
                                        <div className="col-md-12 text-right">

                                            <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page3/${initialValues.id}`)}>{t('previous')}</button>
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

export default withNamespaces()(VehicleRegistrationPage4);