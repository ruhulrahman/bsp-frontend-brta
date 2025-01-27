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
import FileViewer from '@/components/common/FileViewer';
import { useParams, useNavigate } from 'react-router-dom';
import helpers, { toaster } from '@/utils/helpers.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import { setListData, setLoading, toggleShowFilter } from '@/store/commonSlice';

const VehicleRegistrationPage4 = ({ t }) => {

    let { serviceRequestId, isViewable } = useParams()
    const [serviceRequestNo, setServiceRequestNo] = useState(null);
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [initialValues, setInitialValues] = useState({
        orgId: '',
        vehicleInfoId: '',
        serviceRequestId: '',
        pageCompleted: 4,
        billOfEntry: {
            documentTypeId: 29,
            documentType: 'BILL OF ENTRY',
            required: true,
            fileExist: false,
            sampleFileName: 'billOfEntry.jpg',
            files: [{
                mediaId: null,
                attachmentFile: null,
                fileName: '',
                fileUrl: null,
            }]
        },
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
        // getOfficeList();
        // getVehicleRegistrationRelatedDropdwonList();
        getServiceWiseDocumentList();
    }, []);

    // Fetch the role by id after the parent-child list is ready
    useEffect(() => {
        if (serviceRequestId) {
            getVehicleInfoById(serviceRequestId);
            getServiceMediasByServiceRequestId()
        } else {
            navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
        }
    }, [serviceRequestId]);
    const getVehicleRegistrationRelatedDropdwonList = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/common/get-vehile-registration-related-dropdown-list`)
            setCommonDropdowns(data);
        } catch (error) {
            console.log('error', error)
        }
    }

    const [documentList, setDocumentList] = useState([])
    const [requiredDocumentList, setRequiredDocumentList] = useState([])
    const getServiceWiseDocumentList = async () => {

        const serviceId = 14; //'motor_vehicle_registration'

        try {
            // const { data } = await RestApi.get(`api/v1/admin/configurations/service-document-map-service-id/${serviceId}`)
            const { data } = await RestApi.get(`api/v1/applicant/vehicle/get-service-documents/${serviceRequestId}`)

            if (data.length > 0) {
                const mappedData = data.map(item => {
                    if (!item.files || item.files.length === 0) {
                        item.files = [
                            {
                                mediaId: null,
                                attachmentFile: null,
                                fileName: '',
                                fileUrl: null,
                            }
                        ]
                        return item
                    }
                    return item
                })
                setDocumentList(mappedData);
                setRequiredDocumentList(data.filter(item => item.isDocumentRequired === true))
            }
        } catch (error) {
            console.log('error', error)
        }
    }


    const handleFileUpload = async () => {

        if (!selectedFile) {
            alert("Please select a file!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const { data } = await RestApi.post(`api/files/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            alert(data.message);
            console.log('data', data)
        } catch (error) {
            console.log('error', error)
        }
    }

    // Fetch File URL
    const handleGetFileUrl = async (fileName) => {
        try {
            const response = await RestApi.get(`api/files/url/${fileName}`);
            // const response = await RestApi.get(`api/files/full-url/${fileName}`);
            setFileUrl(response.data);
        } catch (error) {
            console.error("Error fetching file URL:", error);
        }
    }

    const handleViewSelectedFile = async (selectedFile, fileName) => {
        console.log("selectedFile", selectedFile)
        console.log("fileName", fileName)
        setFileUrl(selectedFile);
        setFileViewerData({ fileUrl: selectedFile, fileName: fileName });
        openModal()
    }
    // Fetch File URL
    const viewSampleFile = async (fileName, documentType) => {
        try {
            const response = await RestApi.get(`/api/files/view-sample/${fileName}`, {
                // responseType: "blob", // Important for handling file content
                responseType: 'arraybuffer'
            });

            console.log('response', response)

            // Create a URL for the file blob
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            setFileUrl(url);
            setFileViewerData({ fileUrl: url, fileName: documentType });
            openModal()
        } catch (error) {
            console.error("Error fetching file URL:", error);
        }
    }
    // Fetch File URL
    const getFileViewByFileName = async (fileName) => {
        try {
            const response = await RestApi.get(`/api/files/view/${fileName}`, {
                // responseType: "blob", // Important for handling file content
                responseType: 'arraybuffer'
            });

            console.log('response', response)

            // Create a URL for the file blob
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            setFileUrl(url);
            setFileViewerData({ fileUrl: url, fileName: fileName });
            openModal()
        } catch (error) {
            console.error("Error fetching file URL:", error);
        }
    }

    // Handle File Download
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
    };

    const downloadServiceRelatedFile = async (newfile) => {

        try {
            // const { data } = await RestApi.get(`api/files/download/${newfile}`, {
            const { data } = await RestApi.get(`api/files/url/${newfile}`, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            console.log('data', data)
        } catch (error) {
            console.log('error', error)
        }
    }


    const getVehicleInfoById = async (serviceRequestId) => {

        try {
            // const { data } = await RestApi.get(`api/v1/applicant/vehicle/${id}`)
            const { data } = await RestApi.get(`api/v1/applicant/vehicle/service/${serviceRequestId}`)

            const apiResponse = Object.assign({}, data.applicantNidInfo, data.vehicleInfo, data, { serviceRequestId: data.id });

            console.log('apiResponse.serviceRequestNo', apiResponse.serviceRequestNo)
            setServiceRequestNo(apiResponse.serviceRequestNo)
            if (apiResponse && apiResponse.pageCompleted < 1) {
                navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1/${serviceRequestId}`)
            }
            // setInitialValues(apiResponse);

        } catch (error) {
            console.log('error', error)
            navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
        }
    }



    const getServiceMediasByServiceRequestId = async () => {

        dispatch(setLoading(true));

        // setSelectedMedicleFile(medicleFileResetValues)

        try {
            const { data } = await RestApi.get(`api/v1/applicant/vehicle/get-service-medias-by-service-request-id/${serviceRequestId}`)

            console.log('data=====================================', data)
            // if (data && data.length > 0) {
            //     data.filter(item => item.documentTypeId === 25).length > 0 ? setSelectedMedicleFile({ ...selectedMedicleFile, ...data.filter(item => item.documentTypeId === 25)[0] }) : null;
            //     data.filter(item => item.documentTypeId === 26).length > 0 ? setSelectedEducationFile({ ...selectedEducationFile, ...data.filter(item => item.documentTypeId === 26)[0] }) : null;
            //     data.filter(item => item.documentTypeId === 27).length > 0 ? setSelectedNationalIdFile({ ...selectedNationalIdFile, ...data.filter(item => item.documentTypeId === 27)[0] }) : null;
            //     data.filter(item => item.documentTypeId === 28).length > 0 ? setSelectedUtilityBillFile({ ...selectedUtilityBillFile, ...data.filter(item => item.documentTypeId === 28)[0] }) : null;
            // }

        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

    const onSubmit = async (values, setSubmitting, resetForm) => {

        if (requiredDocumentList.length > 0) {
            const requiredDocumentListFindItem = requiredDocumentList.find(item => item.isDocumentRequired && !item.fileExist)
            if (requiredDocumentListFindItem) {
                toaster(`Please upload ${requiredDocumentListFindItem.documentType.nameEn} file!`, 'error');
                return;
            }
        }

        console.log('serviceRequestNo================', serviceRequestNo)

        // navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-first-payment/${serviceRequestId}`)
        navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-first-payment/${serviceRequestId}/${serviceRequestNo}`)

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

    const [file, setFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUrl, setFileUrl] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [fileViewerData, setFileViewerData] = useState({
        fileUrl: '',
        fileName: ''
    });


    const openModal = () => {
        setModalOpen(true);
        console.log('modalOpen', modalOpen)
        // setFileViewerData(item);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFileViewerData({
            fileUrl: '',
            fileName: ''
        }); // Reset edit data
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



                            const addNewRow = async (documentTypeId) => {

                                const documentIndex = documentList.findIndex(item => item.documentTypeId === documentTypeId);

                                if (documentIndex !== -1) {
                                    const documentItem = documentList[documentIndex];

                                    const newDocument = {
                                        ...documentItem,
                                        files: [
                                            ...documentItem.files,
                                            {
                                                attachmentFile: null,
                                                fileName: '',
                                                fileUrl: null,
                                            }
                                        ]
                                    };

                                    const updatedDocumentList = [...documentList];
                                    updatedDocumentList[documentIndex] = newDocument;

                                    setDocumentList(updatedDocumentList);
                                }
                            }

                            const removeRow = async (documentTypeId, index) => {

                                const documentIndex = documentList.findIndex(item => item.documentTypeId === documentTypeId);

                                if (documentIndex !== -1) {
                                    const documentItem = documentList[documentIndex];

                                    const documentFiles = [...documentItem.files]
                                    documentFiles.splice(index, 1);

                                    const updatedDocumentList = [...documentList];
                                    updatedDocumentList[documentIndex] = {
                                        ...documentItem,
                                        files: documentFiles
                                    };

                                    setDocumentList(updatedDocumentList);
                                }
                            }

                            const clearRow = async (documentType) => {
                                
                            }

                            // Handle File Selection
                            const handleFileChange = (e, index, documentTypeId) => {
                                // setSelectedFile(e.target.files[0]);
                                // setFileUrl(URL.createObjectURL(e.target.files[0]));
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

                                // const blob = new Blob([selectedFile], { type: 'application/pdf' });
                                // const url = URL.createObjectURL(blob);
                                const newFile = {
                                    attachmentFile: selectedFile,
                                    fileName: selectedFile.name,
                                    fileUrl: selectedFileUrl
                                }

                                const documentIndex = documentList.findIndex(item => item.documentTypeId === documentTypeId);

                                if (documentIndex !== -1) {
                                    const documentItem = documentList[documentIndex];

                                    const documentFiles = [...documentItem.files]

                                    documentFiles[index].attachmentFile = selectedFile;
                                    documentFiles[index].fileName = selectedFile.name;
                                    documentFiles[index].fileUrl = selectedFileUrl;

                                    const updatedDocumentList = [...documentList];
                                    updatedDocumentList[documentIndex] = {
                                        ...documentItem,
                                        files: documentFiles
                                    };

                                    setDocumentList(updatedDocumentList);
                                }

                            }

                            const uploadVehicleServiceFile = async (documentTypeId, index) => {

                                const formData = new FormData();
                                formData.append("serviceRequestId", serviceRequestId);

                                const documentIndex = documentList.findIndex(item => item.documentTypeId === documentTypeId);

                                if (documentIndex !== -1) {
                                    const documentItem = documentList[documentIndex];

                                    const documentFile = [...documentItem.files][index];
                                    const mediaId = documentFile.mediaId;
                                    const attachmentFile = documentFile.attachmentFile;

                                    if (!attachmentFile) {
                                        toaster("Please select a file!", 'error');
                                        return;
                                    }
                                    formData.append("mediaId", mediaId);
                                    formData.append("documentTypeId", documentTypeId);
                                    formData.append("attachment", attachmentFile);
                                }

                                try {

                                    const { data } = await RestApi.post(`api/v1/applicant/vehicle/document-upload`, formData, {
                                        headers: { "Content-Type": "multipart/form-data" }
                                    })

                                    // setSelectedMedicleFile({ ...selectedMedicleFile, attachmentFile: null })

                                    getServiceMediasByServiceRequestId()
                                    getServiceWiseDocumentList()
                                    console.log('data', data)
                                    toaster(data.message)
                                } catch (error) {
                                    console.log('error', error)
                                    toaster(error.response.data, 'error')
                                }
                            }


                            const deleteFile = async (mediaId) => {
                                try {
                                    await RestApi.delete(`api/files/delete-vehicle-service-document/${mediaId}`);
                                    toaster("File deleted successfully")
                                    getServiceWiseDocumentList()
                                } catch (error) {
                                    console.error("Error deleting file:", error);
                                    toaster(error.response.data.message)
                                }
                            }

                            return (
                                <FormikForm>
                                    <Loading loading={loading} loadingText={t('submitting')} />

                                    <Card className='mb-3'>
                                        <CardBody>
                                            <div className="row">

                                                <h4 className="my-2 font-bold text-green-900">{t('Add required attachments (File Size Maximum 600 KB)')}</h4>
                                                <hr className='mb-3' />

                                                <div className="col-sm-12 col-lg-12 col-xl-12 text-[14px]">

                                                    <FileViewer
                                                        show={modalOpen}
                                                        onHide={handleCloseModal}
                                                        data={fileViewerData}
                                                    />

                                                    {documentList.length > 0 && documentList.map((item, index) => (
                                                        <div className="row">
                                                            <Form.Group className="row mb-3 items-start" controlId="fileUpload">
                                                                <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                    <Form.Label>{item.documentType.nameEn}
                                                                        {item.isDocumentRequired && (
                                                                            <span className='text-danger'> *</span>
                                                                        )}
                                                                    </Form.Label>
                                                                </div>
                                                                <div className="col-sm-6 col-md-6">
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <button type='button' className='btn btn-sm btn-rounded btn-secondary' onClick={() => viewSampleFile(values.billOfEntry.sampleFileName, values.billOfEntry.documentType)}><i className="fa fa-eye"></i> Sample File</button>
                                                                            {/* <button type='button' className='btn btn-sm btn-rounded btn-danger ml-2' onClick={() => clearRow(item.documentTypeId)}><i className="fa fa-times"></i> Clear All</button> */}
                                                                        </div>
                                                                    </div>

                                                                    {item?.files?.length > 0 && item?.files?.map((fileItem, index) => (
                                                                        <div key={index} className="row mt-2">
                                                                            <div className="col-md-12 d-flex gap-2">
                                                                                <div>
                                                                                    <input
                                                                                        type="file"
                                                                                        name="file"
                                                                                        onChange={(e) => handleFileChange(e, index, item.documentTypeId)}
                                                                                        className="form-control max-w-[250px]"
                                                                                    />
                                                                                    <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                                                </div>
                                                                                <div>
                                                                                    {fileItem.attachmentFile && (
                                                                                        <>
                                                                                            <OverlayTrigger overlay={<Tooltip>{t('Save File')}</Tooltip>}>
                                                                                                <button type='button' className='btn btn-sm btn-rounded btn-outline-info' onClick={() => uploadVehicleServiceFile(item.documentTypeId, index)}><i className="fa fa-save"></i></button>
                                                                                            </OverlayTrigger>
                                                                                            <OverlayTrigger overlay={<Tooltip>{t('Preview File')}</Tooltip>}>
                                                                                                <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => handleViewSelectedFile(fileItem.fileUrl, fileItem.fileName)}><i className="fa fa-eye"></i></button>
                                                                                            </OverlayTrigger>
                                                                                        </>
                                                                                    )}
                                                                                    {fileItem.mediaId && !fileItem.attachmentFile && (
                                                                                        <>
                                                                                            <OverlayTrigger overlay={<Tooltip>{t('Download File')}</Tooltip>}>
                                                                                                <button type='button' className='btn btn-sm btn-rounded btn-outline-warning ml-2' onClick={() => handleFileDownload(fileItem.fileName)}><i className="fa fa-download"></i></button>
                                                                                            </OverlayTrigger>
                                                                                            <OverlayTrigger overlay={<Tooltip>{t('View File')}</Tooltip>}>
                                                                                                <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => getFileViewByFileName(fileItem.fileName)}><i className="fa fa-eye"></i></button>
                                                                                            </OverlayTrigger>
                                                                                            <OverlayTrigger overlay={<Tooltip>{t('Delete File')}</Tooltip>}>
                                                                                                <button type='button' className='btn btn-sm btn-rounded btn-outline-danger ml-2' onClick={() => deleteFile(fileItem.mediaId)}><i className="fa fa-minus"></i></button>
                                                                                            </OverlayTrigger>
                                                                                        </>
                                                                                    )}


                                                                                    <OverlayTrigger overlay={<Tooltip>{t('Add More Page')}</Tooltip>}>
                                                                                        <button type='button' className='btn btn-sm btn-rounded btn-outline-success ml-2' onClick={() => addNewRow(item.documentTypeId)}><i className="fa fa-plus"></i></button>
                                                                                    </OverlayTrigger>

                                                                                    {item.files?.length > 1 && !fileItem.mediaId && (
                                                                                        <OverlayTrigger overlay={<Tooltip>{t('Remove Page')}</Tooltip>}>
                                                                                            <button type='button' className='btn btn-sm btn-rounded btn-outline-danger ml-2' onClick={() => removeRow(item.documentTypeId, index)}><i className="fa fa-minus"></i></button>
                                                                                        </OverlayTrigger>
                                                                                    )}

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </Form.Group>
                                                        </div>
                                                    ))}

                                                </div>

                                            </div>

                                        </CardBody>
                                    </Card>


                                    <div className="row mt-2 mb-6">
                                        <div className="col-md-12 text-right">

                                            <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page3/${serviceRequestId}`)}>{t('previous')}</button>
                                            <button type='submit' className='btn btn-success btn-rounded btn-xs'>{t('saveAndNext')}</button>
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