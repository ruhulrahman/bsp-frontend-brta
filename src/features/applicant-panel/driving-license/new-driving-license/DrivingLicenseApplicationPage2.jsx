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
import { useParams, useNavigate } from 'react-router-dom';
import helpers, { toaster } from '@/utils/helpers.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import FileViewer from '@/components/common/FileViewer';

const DrivingLicenseApplicationPage2 = () => {
    const { t } = useTranslation();

    let { serviceRequestNo, isViewable } = useParams()
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        serviceRequestNo: '',
        dlInfoId: '',
        orgId: '',
        examVenueId: '',
        presentAddress: {
            locationId: '',
            divisionId: '',
            districtId: '',
            thanaId: '',
            postCode: '',
            holdingHouseVillage: '',
            roadBlockSectorColony: '',
            mobileNumber: '',
        },
        permanentAddress: {
            locationId: '',
            divisionId: '',
            districtId: '',
            thanaId: '',
            postCode: '',
            holdingHouseVillage: '',
            roadBlockSectorColony: '',
            mobileNumber: '',
        },
        cardDeliveryAddress: {
            locationId: '',
            divisionId: '',
            districtId: '',
            thanaId: '',
            postCode: '',
            holdingHouseVillage: '',
            roadBlockSectorColony: '',
            mobileNumber: '',
        },
        // dlInformation Start ======
        officePhoneNumber: '',
        residencePhoneNumber: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        emergencyContactRelationshipId: '',
        emergencyContactEmail: '',
        presentAddressId: '',
        permanentAddressId: '',
        // dlInformation End ======
        stageCompleted: 2,
    })

    const resetValues = {
        serviceRequestNo: '',
        dlInfoId: '',
        orgId: '',
        examVenueId: '',
        presentAddress: {
            locationId: '',
            divisionId: '',
            districtId: '',
            thanaId: '',
            postCode: '',
            holdingHouseVillage: '',
            roadBlockSectorColony: '',
            mobileNumber: '',
        },
        permanentAddress: {
            locationId: '',
            divisionId: '',
            districtId: '',
            thanaId: '',
            postCode: '',
            holdingHouseVillage: '',
            roadBlockSectorColony: '',
            mobileNumber: '',
        },
        cardDeliveryAddress: {
            locationId: '',
            divisionId: '',
            districtId: '',
            thanaId: '',
            postCode: '',
            holdingHouseVillage: '',
            roadBlockSectorColony: '',
            mobileNumber: '',
        },
        // dlInformation Start ======
        officePhoneNumber: '',
        residencePhoneNumber: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        emergencyContactRelationshipId: '',
        emergencyContactEmail: '',
        presentAddressId: '',
        permanentAddressId: '',
        // dlInformation End ======
        stageCompleted: 2,
    }

    const validationSchema = Yup.object().shape({
        // vehicleTypeId: Yup.string().required('The Field is required'),
    });

    const handleReset = (resetForm) => {
        resetForm({
            values: resetValues, // Reset to initial values
        });
    };

    useEffect(() => {
        getUserNidInfo();
        setInitialValues(resetValues);
        getDLServiceRequestByAuthUser();
        getDlServiceMediasByServiceRequestNo();
    }, []);

    const getUserNidInfo = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-nid-info`)
            // setInitialValues(data);
            setInitialValues({ ...initialValues, applicantNidInfo: data });
        } catch (error) {
            console.log('error', error)
        }
    }

    const [districtListPermanent, setDistrictListPermanent] = useState([]);
    const [thanaListPermanent, setThanaListPermanent] = useState([]);

    const [districtListPresent, setDistrictListPresent] = useState([]);
    const [thanaListPresent, setThanaListPresent] = useState([]);

    const [districtListCardDelivery, setDistrictListCardDelivery] = useState([]);
    const [thanaListCardDelivery, setThanaListCardDelivery] = useState([]);


    const getLocationListByParentId = async (parentId, addressType = 'permanent', locationType = 'district') => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/common/get-locations-by-parent-location-id/${parentId}`)
            if (addressType == 'permanent') {
                if (locationType == 'district') {
                    setDistrictListPermanent(data.locationList);
                } else if (locationType == 'thana') {
                    setThanaListPermanent(data.locationList);
                }
            } else if (addressType == 'present') {
                if (locationType == 'district') {
                    setDistrictListPresent(data.locationList);
                } else if (locationType == 'thana') {
                    setThanaListPresent(data.locationList);
                }
            } else if (addressType == 'cardDelivery') {
                if (locationType == 'district') {
                    setDistrictListCardDelivery(data.locationList);
                } else if (locationType == 'thana') {
                    setThanaListCardDelivery(data.locationList);
                }
            }
            // setDistrictList(data.locationList);
        } catch (error) {
            console.log('error', error)
        }
    }



    const getDLServiceRequestByAuthUser = async () => {
        dispatch(setLoading(true));
        try {
            // const { data } = await RestApi.get(`api/v1/applicant/vehicle/${id}`)
            const { data } = await RestApi.get(`api/driving-license/v1/get-application-details-by-user`)

            if (data.isServiceRequest) {
                toaster('Another new driving license application found against this user !', 'error')
                isViewable = false
            } else {
                const apiResponse = {
                    ...data.dlServiceRequestResponse,
                    officePhoneNumber: data.dlServiceRequestResponse.dlInformation?.officePhoneNumber,
                    residencePhoneNumber: data.dlServiceRequestResponse.dlInformation?.residencePhoneNumber,
                    emergencyContactName: data.dlServiceRequestResponse.dlInformation?.emergencyContactName,
                    emergencyContactNumber: data.dlServiceRequestResponse.dlInformation?.emergencyContactNumber,
                    emergencyContactRelationshipId: data.dlServiceRequestResponse.dlInformation?.emergencyContactRelationshipId,
                    emergencyContactEmail: data.dlServiceRequestResponse.dlInformation?.emergencyContactEmail,
                    cdOptionId: data.dlServiceRequestResponse.dlInformation?.cdOptionId,
                };
                if (!data.dlServiceRequestResponse.permanentAddress) {
                    apiResponse.presentAddress = resetValues.presentAddress
                }
                if (!data.dlServiceRequestResponse.permanentAddress) {
                    apiResponse.permanentAddress = resetValues.permanentAddress
                }
                if (!data.dlServiceRequestResponse.cardDeliveryAddress) {
                    apiResponse.cardDeliveryAddress = resetValues.cardDeliveryAddress
                }

                if (apiResponse && apiResponse.pageCompleted < 1) {
                    navigate(`/applicant-panel/driving-license/new-driving-license/application-pre-requisites`)
                }
                setInitialValues(apiResponse);
            }

        } catch (error) {
            console.log('error', error)
            // navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
        } finally {
            dispatch(setLoading(false));
        }
    }


    const onSubmit = async (values, setSubmitting, resetForm) => {

        try {
            let { data } = await RestApi.post('api/driving-license/v1/application-page2', values)

            if (data.success) {
                if (!selectedMedicleFile.mediaId) {
                    toaster('Please upload Medical File', 'error')
                    return;
                }
                if (!selectedEducationFile.mediaId) {
                    toaster('Please upload Education File', 'error')
                    return;
                }
                if (!selectedNationalIdFile.mediaId) {
                    toaster('Please upload National Id File', 'error')
                    return;
                }
                toaster(data.message)
                // navigate(`/applicant-panel/driving-license/new-driving-license/payment-for-learner/${data.data.serviceRequestNo}`)
                navigate(`/applicant-panel/driving-license/new-driving-license/payment-for-learner/${data.data.serviceRequestId}/${data.data.serviceRequestNo}`)
            }

        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setSubmitting(false)
        }
    };

    const [selectedFiles, setSelectedFiles] = useState([
        {
            mediaId: null,
            documentTypeId: 8,
            documentType: 'Medical Certificate',
            attachmentFile: null,
            fileName: '',
            fileUrl: null,
        },
        {
            mediaId: null,
            documentTypeId: 10,
            documentType: 'National ID',
            attachmentFile: null,
            fileName: '',
            fileUrl: null,
        },
        {
            mediaId: null,
            documentTypeId: 11,
            documentType: 'Utility Bill(Gas/Electricity/Wasa)',
            attachmentFile: null,
            fileName: '',
            fileUrl: null,
        },
    ]);

    // const handleFileChange = (e, documentTypeId) => {
    //     setSelectedFiles((prevFiles) =>
    //         prevFiles.map((file, i) =>
    //             i === documentTypeId
    //                 ? { ...file, attachmentFile: e.target.files[0], fileName: e.target.files[0].name, fileUrl: URL.createObjectURL(e.target.files[0]) }
    //                 : file
    //         )
    //     )
    // }

    const medicleFileResetValues = {
        mediaId: null,
        documentTypeId: 25,
        documentType: 'Medical Certificate',
        attachmentFile: null,
        fileName: '',
        fileUrl: null,
    }

    const educationFileResetValues = {
        mediaId: null,
        documentTypeId: 26,
        documentType: 'Educational Certificate',
        attachmentFile: null,
        fileName: '',
        fileUrl: null,
    }

    const nationalIdFileResetValues = {
        mediaId: null,
        documentTypeId: 27,
        documentType: 'National ID',
        attachmentFile: null,
        fileName: '',
        fileUrl: null,
    }

    const utilityBillFileResetValues = {
        mediaId: null,
        documentTypeId: 28,
        documentType: 'Utility Bill(Gas/Electricity/Wasa)',
        attachmentFile: null,
        fileName: '',
        fileUrl: null,
    }

    const [selectedMedicleFile, setSelectedMedicleFile] = useState(medicleFileResetValues)
    const [selectedEducationFile, setSelectedEducationFile] = useState(educationFileResetValues)
    const [selectedNationalIdFile, setSelectedNationalIdFile] = useState(nationalIdFileResetValues)
    const [selectedUtilityBillFile, setSelectedUtilityBillFile] = useState(utilityBillFileResetValues)

    const getDlServiceMediasByServiceRequestNo = async () => {

        dispatch(setLoading(true));

        setSelectedMedicleFile(medicleFileResetValues)
        setSelectedEducationFile(educationFileResetValues)
        setSelectedNationalIdFile(nationalIdFileResetValues)
        setSelectedUtilityBillFile(utilityBillFileResetValues)

        try {
            const { data } = await RestApi.get(`api/driving-license/v1/get-dl-service-medias-by-service-request-no/${serviceRequestNo}`)

            console.log('data', data)
            if (data && data.length > 0) {
                data.filter(item => item.documentTypeId === 25).length > 0 ? setSelectedMedicleFile({ ...selectedMedicleFile, ...data.filter(item => item.documentTypeId === 25)[0] }) : null;
                data.filter(item => item.documentTypeId === 26).length > 0 ? setSelectedEducationFile({ ...selectedEducationFile, ...data.filter(item => item.documentTypeId === 26)[0] }) : null;
                data.filter(item => item.documentTypeId === 27).length > 0 ? setSelectedNationalIdFile({ ...selectedNationalIdFile, ...data.filter(item => item.documentTypeId === 27)[0] }) : null;
                data.filter(item => item.documentTypeId === 28).length > 0 ? setSelectedUtilityBillFile({ ...selectedUtilityBillFile, ...data.filter(item => item.documentTypeId === 28)[0] }) : null;
            }

        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleFileChange = (e, documentTypeId) => {
        const selectedFile = e.target.files[0];

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        console.log('selectedFile', selectedFile)
        if (!allowedTypes.includes(selectedFile.type)) {
            // setError("Invalid file type. Only JPEG, PNG, and PDF files are allowed.");
            toaster("Invalid file type. Only JPEG, PNG, and PDF files are allowed.", 'error');
            return;
        }

        // Validate file size (e.g., 600 KB limit)
        const maxSizeInBytes = 600 * 1024; // 600 KB
        if (selectedFile.size > maxSizeInBytes) {
            // setError("File size exceeds 600 KB.");
            toaster("Invalid file size. File size should be less than 600 KB.", 'error');
            return;
        }

        const selectedFileUrl = URL.createObjectURL(e.target.files[0]);

        if (documentTypeId === 25) {
            setSelectedMedicleFile({
                ...selectedMedicleFile,
                attachmentFile: selectedFile,
                fileName: selectedFile.name,
                fileUrl: selectedFileUrl
            })
        } else if (documentTypeId === 26) {
            setSelectedEducationFile({
                ...selectedEducationFile,
                attachmentFile: selectedFile,
                fileName: selectedFile.name,
                fileUrl: selectedFileUrl,
            })
        } else if (documentTypeId === 27) {
            setSelectedNationalIdFile({
                ...selectedNationalIdFile,
                attachmentFile: selectedFile,
                fileName: selectedFile.name,
                fileUrl: selectedFileUrl,
            })
        } else if (documentTypeId === 28) {
            setSelectedUtilityBillFile({
                ...selectedUtilityBillFile,
                attachmentFile: selectedFile,
                fileName: selectedFile.name,
                fileUrl: selectedFileUrl,
            })
        }
    }

    const handleFileUpload = async (documentTypeId) => {

        const formData = new FormData();
        formData.append("serviceRequestNo", serviceRequestNo);

        if (documentTypeId === 25) {
            if (!selectedMedicleFile.attachmentFile) {
                toaster("Please select a file!", 'error');
                return;
            }
            formData.append("mediaId", selectedMedicleFile.mediaId);
            formData.append("documentTypeId", selectedMedicleFile.documentTypeId);
            formData.append("attachment", selectedMedicleFile.attachmentFile);
        } else if (documentTypeId === 26) {
            if (!selectedEducationFile.attachmentFile) {
                toaster("Please select a file!", 'error');
                return;
            }
            formData.append("mediaId", selectedEducationFile.mediaId);
            formData.append("documentTypeId", selectedEducationFile.documentTypeId);
            formData.append("attachment", selectedEducationFile.attachmentFile);
        } else if (documentTypeId === 27) {
            if (!selectedNationalIdFile.attachmentFile) {
                toaster("Please select a file!", 'error');
                return;
            }
            formData.append("mediaId", selectedNationalIdFile.mediaId);
            formData.append("documentTypeId", selectedNationalIdFile.documentTypeId);
            formData.append("attachment", selectedNationalIdFile.attachmentFile);
        } else if (documentTypeId === 28) {
            if (!selectedUtilityBillFile.attachmentFile) {
                toaster("Please select a file!", 'error');
                return;
            }
            formData.append("mediaId", selectedUtilityBillFile.mediaId);
            formData.append("documentTypeId", selectedUtilityBillFile.documentTypeId);
            formData.append("attachment", selectedUtilityBillFile.attachmentFile);
        }

        try {
            const { data } = await RestApi.post(`api/driving-license/v1/learner-document-upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            setSelectedMedicleFile({ ...selectedMedicleFile, attachmentFile: null })
            setSelectedEducationFile({ ...selectedEducationFile, attachmentFile: null })
            setSelectedNationalIdFile({ ...selectedNationalIdFile, attachmentFile: null })
            setSelectedUtilityBillFile({ ...selectedUtilityBillFile, attachmentFile: null })

            getDlServiceMediasByServiceRequestNo()
            console.log('data', data)
            toaster(data.message)
        } catch (error) {
            console.log('error', error)
            toaster(error.response.data, 'error')
        }
    }

    const [openFileViewer, setOpenFileViewer] = useState(false);
    const [fileViewerData, setFileViewerData] = useState({
        fileUrl: '',
        fileName: ''
    });

    const handleCloseModal = () => {
        setOpenFileViewer(false);
    };

    const handleViewSelectedFile = async (selectedFile, fileName) => {
        setFileViewerData({ fileUrl: selectedFile, fileName: fileName });
        setOpenFileViewer(true);
    }

    const getFileViewByFileName = async (fileName) => {
        try {
            const isPdf = fileName.toLowerCase().endsWith(".pdf");

            const response = await RestApi.get(`api/files/get-file-by-name/${fileName}`, {
                responseType: isPdf ? "arraybuffer" : "text", // Use "arraybuffer" for PDFs and "text" for Base64
            })

            // console.log('response.data', response.data)

            if (fileName.endsWith(".pdf")) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                // window.open(url, "_blank"); // Open the PDF in a new tab
                setFileViewerData({ fileUrl: url, fileName: fileName });
                setOpenFileViewer(true);
            } else {
                const base64String = await response.data; // Base64 is returned as plain text
                // const image = new Image();
                // image.src = `data:image/jpeg;base64,${base64String}`;
                setFileViewerData({ fileUrl: `data:image/jpeg;base64,${base64String}`, fileName: fileName });
                setOpenFileViewer(true);
            }
        } catch (error) {
            console.error("Error fetching PDF:", error);
        }
    }

    const handleFileDownload = async (fileName) => {
        try {
            const response = await RestApi.get(`api/files/download/${fileName}`, {
                responseType: "blob", // Important for downloading files
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    }



    const medicalFileRef = useRef(null);
    const educationFileRef = useRef(null);
    const nidFileRef = useRef(null);
    const utilityBillFileRef = useRef(null);

    const deleteFile = async (mediaId) => {
        try {
            await RestApi.delete(`api/files/delete-dl-service-document/${mediaId}`);
            toaster("File deleted successfully")

            // Clear the input field
            if (medicalFileRef.current) {
                medicalFileRef.current.value = "";
            }
            if (educationFileRef.current) {
                educationFileRef.current.value = "";
            }
            if (nidFileRef.current) {
                nidFileRef.current.value = "";
            }
            if (utilityBillFileRef.current) {
                utilityBillFileRef.current.value = "";
            }
            getDlServiceMediasByServiceRequestNo()
        } catch (error) {
            console.error("Error deleting file:", error);
            toaster(error.response.data.message)
        }
    }

    return (
        <div>
            <FileViewer
                show={openFileViewer}
                onHide={handleCloseModal}
                data={fileViewerData}
            />
            <div className="container-fluid mx-auto max-w-screen-4xl px-4 lg:px-8 xl:px-16">
                <CardHeader>
                    {/* <CardTitle className='mb-2'>{id ? t('edit') : t('add_new')} {t('user')}</CardTitle> */}
                    <CardTitle className='mb-2'>{t('newDrivingLicenseApplication')} - {t('page')} - {currentLanguage === 'en' ? 2 : toBengaliNumber(2)}</CardTitle>
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

                            const setCartDeliveryAddressByAddressType = (addressTypeId) => {
                                const addressType = dropdowns.addressTypeList.find(addressType => addressType.id === addressTypeId);

                                if (addressType) {

                                    // Define a helper function to update individual fields within cardDeliveryAddress
                                    const setAddressFields = (sourceAddress) => {
                                        if (sourceAddress) {
                                            setFieldValue('cardDeliveryAddress.holdingHouseVillage', sourceAddress.holdingHouseVillage || '');
                                            setFieldValue('cardDeliveryAddress.roadBlockSectorColony', sourceAddress.roadBlockSectorColony || '');
                                            setFieldValue('cardDeliveryAddress.divisionId', sourceAddress.divisionId || '');
                                            setFieldValue('cardDeliveryAddress.districtId', sourceAddress.districtId || '');
                                            setFieldValue('cardDeliveryAddress.locationId', sourceAddress.locationId || '');
                                            setFieldValue('cardDeliveryAddress.postCode', sourceAddress.postCode || '');
                                        }
                                    };

                                    switch (addressType.statusCode) {
                                        case "present_address":
                                            setAddressFields(values.presentAddress);
                                            break;

                                        case "permanent_address":
                                            setAddressFields(values.permanentAddress);
                                            break;

                                        case "other_address":
                                            setAddressFields(resetValues.cardDeliveryAddress);
                                            break;

                                        default:
                                            break;
                                    }
                                }
                            }

                            useEffect(() => {
                                if (values.permanentAddress.divisionId) {
                                    getLocationListByParentId(values.permanentAddress.divisionId, 'permanent', 'district');
                                }
                            }, [values.permanentAddress.divisionId]);

                            useEffect(() => {
                                if (values.permanentAddress.districtId) {
                                    getLocationListByParentId(values.permanentAddress.districtId, 'permanent', 'thana');
                                }
                            }, [values.permanentAddress.districtId]);

                            useEffect(() => {
                                if (values.presentAddress.divisionId) {
                                    getLocationListByParentId(values.presentAddress.divisionId, 'present', 'district');
                                }
                            }, [values.presentAddress.divisionId]);

                            useEffect(() => {
                                if (values.presentAddress.districtId) {
                                    getLocationListByParentId(values.presentAddress.districtId, 'present', 'thana');
                                }
                            }, [values.presentAddress.districtId]);


                            const [organization, setOrganization] = useState({
                                id: '',
                                nameEn: '',
                                nameBn: '',
                            });

                            const [examVenue, setExamVenue] = useState({
                                id: '',
                                nameEn: '',
                                nameBn: '',
                            });

                            const getOrgnationNameByThanaId = async (thanaId, setFieldValue) => {

                                try {
                                    const { data } = await RestApi.get(`api/v1/admin/common/get-organization-and-exam-vanue-by-thana-id/${thanaId}`)

                                    // Update only specific fields without modifying `initialValues`
                                    setInitialValues({ ...values, orgId: '', examVenueId: '' });
                                    if (data.organization) {
                                        setOrganization(data.organization);
                                        setFieldValue('orgId', data.organization.id);
                                        setInitialValues({ ...values, orgId: data.organization.id });
                                    } else {
                                        setOrganization({
                                            id: '',
                                            nameEn: '',
                                            nameBn: '',
                                        });
                                        setFieldValue('orgId', "");
                                    }

                                    if (data.venue) {
                                        setExamVenue(data.venue);
                                        setFieldValue('examVenueId', data.venue.id);
                                        setInitialValues({ ...values, examVenueId: data.venue.id });
                                    } else {
                                        setExamVenue({
                                            id: '',
                                            nameEn: '',
                                            nameBn: '',
                                        });
                                        setFieldValue('examVenueId', "");
                                    }
                                } catch (error) {
                                    console.log('error', error)
                                }
                            }

                            useEffect(() => {
                                if (values.presentAddress.locationId) {
                                    getOrgnationNameByThanaId(values.presentAddress.locationId, setFieldValue);
                                }
                            }, [values.presentAddress.locationId]);

                            useEffect(() => {
                                if (values.cardDeliveryAddress.divisionId) {
                                    getLocationListByParentId(values.cardDeliveryAddress.divisionId, 'cardDelivery', 'district');
                                }
                            }, [values.cardDeliveryAddress.divisionId]);

                            useEffect(() => {
                                if (values.cardDeliveryAddress.districtId) {
                                    getLocationListByParentId(values.cardDeliveryAddress.districtId, 'cardDelivery', 'thana');
                                }
                            }, [values.cardDeliveryAddress.districtId]);

                            return (
                                <FormikForm>
                                    <Loading loading={loading} loadingText={t('submitting')} />

                                    <div className="row mt-[24px]">
                                        <div className="col-md-6">
                                            <div className="card px-[24px] border-none">
                                                <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('permanentAddress')}</h3>

                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="row">

                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>{t('holdingNoVillageHouse')}</Form.Label>
                                                                    <Field disabled={isViewable} type="text" name="permanentAddress.holdingHouseVillage" className="form-control" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>{t('roadBlockSectorColony')}</Form.Label>
                                                                    <Field disabled={isViewable} type="text" name="permanentAddress.roadBlockSectorColony" className="form-control" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3" controlId="permanentAddress.divisionId">
                                                                    <Form.Label>{t('division')} <span className='text-red-500'>*</span></Form.Label>
                                                                    <Field
                                                                        disabled={isViewable}
                                                                        name="permanentAddress.divisionId"
                                                                        component={ReactSelect}
                                                                        options={dropdowns.divisionList}
                                                                        placeholder={t('pleaseSelectOne')}
                                                                        value={values.permanentAddress?.divisionId}
                                                                        onChange={(option) => {
                                                                            const selectedValue = option ? option.value : '';
                                                                            setFieldValue('permanentAddress.divisionId', selectedValue);
                                                                            if (!selectedValue) {
                                                                                setDistrictListPermanent([])
                                                                            }
                                                                        }}
                                                                    />
                                                                    <ErrorMessage name="permanentAddress.divisionId" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3" controlId="permanentAddress.districtId">
                                                                    <Form.Label>{t('district')} <span className='text-red-500'>*</span></Form.Label>
                                                                    <Field
                                                                        disabled={isViewable}
                                                                        name="permanentAddress.districtId"
                                                                        component={ReactSelect}
                                                                        options={districtListPermanent}
                                                                        placeholder={t('pleaseSelectOne')}
                                                                        value={values.permanentAddress?.districtId}
                                                                        onChange={(option) => {
                                                                            const selectedValue = option ? option.value : '';
                                                                            setFieldValue('permanentAddress.districtId', selectedValue);
                                                                            if (!selectedValue) {
                                                                                setThanaListPermanent([])
                                                                            }
                                                                        }}
                                                                    />
                                                                    <ErrorMessage name="permanentAddress.districtId" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3" controlId="permanentAddress.locationId">
                                                                    <Form.Label>{t('thana')} <span className='text-red-500'>*</span></Form.Label>
                                                                    <Field
                                                                        disabled={isViewable}
                                                                        name="permanentAddress.locationId"
                                                                        component={ReactSelect}
                                                                        options={thanaListPermanent}
                                                                        placeholder={t('pleaseSelectOne')}
                                                                        value={values.permanentAddress?.locationId}
                                                                        onChange={(option) => {
                                                                            setFieldValue('permanentAddress.locationId', option ? option.value : '')
                                                                        }}
                                                                    />
                                                                    <ErrorMessage name="permanentAddress.locationId" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>{t('postCode')}</Form.Label>
                                                                    <Field disabled={isViewable} type="text" name="permanentAddress.postCode" className="form-control" />
                                                                </Form.Group>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="card px-[24px] border-none">
                                                <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('presentAddress')}</h3>

                                                <div className="row">

                                                    <div className="col-sm-12">
                                                        <div className="row">
                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>{t('holdingNoVillageHouse')}</Form.Label>
                                                                    <Field disabled={isViewable} type="text" name="presentAddress.holdingHouseVillage" className="form-control" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>{t('roadBlockSectorColony')}</Form.Label>
                                                                    <Field disabled={isViewable} type="text" name="presentAddress.roadBlockSectorColony" className="form-control" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3" controlId="presentAddress.divisionId">
                                                                    <Form.Label>{t('division')} <span className='text-red-500'>*</span></Form.Label>
                                                                    <Field
                                                                        disabled={isViewable}
                                                                        name="presentAddress.divisionId"
                                                                        component={ReactSelect}
                                                                        options={dropdowns.divisionList}
                                                                        placeholder={t('pleaseSelectOne')}
                                                                        value={values.presentAddress?.divisionId}
                                                                        onChange={(option) => {
                                                                            const selectedValue = option ? option.value : '';
                                                                            setFieldValue('presentAddress.divisionId', selectedValue);
                                                                            if (!selectedValue) {
                                                                                setDistrictListPresent([])
                                                                            }
                                                                        }}
                                                                    />
                                                                    <ErrorMessage name="presentAddress.divisionId" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3" controlId="presentAddress.districtId">
                                                                    <Form.Label>{t('district')} <span className='text-red-500'>*</span></Form.Label>
                                                                    <Field
                                                                        disabled={isViewable}
                                                                        name="presentAddress.districtId"
                                                                        component={ReactSelect}
                                                                        options={districtListPresent}
                                                                        placeholder={t('pleaseSelectOne')}
                                                                        value={values.presentAddress?.districtId}
                                                                        onChange={(option) => {
                                                                            const selectedValue = option ? option.value : '';
                                                                            setFieldValue('presentAddress.districtId', selectedValue);
                                                                            if (!selectedValue) {
                                                                                setThanaListPresent([])
                                                                            }
                                                                        }}
                                                                    />
                                                                    <ErrorMessage name="presentAddress.districtId" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3" controlId="presentAddress.locationId">
                                                                    <Form.Label>{t('thana')} <span className='text-red-500'>*</span></Form.Label>
                                                                    <Field
                                                                        disabled={isViewable}
                                                                        name="presentAddress.locationId"
                                                                        component={ReactSelect}
                                                                        options={thanaListPresent}
                                                                        placeholder={t('pleaseSelectOne')}
                                                                        value={values.presentAddress?.locationId}
                                                                        onChange={(option) => {
                                                                            const selectedValue = option ? option.value : '';
                                                                            setFieldValue('presentAddress.locationId', selectedValue);
                                                                            // getOrgnationNameByThanaId(selectedValue, setFieldValue);
                                                                        }}
                                                                    />
                                                                    <ErrorMessage name="presentAddress.locationId" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12">
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>{t('postCode')}</Form.Label>
                                                                    <Field disabled={isViewable} type="text" name="presentAddress.postCode" className="form-control" />
                                                                </Form.Group>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row my-[24px]">
                                        <div className="col-md-12">
                                            <div className="card px-[24px] border-none py-[24px]">
                                                <div className="row">
                                                    <p className='text-gray-500 mb-[24px]'>This section will populate automatically according to your present address</p>
                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="">
                                                            <Form.Label className='font-bold'>{t('Concerned BRTA Office : ')} {organization?.nameBn}</Form.Label>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="">
                                                            <Form.Label className='font-bold'>{t('Exam Venue : ')} {examVenue?.nameBn}</Form.Label>
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    <div className="row mt-[24px]">
                                        <div className="col-md-12">
                                            <div className="card px-[24px] border-none">
                                                <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('Applicant Contact Information')}</h3>

                                                <div className="row">

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>{t('Phone Number (Office)')}</Form.Label>
                                                            <Field disabled={isViewable} type="text" name="officePhoneNumber" className="form-control" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>{t('PHone Number (Residence)')}</Form.Label>
                                                            <Field disabled={isViewable} type="text" name="residencePhoneNumber" className="form-control" />
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row mt-[24px]">
                                        <div className="col-md-12">
                                            <div className="card px-[24px] border-none">
                                                <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('Emergency Contact Person\'s Details')}</h3>


                                                <div className="row">
                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>{t('Name')}</Form.Label>
                                                            <Field disabled={isViewable} type="text" name="emergencyContactName" className="form-control" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>{t('Mobile')}</Form.Label>
                                                            <Field disabled={isViewable} type="text" name="emergencyContactNumber" className="form-control" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3" controlId="emergencyContactRelationshipId">
                                                            <Form.Label>{t('Relation')} <span className='text-red-500'>*</span></Form.Label>
                                                            <Field
                                                                disabled={isViewable}
                                                                name="emergencyContactRelationshipId"
                                                                component={ReactSelect}
                                                                options={dropdowns.relationshipList}
                                                                placeholder={t('pleaseSelectOne')}
                                                                value={values.emergencyContactRelationshipId}
                                                                onChange={(option) => {
                                                                    const selectedValue = option ? option.value : '';
                                                                    setFieldValue('emergencyContactRelationshipId', selectedValue);
                                                                }}
                                                            />
                                                            <ErrorMessage name="emergencyContactRelationshipId" component="div" className="text-danger" />
                                                        </Form.Group>
                                                    </div>

                                                    <div className="col-sm-12 col-lg-6 col-xl-6">
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>{t('Email')}</Form.Label>
                                                            <Field disabled={isViewable} type="email" name="emergencyContactEmail" className="form-control" />
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    <div className="row mt-[24px]">
                                        <div className="col-md-12">
                                            <div className="card px-[24px] border-none">
                                                <h3 className="text-xl text-green-600 pt-[24px]">{t('Smart Card Receiving Address')}</h3>
                                                <p className="text-gray-500 text-sm mb-6">({t('Card Delivery Option : ')} By Post)</p>

                                                <div className="row">

                                                    <div className="col-sm-12">
                                                        <div className="row">

                                                            <div className="col-sm-12 col-md-6 col-2xl-4">
                                                                <Form.Group className="mb-3" controlId="cardDeliveryAddress.addressTypeId">
                                                                    <Form.Label>{t('Address Type')} <span className='text-red-500'>*</span></Form.Label>
                                                                    <Field
                                                                        disabled={isViewable}
                                                                        name="cardDeliveryAddress.addressTypeId"
                                                                        component={ReactSelect}
                                                                        options={dropdowns.addressTypeList}
                                                                        placeholder={t('pleaseSelectOne')}
                                                                        value={values.cardDeliveryAddress?.addressTypeId}
                                                                        onChange={(option) => {
                                                                            const selectedValue = option ? option.value : '';
                                                                            setFieldValue('cardDeliveryAddress.addressTypeId', selectedValue);
                                                                            setCartDeliveryAddressByAddressType(selectedValue);
                                                                        }}
                                                                    />
                                                                    <ErrorMessage name="cardDeliveryAddress.addressTypeId" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12 col-md-6 col-2xl-4">
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>{t('holdingNoVillageHouse')}</Form.Label>
                                                                    <Field disabled={isViewable} type="text" name="cardDeliveryAddress.holdingHouseVillage" className="form-control" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12 col-md-6 col-2xl-4">
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>{t('roadBlockSectorColony')}</Form.Label>
                                                                    <Field disabled={isViewable} type="text" name="cardDeliveryAddress.roadBlockSectorColony" className="form-control" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12 col-md-6 col-2xl-4">
                                                                <Form.Group className="mb-3" controlId="cardDeliveryAddress.divisionId">
                                                                    <Form.Label>{t('division')} <span className='text-red-500'>*</span></Form.Label>
                                                                    <Field
                                                                        disabled={isViewable}
                                                                        name="cardDeliveryAddress.divisionId"
                                                                        component={ReactSelect}
                                                                        options={dropdowns.divisionList}
                                                                        placeholder={t('pleaseSelectOne')}
                                                                        value={values.cardDeliveryAddress?.divisionId}
                                                                        onChange={(option) => {
                                                                            const selectedValue = option ? option.value : '';
                                                                            setFieldValue('cardDeliveryAddress.divisionId', selectedValue);
                                                                            if (!selectedValue) {
                                                                                setDistrictListCardDelivery([])
                                                                            }
                                                                        }}
                                                                    />
                                                                    <ErrorMessage name="cardDeliveryAddress.divisionId" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12 col-md-6 col-2xl-4">
                                                                <Form.Group className="mb-3" controlId="cardDeliveryAddress.districtId">
                                                                    <Form.Label>{t('district')} <span className='text-red-500'>*</span></Form.Label>
                                                                    <Field
                                                                        disabled={isViewable}
                                                                        name="cardDeliveryAddress.districtId"
                                                                        component={ReactSelect}
                                                                        options={districtListCardDelivery}
                                                                        placeholder={t('pleaseSelectOne')}
                                                                        value={values.cardDeliveryAddress?.districtId}
                                                                        onChange={(option) => {
                                                                            const selectedValue = option ? option.value : '';
                                                                            setFieldValue('cardDeliveryAddress.districtId', selectedValue);
                                                                            if (!selectedValue) {
                                                                                setThanaListCardDelivery([])
                                                                            }
                                                                        }}
                                                                    />
                                                                    <ErrorMessage name="cardDeliveryAddress.districtId" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12 col-md-6 col-2xl-4">
                                                                <Form.Group className="mb-3" controlId="cardDeliveryAddress.locationId">
                                                                    <Form.Label>{t('thana')} <span className='text-red-500'>*</span></Form.Label>
                                                                    <Field
                                                                        disabled={isViewable}
                                                                        name="cardDeliveryAddress.locationId"
                                                                        component={ReactSelect}
                                                                        options={thanaListCardDelivery}
                                                                        placeholder={t('pleaseSelectOne')}
                                                                        value={values.cardDeliveryAddress?.locationId}
                                                                        onChange={(option) => {
                                                                            setFieldValue('cardDeliveryAddress.locationId', option ? option.value : '')
                                                                        }}
                                                                    />
                                                                    <ErrorMessage name="cardDeliveryAddress.locationId" component="div" className="text-danger" />
                                                                </Form.Group>
                                                            </div>

                                                            <div className="col-sm-12 col-md-6 col-2xl-4">
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>{t('postCode')}</Form.Label>
                                                                    <Field disabled={isViewable} type="text" name="cardDeliveryAddress.postCode" className="form-control" />
                                                                </Form.Group>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row mt-[24px]">
                                        <div className="col-md-12">
                                            <div className="card px-[24px] border-none">
                                                <h3 className="text-xl text-green-600 pt-[24px]">{t('Add Required Attachments')}</h3>
                                                <p className="text-gray-500 text-sm mb-6">({t('File Size Maximum 600KB')})</p>

                                                <div className="row">

                                                    <div className="col-sm-12">
                                                        <div className="row">

                                                            <div className="col-sm-12">
                                                                <div className="row">
                                                                    <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                                        <div className="col-sm-6 col-md-4 col-form-label text-right font-semibold">
                                                                            <Form.Label>Medical Certificate <span className='text-danger'>*</span></Form.Label>
                                                                        </div>
                                                                        <div className="col-sm-6 col-md-6 d-flex">
                                                                            <div>
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/jpeg, image/png, application/pdf"
                                                                                    ref={medicalFileRef}
                                                                                    onChange={(e) => handleFileChange(e, 25)}
                                                                                    className="form-control max-w-[350px]"
                                                                                />
                                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                                            </div>
                                                                            <div className='ml-2'>
                                                                                {selectedMedicleFile.attachmentFile && (
                                                                                    <>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Save File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-info' onClick={() => handleFileUpload(selectedMedicleFile.documentTypeId)}><i className="fa fa-save"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        {/* <OverlayTrigger overlay={<Tooltip>{t('View File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => handleViewSelectedFile(selectedMedicleFile.fileUrl, selectedMedicleFile.fileName)}><i className="fa fa-eye"></i></button>
                                                                                        </OverlayTrigger> */}

                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Preview File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => handleViewSelectedFile(selectedMedicleFile.fileUrl, selectedMedicleFile.fileName)}><i className="fa fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </>
                                                                                )}
                                                                                {selectedMedicleFile.mediaId && !selectedMedicleFile.attachmentFile && (
                                                                                    <>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Download File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-warning ml-2' onClick={() => handleFileDownload(selectedMedicleFile.fileName)}><i className="fa fa-download"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('View File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => getFileViewByFileName(selectedMedicleFile.fileName)}><i className="fa fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Delete File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-danger ml-2' onClick={() => deleteFile(selectedMedicleFile.mediaId)}><i className="fa fa-minus"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </Form.Group>
                                                                </div>

                                                                <div className="row">
                                                                    <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                                        <div className="col-sm-6 col-md-4 col-form-label text-right font-semibold">
                                                                            <Form.Label>Educational Certificate <span className='text-danger'>*</span></Form.Label>
                                                                        </div>
                                                                        <div className="col-sm-6 col-md-6 d-flex">
                                                                            <div>
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/jpeg, image/png, application/pdf"
                                                                                    ref={educationFileRef}
                                                                                    onChange={(e) => handleFileChange(e, 26)}
                                                                                    className="form-control max-w-[350px]"
                                                                                />
                                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                                            </div>
                                                                            <div className='ml-2'>
                                                                                {selectedEducationFile.attachmentFile && (
                                                                                    <>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Save File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-info' onClick={() => handleFileUpload(selectedEducationFile.documentTypeId)}><i className="fa fa-save"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('View File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => getFileViewByFileName(selectedEducationFile.fileName)}><i className="fa fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </>
                                                                                )}
                                                                                {selectedEducationFile.mediaId && !selectedEducationFile.attachmentFile && (
                                                                                    <>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Download File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-warning ml-2' onClick={() => handleFileDownload(selectedEducationFile.fileName)}><i className="fa fa-download"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('View File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => getFileViewByFileName(selectedEducationFile.fileName)}><i className="fa fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Delete File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-danger ml-2' onClick={() => deleteFile(selectedEducationFile.mediaId)}><i className="fa fa-minus"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </Form.Group>
                                                                </div>

                                                                <div className="row">
                                                                    <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                                        <div className="col-sm-6 col-md-4 col-form-label text-right font-semibold">
                                                                            <Form.Label>National ID <span className='text-danger'>*</span></Form.Label>
                                                                        </div>
                                                                        <div className="col-sm-6 col-md-6 d-flex">
                                                                            <div>
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/jpeg, image/png, application/pdf"
                                                                                    ref={nidFileRef}
                                                                                    onChange={(e) => handleFileChange(e, 27)}
                                                                                    className="form-control max-w-[350px]"
                                                                                />
                                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                                            </div>
                                                                            <div className='ml-2'>
                                                                                {/* {selectedNationalIdFile.attachmentFile} */}
                                                                                {selectedNationalIdFile.attachmentFile && (
                                                                                    <>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Save File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-info' onClick={() => handleFileUpload(selectedNationalIdFile.documentTypeId)}><i className="fa fa-save"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('View File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => handleViewSelectedFile(selectedNationalIdFile.fileUrl, selectedNationalIdFile.fileName)}><i className="fa fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </>
                                                                                )}
                                                                                {selectedNationalIdFile.mediaId && !selectedNationalIdFile.attachmentFile && (
                                                                                    <>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Download File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-warning ml-2' onClick={() => handleFileDownload(selectedNationalIdFile.fileName)}><i className="fa fa-download"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('View File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => getFileViewByFileName(selectedNationalIdFile.fileName)}><i className="fa fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Delete File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-danger ml-2' onClick={() => deleteFile(selectedNationalIdFile.mediaId)}><i className="fa fa-minus"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </Form.Group>
                                                                </div>

                                                                <div className="row">
                                                                    <Form.Group className="row mb-3 items-center" controlId="fileUpload">
                                                                        <div className="col-sm-6 col-md-4 col-form-label text-right font-semibold">
                                                                            <Form.Label>Utility Bill(Gas/Electricity/Wasa)</Form.Label>
                                                                        </div>
                                                                        <div className="col-sm-6 col-md-6 d-flex">
                                                                            <div>
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/jpeg, image/png, application/pdf"
                                                                                    ref={utilityBillFileRef}
                                                                                    onChange={(e) => handleFileChange(e, 28)}
                                                                                    className="form-control max-w-[350px]"
                                                                                />
                                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                                            </div>
                                                                            <div className='ml-2'>
                                                                                {selectedUtilityBillFile.attachmentFile && (
                                                                                    <>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Save File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-info' onClick={() => handleFileUpload(selectedUtilityBillFile.documentTypeId)}><i className="fa fa-save"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('View File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => handleViewSelectedFile(selectedUtilityBillFile.fileUrl, selectedUtilityBillFile.fileName)}><i className="fa fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </>
                                                                                )}
                                                                                {selectedUtilityBillFile.mediaId && !selectedUtilityBillFile.attachmentFile && (
                                                                                    <>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Download File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-warning ml-2' onClick={() => handleFileDownload(selectedUtilityBillFile.fileName)}><i className="fa fa-download"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('View File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => getFileViewByFileName(selectedUtilityBillFile.fileName)}><i className="fa fa-eye"></i></button>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Delete File')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-danger ml-2' onClick={() => deleteFile(selectedUtilityBillFile.mediaId)}><i className="fa fa-minus"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </Form.Group>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row mt-[24px] mb-6">
                                        <div className="col-md-12 text-right">

                                            <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/driving-license/new-driving-license/application-page1/${initialValues.serviceRequestNo}`)}>{t('previous')}</button>
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

export default (DrivingLicenseApplicationPage2);