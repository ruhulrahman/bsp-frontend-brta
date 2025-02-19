import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import i18n from '@/i18n';
import Loading from '@/components/common/Loading';
import { setListData, setLoading, toggleShowFilter } from '@/store/commonSlice';
import { setUserImage } from '@/features/common/auth/authSlice';
import { useParams, useNavigate } from 'react-router-dom';
import helpers, { toaster } from '@/utils/helpers.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import dummyUserImage from '@/assets/images/dummy-user.png';

import manPhoto from '@/assets/images/man.png';
import profileBackground from '@/assets/images/profile-background.png';

const DrivingLicenseApplicationPage1 = () => {
const { t } = useTranslation();

    let { serviceRequestNo, isViewable } = useParams()
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const { authUser, userImage } = useSelector((state) => state.auth) || {};

    const [initialValues, setInitialValues] = useState({
        serviceRequestNo: '',
        dlInfoId: '',
        orgId: '',
        applicantImage: '',
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
            genderId: '',
        },
        // dlInformation Start ======
        dlLanguageId: 60,
        applicationTypeId: 49,
        applicantTypeId: '',
        licenseTypeId: '',
        bloodGroupId: '',
        dlVehicleClassIds: [],
        issuedOfficeId: '',
        eduQualificationId: '',
        occupationId: '',
        nationalityId: '',
        maritalStatusId: '',
        spouseName: '',
        spouseContactNo: '',
        isOtherCitizenship: '',
        // dlInformation End ======
        stageCompleted: 1,
    })

    const resetValues = {
        serviceRequestNo: '',
        dlInfoId: '',
        orgId: '',
        applicantImage: '',
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
            genderId: '',
            photo: '',
        },
        // dlInformation Start ======
        dlLanguageId: '',
        applicationTypeId: '',
        applicantTypeId: '',
        licenseTypeId: '',
        bloodGroupId: '',
        dlVehicleClassIds: [],
        issuedOfficeId: '',
        eduQualificationId: '',
        occupationId: '',
        nationalityId: '',
        maritalStatusId: '',
        spouseName: '',
        spouseContactNo: '',
        isOtherCitizenship: '',
        // dlInformation End ======
        stageCompleted: 1,
    }

    const validationSchema = Yup.object().shape({
        // vehicleTypeId: Yup.string().required('The Field is required'),
    });

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };


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
        setInitialValues(resetValues);
        getUserNidInfo();
    }, []);


    const getUserNidInfo = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-nid-info`)
            // setInitialValues(data);
            setInitialValues({ ...initialValues, applicantNidInfo: data });
            getDLServiceRequestByAuthUser();
        } catch (error) {
            console.log('error', error)
        }
    }

    const [isSubmittedApplication, setIsSubmittedApplication] = useState(false);

    const getDLServiceRequestByAuthUser = async (serviceRequestNo) => {
        dispatch(setLoading(true));
        try {
            // const { data } = await RestApi.get(`api/v1/applicant/vehicle/${id}`)
            const { data } = await RestApi.get(`api/driving-license/v1/get-application-details-by-user`)

            if (data.isServiceRequest) {
                toaster('Another new driving license application found against this user !', 'error')
                setIsSubmittedApplication(true)
            } else {

                const apiResponse = {
                    ...data.dlServiceRequestResponse.dlInformation,
                    ...data.dlServiceRequestResponse,
                    isOtherCitizenship: data.dlServiceRequestResponse.dlInformation.isOtherCitizenship // This should be `true` or `false`
                };

                // if (apiResponse && apiResponse.pageCompleted < 1) {
                //     navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
                // }
                setInitialValues(apiResponse);
            }

        } catch (error) {
            console.log('error', error)
            // navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
        } finally {
            dispatch(setLoading(false));
        }
    }

    const onSubmit = async (values, setSubmitting, resetForm, setErrors) => {

        try {
            let { data } = await RestApi.post('api/driving-license/v1/application-page1', values)

            if (data.success) {
                toaster(data.message)
                navigate(`/applicant-panel/driving-license/new-driving-license/application-page2/${data.data.serviceRequestNo}`)
            }

        } catch (error) {
            console.log('error', error)
            setErrors(helper.getErrorMessage(error))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <div className="container-fluid mx-auto max-w-screen-4xl px-4 lg:px-8 xl:px-16">
                <CardHeader>
                    {/* <CardTitle className='mb-2'>{id ? t('edit') : t('add_new')} {t('user')}</CardTitle> */}
                    <CardTitle className='mb-2'>{t('newDrivingLicenseApplication')} - {t('page')} - {currentLanguage === 'en' ? 1 : toBengaliNumber(1)}</CardTitle>
                </CardHeader>
                <div>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            onSubmit(values, setSubmitting, resetForm, setErrors);
                        }}
                    >
                        {({ values, resetForm, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue }) => {

                            const [drivingLicenseClassList, setDrivingLicenseClassList] = useState([]);
                            useEffect(() => {
                                if (values.licenseTypeId) {
                                    const selectLicenseType = dropdowns.drivingLicenseTypeList.find(item => item.id === values.licenseTypeId)
                                    if (selectLicenseType) {
                                        if (selectLicenseType.statusCode === 'dl_non_professional') {
                                            const vehicleClassList = dropdowns.drivingLicenseClassList.filter(item => {
                                                if (item.statusCode != 'dl_class_medium' && item.statusCode != 'dl_class_heavy' && item.statusCode != 'dl_class_three_wheeler') {
                                                    return item
                                                }
                                            });

                                            setDrivingLicenseClassList(vehicleClassList);
                                        } else {
                                            const vehicleClassList = dropdowns.drivingLicenseClassList.filter(item => {
                                                if (item.statusCode != 'dl_class_medium' && item.statusCode != 'dl_class_heavy') {
                                                    return item
                                                }
                                            });

                                            setDrivingLicenseClassList(vehicleClassList);
                                        }
                                    }
                                }
                            }, [values.licenseTypeId]);

                            const [showSpouseSection, setShowSpouseSection] = useState(false);
                            useEffect(() => {
                                if (values.maritalStatusId) {
                                    const selectStatus = dropdowns.maritalStatusList.find(item => item.id === values.maritalStatusId)
                                    if (selectStatus) {
                                        if (selectStatus.statusCode === 'marital_status_married') {
                                            setShowSpouseSection(true);
                                        } else {
                                            setShowSpouseSection(false);
                                        }
                                    }
                                }
                            }, [values.maritalStatusId]);

                            const fileInputRef = useRef(null);

                            // Trigger file input on button click
                            const handleButtonClick = () => {
                                fileInputRef.current.click();
                            };

                            const [userUploadImage, setUserUploadImage] = useState(null);

                            // Handle file change event
                            const handleFileChange = async (event) => {
                                const selectedFile = event.target.files[0];

                                const allowedTypes = ["image/jpeg", "image/png"];
                                console.log('selectedFile', selectedFile)
                                if (!allowedTypes.includes(selectedFile.type)) {
                                    // setError("Invalid file type. Only JPEG, PNG, and PDF files are allowed.");
                                    toaster("Invalid file type. Only JPEG, and PNG files are allowed.", 'error');
                                    return;
                                }

                                // Validate file size (e.g., 600 KB limit)
                                const maxSizeInBytes = 600 * 1024; // 600 KB
                                if (selectedFile.size > maxSizeInBytes) {
                                    // setError("File size exceeds 600 KB.");
                                    toaster("Photo size should be less than 600 KB.", 'error');
                                    return;
                                }

                                if (selectedFile) {
                                    console.log("Selected file:", selectedFile.name); // Replace with your file handling logic
                                    // setUserUploadImage(URL.createObjectURL(selectedFile))

                                    dispatch(setLoading(true));

                                    try {
                                        const formData = new FormData();
                                        formData.append("attachment", selectedFile);
                                        const { data } = await RestApi.post(`api/v1/admin/user-management/user/upload-profile-photo`, formData, {
                                            headers: { "Content-Type": "multipart/form-data" }
                                        })
                                        toaster('Photo uploaded successfully')
                                        getUserProfilePhoto()
                                    } catch (error) {
                                        console.log('error', error)
                                        toaster(error.response.data, 'error')
                                    } finally {
                                        dispatch(setLoading(false));
                                    }
                                }
                            }

                            useEffect(() => {
                                getUserProfilePhoto()
                            }, [])

                            const getUserProfilePhoto = async () => {

                                try {
                                    const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-profile-photo`, {
                                        responseType: "text", // Use "arraybuffer" for PDFs and "text" for Base64
                                    })
                                    if (data) {
                                        const userPhoto = `data:image/jpeg;base64,${data}`
                                        setUserUploadImage(userPhoto)
                                        dispatch(setUserImage(userPhoto))
                                    }
                                } catch (error) {
                                    console.log('error', error)
                                }
                            }

                            return (
                                <FormikForm>
                                    <Loading loading={loading} loadingText={t('submitting')} />

                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card p-[16px] bg-cover rounded-[15px] border-none" style={{ backgroundImage: `url(${profileBackground})` }} id="profile">
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                        <div className="flex items-center justify-start">
                                                            <div className="flex-none">
                                                                {/* <img src={dummyUserImage} className='w-[133px] h-[133px] border-3 border-white rounded-full' alt="Profile Photo" /> */}

                                                                {userImage && (
                                                                    <img src={userImage} alt="" className="w-[133px] h-[133px] border-3 border-white rounded-full" />
                                                                )}
                                                                {!userImage && (
                                                                    <img src={dummyUserImage} alt="" className="w-[133px] h-[133px] border-3 border-white rounded-full" />
                                                                )}

                                                                <div className="w-[50px] m-auto mt-2">
                                                                    {/* Hidden file input */}
                                                                    <input
                                                                        type="file"
                                                                        name="userImage"
                                                                        accept="image/jpeg, image/png"
                                                                        ref={fileInputRef}
                                                                        onChange={handleFileChange}
                                                                        style={{ display: 'none' }}
                                                                    />

                                                                    {/* Custom button */}
                                                                    <OverlayTrigger overlay={<Tooltip>{t('Upload Photo')}</Tooltip>}>
                                                                        <button type="button" onClick={handleButtonClick} className="btn btn-sm rounded-full bg-white border border-gray-50 hover:!bg-gray-100  absolute left-[120px] top-[110px]">
                                                                            <i className="fa fa-camera"></i>
                                                                        </button>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 my-auto max-w-[700px] mx-[16px]">
                                                                {/* <h3 className="text-[22px] xs:text-[16px]">Md. Habib Ullah Sarker</h3> */}
                                                                {/* <p className="text-[#778293] text-[16px] xs:text-[14px]">Joined on 15 Jan, 2024</p> */}
                                                                <h3 className="text-[22px] xs:text-[16px]">{currentLanguage === 'bn' ? authUser?.nameBn : authUser?.nameEn}</h3>
                                                                <p className="text-[#778293] text-[16px] xs:text-[14px]">Joined on {helpers.dDate(authUser?.createdAt, 'DD MMM, YYYY')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className='mb-3 mt-[24px] card px-[24px] border-none'>
                                        <div>

                                            {/* <div className="row">
                                                <div className="col-md-12">
                                                    <div className="w-[300px] ml-auto">
                                                        <div className='w-[250px]'>
                                                            {userUploadImage && (
                                                                <img src={URL.createObjectURL(userUploadImage)} alt="" className="w-[150px] h-[150px] rounded-full bg-white shadow-xl m-auto" />
                                                            )}
                                                            {!userUploadImage && (
                                                                <img src={dummyUserImage} alt="" className="w-[150px] h-[150px] rounded-full bg-white shadow-xl m-auto" />
                                                            )}
                                                        </div>
                                                        <div className="w-[250px] m-auto mt-2">
                                                            <input
                                                                type="file"
                                                                ref={fileInputRef}
                                                                onChange={handleFileChange}
                                                                style={{ display: 'none' }}
                                                            />

                                                            <button type="button" onClick={handleButtonClick} className="btn border border-gray-50 hover:bg-gray-100">
                                                                Click to change photo
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}

                                            <div className="row">

                                                {/* <h4 className="my-2 font-bold text-green-900">{t('nidInformation')}</h4> */}
                                                <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('nidInformation')}</h3>
                                                {/* <hr className='mb-3' /> */}

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('nationalIdentityNo')}</Form.Label>
                                                        <Field disabled={true} type="number" name="applicantNidInfo.nidNumber" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('date_of_birth')}</Form.Label>
                                                        <Field disabled={true} type="date" name="applicantNidInfo.dob" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('name')} ({t('en')})</Form.Label>
                                                        <Field disabled={true} type="text" name="applicantNidInfo.nameEn" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('name')} ({t('bn')})</Form.Label>
                                                        <Field disabled={true} type="text" name="applicantNidInfo.nameBn" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('fatherHusbandName')} ({t('bn')})</Form.Label>
                                                        <Field disabled={true} type="text" name="applicantNidInfo.fatherOrHusbandNameBn" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('motherName')} ({t('bn')})</Form.Label>
                                                        <Field disabled={true} type="text" name="applicantNidInfo.motherNameBn" className="form-control" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('fatherHusbandName')} ({t('en')}) <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="applicantNidInfo.fatherOrHusbandNameEn" className="form-control" placeholder={t('enterSomething')} />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('motherName')} ({t('en')}) <span className='text-red-500'>*</span></Form.Label>
                                                        <Field disabled={isViewable} type="text" name="applicantNidInfo.motherNameEn" className="form-control" placeholder={t('enterSomething')} />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('gender')}</Form.Label>
                                                        {dropdowns.genderList && dropdowns.genderList.map((item, index) => (
                                                            <>
                                                                <button key={item.id} disabled className='btn btn-sm btn-outline-secondary ml-2'>
                                                                    <Field disabled={isViewable} type="radio" name="applicantNidInfo.genderId" value={item.id} id={`gender-${item.id}`} className="form-check-input" />
                                                                    <span className='ml-1 mr-4'>{currentLanguage === 'bn' ? item.nameBn : item.nameEn}</span>
                                                                </button>
                                                            </>
                                                        ))}
                                                    </Form.Group>
                                                </div>

                                                <div className="col-sm-12 col-lg-6 col-xl-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{t('Mobile No')} ({t('en')})</Form.Label>
                                                        <Field disabled={true} type="text" name="applicantNidInfo.mobile" className="form-control" placeholder={t('enterSomething')} />
                                                    </Form.Group>
                                                </div>

                                            </div>





                                        </div>
                                    </div>


                                    <div className="row mt-[24px]">
                                        <div className="col-md-12">
                                            <div className="card px-[24px] border-none">
                                                <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('Driving License Information')}</h3>
                                                <div className="row">

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="dlLanguageId">
                                                            <Form.Label>{t('Driving License Language')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="dlLanguageId"
                                                                component={ReactSelect}
                                                                options={dropdowns.languageList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.dlLanguageId}
                                                                onChange={(option) => {
                                                                    setFieldValue('dlLanguageId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="nationalityId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="applicationTypeId">
                                                            <Form.Label>{t('Application Type')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={true}
                                                                name="applicationTypeId"
                                                                component={ReactSelect}
                                                                options={dropdowns.drivingLicenseApplicationTypeList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.applicationTypeId}
                                                                onChange={(option) => {
                                                                    setFieldValue('applicationTypeId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="applicationTypeId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="applicantTypeId">
                                                            <Form.Label>{t('Applicant Type')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="applicantTypeId"
                                                                component={ReactSelect}
                                                                options={dropdowns.applicantTypeList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.applicantTypeId}
                                                                onChange={(option) => {
                                                                    setFieldValue('applicantTypeId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="applicantTypeId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="licenseTypeId">
                                                            <Form.Label>{t('Driving License Type')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="licenseTypeId"
                                                                component={ReactSelect}
                                                                options={dropdowns.drivingLicenseTypeList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.licenseTypeId}
                                                                onChange={(option) => {
                                                                    setFieldValue('licenseTypeId', option ? option.value : '')
                                                                    setFieldValue('dlVehicleClassIds', [])
                                                                }}
                                                            />
                                                            <ErrorMessage name="licenseTypeId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    {values.licenseTypeId && (
                                                        <div className="col-sm-12 col-lg-12 col-xl-12">
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>{t('Vehicle Class')} <span className='text-red-500'>*</span></Form.Label>

                                                                {drivingLicenseClassList && drivingLicenseClassList.map((item, index) => (
                                                                    <label key={item.id} className='btn btn-sm btn-outline-default ml-2'>
                                                                        <Field
                                                                            disabled={isViewable}
                                                                            type="checkbox"
                                                                            id={`vehicle-class-${item.id}`}
                                                                            name="dlVehicleClassIds"
                                                                            value={item.id}
                                                                            checked={values.dlVehicleClassIds.length && values.dlVehicleClassIds.includes(item.id)}
                                                                            onChange={() => {
                                                                                const currentIndex = values.dlVehicleClassIds.indexOf(item.id);
                                                                                const newClassIds = [...values.dlVehicleClassIds];

                                                                                if (currentIndex === -1) {
                                                                                    // Checkbox is checked, add id
                                                                                    newClassIds.push(item.id);
                                                                                } else {
                                                                                    // Checkbox is unchecked, remove id
                                                                                    newClassIds.splice(currentIndex, 1);
                                                                                }

                                                                                setFieldValue("dlVehicleClassIds", newClassIds);
                                                                            }}
                                                                            className="form-check-input" />
                                                                        <span className='ml-1 mr-4 text-[14px]'>{currentLanguage === 'bn' ? item.nameBn : item.nameEn}</span>
                                                                    </label>
                                                                ))}
                                                                <ErrorMessage name="dlVehicleClassIds" component="div" className="text-danger" />
                                                            </Form.Group>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row mt-[24px]">
                                        <div className="col-md-12">
                                            <div className="card px-[24px] border-none">
                                                <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('Applicant Basic Information')}</h3>
                                                <div className="row">

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="eduQualificationId">
                                                            <Form.Label>{t('Educational Qualification')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="eduQualificationId"
                                                                component={ReactSelect}
                                                                options={dropdowns.educationalQualificationList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.eduQualificationId}
                                                                onChange={(option) => {
                                                                    setFieldValue('eduQualificationId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="eduQualificationId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="occupationId">
                                                            <Form.Label>{t('Occupation')} <span className='text-red-500'>*</span></Form.Label>

                                                            <Field
                                                                name="occupationId"
                                                                component={ReactSelect}
                                                                options={dropdowns.occupationList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.occupationId}
                                                                onChange={(option) => {
                                                                    setFieldValue('occupationId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="occupationId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="nationalityId">
                                                            <Form.Label>{t('Nationality')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="nationalityId"
                                                                component={ReactSelect}
                                                                options={dropdowns.countryList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.nationalityId}
                                                                onChange={(option) => {
                                                                    setFieldValue('nationalityId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="nationalityId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="bloodGroupId">
                                                            <Form.Label>{t('bloodGroup')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="bloodGroupId"
                                                                component={ReactSelect}
                                                                options={dropdowns.bloodList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.bloodGroupId}
                                                                onChange={(option) => {
                                                                    setFieldValue('bloodGroupId', option ? option.value : '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="bloodGroupId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="maritalStatusId">
                                                            <Form.Label>{t('Marital Status')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="maritalStatusId"
                                                                component={ReactSelect}
                                                                options={dropdowns.maritalStatusList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.maritalStatusId}
                                                                onChange={(option) => {
                                                                    setFieldValue('maritalStatusId', option ? option.value : '')
                                                                    setFieldValue('spouseName', '')
                                                                    setFieldValue('spouseContactNo', '')
                                                                }}
                                                            />
                                                            <ErrorMessage name="maritalStatusId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    {showSpouseSection && (
                                                        <>
                                                            <div className="col-sm-12 col-lg-6 col-xl-6">
                                                                <Form.Group className="mb-3" controlId="spouseName">
                                                                    <Form.Label>{t('Spouse Name')} ({t('en')})</Form.Label>
                                                                    <Field disabled={isViewable} type="text" name="spouseName" className="form-control" placeholder={t('enterSomething')} />
                                                                    <ErrorMessage name="spouseName" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12 col-lg-6 col-xl-6">
                                                                <Form.Group className="mb-3" controlId="spouseContactNo">
                                                                    <Form.Label>{t('Spouse Contact')} ({t('en')})</Form.Label>
                                                                    <Field disabled={isViewable} type="text" name="spouseContactNo" className="form-control" placeholder={t('enterSomething')} />
                                                                    <ErrorMessage name="spouseContactNo" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>
                                                        </>
                                                    )}

                                                    <div className="col-sm-12 col-lg-12 col-xl-12">
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>{t('Other Citizenship')} <span className='text-red-500'>*</span></Form.Label>
                                                            {yesNoList && yesNoList.map((item, index) => (
                                                                <label key={item.id} className='btn btn-sm btn-outline-default ml-2'>
                                                                    <Field
                                                                        disabled={isViewable}
                                                                        type="radio"
                                                                        id={`isOtherCitizenship-${item.id}`}
                                                                        name="isOtherCitizenship"
                                                                        value={item.value} // Convert to "true" or "false" as string
                                                                        checked={values.isOtherCitizenship === item.value} // Check if boolean matches
                                                                        onChange={() => setFieldValue("isOtherCitizenship", item.value)}
                                                                        className="form-check-input"
                                                                    />
                                                                    <span className='ml-1 mr-4 text-[14px]'>{currentLanguage === 'bn' ? item.nameBn : item.nameEn}</span>
                                                                </label>
                                                            ))}
                                                            <ErrorMessage name="isOtherCitizenship" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row mt-[24px] mb-6">
                                        <div className="col-md-12 text-right">
                                            {!isSubmittedApplication && (
                                                <>
                                                    <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/driving-license/new-driving-license/application-pre-requisites`)}>{t('previous')}</button>
                                                    <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs'>{t('saveAndNext')}</button>
                                                    <button type='reset' onClick={() => handleReset(resetForm)} className='btn btn-outline-black btn-rounded btn-xs ml-2'>{t('reset')}</button>
                                                </>
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

export default (DrivingLicenseApplicationPage1);