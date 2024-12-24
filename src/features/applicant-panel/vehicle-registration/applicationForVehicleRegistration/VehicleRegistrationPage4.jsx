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
        billOfEntry: [
            {
                fileId: '',
                file: '',
                selectedFile: '',
                fileName: '',
                fileUrl: '',
            }
        ],
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

    const getVehicleRegistrationRelatedDropdwonList = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/common/get-vehile-registration-related-dropdown-list`)
            setCommonDropdowns(data);
        } catch (error) {
            console.log('error', error)
        }
    }

    const [file, setFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUrl, setFileUrl] = useState("");

    // Handle File Selection
    const handleFileChange = (e, index, documentType) => {
        setSelectedFile(e.target.files[0]);
        // setFileUrl(URL.createObjectURL(e.target.files[0]));
        const selectedFile = e.target.files[0];
        const selectedFileUrl = URL.createObjectURL(e.target.files[0]);
        console.log('selectedFile', selectedFile)
        const blob = new Blob([selectedFile], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        if (documentType === 'billOfEntry') {
            const newBillOfEntry = [...initialValues.billOfEntry];
            newBillOfEntry[index].selectedFile = selectedFileUrl;
            newBillOfEntry[index].file = selectedFile;
            newBillOfEntry[index].fileName = selectedFile.name;
            // newBillOfEntry[index].fileUrl = selectedFileUrl;
            setInitialValues({...initialValues, billOfEntry: newBillOfEntry })
        }
    };

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
            setFileUrl(selectedFile);
            setFileViewerData({ fileUrl: selectedFile, fileName: fileName });
            openModal()
    }
    // Fetch File URL
    const handleViewFile = async (fileName) => {
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

    const addNewRow = async (documentType) => {
        if (documentType === 'billOfEntry') {
            const newBillOfEntry = {
                fileId: '',
                file: '',
                selectedFile: '',
                fileName: '',
                fileUrl: '',
            }
            
            setInitialValues({...initialValues, billOfEntry: [...initialValues.billOfEntry, newBillOfEntry] })
        }
    }

    const removeRow = async (documentType, index) => {
        if (documentType === 'billOfEntry') {
            const newBillOfEntry = [...initialValues.billOfEntry];
            newBillOfEntry.splice(index, 1);
            setInitialValues({...initialValues, billOfEntry: newBillOfEntry })
        }
    }

    const clearRow = async (documentType) => {
        if (documentType === 'billOfEntry') {
            const newBillOfEntry = {
                fileId: '',
                file: '',
                selectedFile: '',
                fileName: '',
                fileUrl: '',
            }
            
            setInitialValues({...initialValues, billOfEntry: [newBillOfEntry] })
        }
    }

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

            if (apiResponse && apiResponse.pageCompleted < 1) {
                navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
            }
            // setInitialValues(apiResponse);

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

                                                    <div className="row">
                                                        <Form.Group className="row mb-3 items-start" controlId="fileUpload">
                                                            <div className="col-sm-6 col-md-6 col-form-label text-right font-semibold">
                                                                <Form.Label>BILL OF ENTRY <span className='text-danger'>*</span></Form.Label>
                                                            </div>
                                                            <div className="col-sm-6 col-md-6">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <button type='button' className='btn btn-sm btn-rounded btn-secondary' onClick={() => handleViewFile("Receipt_BRTA.pdf")}><i className="fa fa-eye"></i> Sample File</button>
                                                                        <button type='button' className='btn btn-sm btn-rounded btn-danger ml-2' onClick={() => clearRow("billOfEntry")}><i className="fa fa-times"></i> Clear All</button>
                                                                        {/* <button type='button' className='btn btn-sm btn-rounded w-8 h-8 btn-outline-danger ml-2' onClick={() => clearRow("billOfEntry")}><i className="fa fa-times"></i></button> */}
                                                                    </div>
                                                                </div>

                                                                {initialValues.billOfEntry && initialValues.billOfEntry.length > 0 && initialValues.billOfEntry.map((item, index) => (
                                                                    <div key={index} className="row mt-2">
                                                                        <div className="col-md-12 d-flex gap-2">
                                                                            <div>
                                                                                <input
                                                                                    type="file"
                                                                                    name="file"
                                                                                    onChange={(e) => handleFileChange(e, index, "billOfEntry")}
                                                                                    className="form-control max-w-[250px]"
                                                                                />
                                                                                <ErrorMessage name="file" component="div" className="text-danger mt-1" />
                                                                            </div>
                                                                            <div>
                                                                                {item.selectedFile && (
                                                                                    <>
                                                                                        <button type='button' className='btn btn-sm btn-rounded btn-outline-info' onClick={() => handleFileUpload()}><i className="fa fa-save"></i></button>
                                                                                        <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => handleViewSelectedFile(item.selectedFile, item.fileName)}><i className="fa fa-eye"></i></button>
                                                                                    </>
                                                                                )}
                                                                                {!item.selectedFile && item.fileUrl && (
                                                                                    <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => handleViewSelectedFile(item.selectedFile, item.fileName)}><i className="fa fa-eye"></i></button>
                                                                                )}
                                                                                {/* <button type='button' className='btn btn-sm btn-rounded btn-outline-default ml-2' onClick={() => handleViewFile("Receipt_BRTA.pdf")}><i className="fa fa-eye"></i></button> */}
                                                                                {!item.selectedFile && item.fileName && (
                                                                                    // <button type='button' className='btn btn-sm btn-rounded btn-outline-warning ml-2' onClick={() => handleFileDownload("BRTA-Service-Portal-BSP--Profile.png")}><i className="fa fa-download"></i></button>
                                                                                    <button type='button' className='btn btn-sm btn-rounded btn-outline-warning ml-2' onClick={() => handleFileDownload(item.fileName)}><i className="fa fa-download"></i></button>
                                                                                )}
                                                                                <button type='button' className='btn btn-sm btn-rounded btn-outline-success ml-2' onClick={() => addNewRow("billOfEntry")}><i className="fa fa-plus"></i></button>
                                                                                {initialValues.billOfEntry.length > 1 && (
                                                                                    <button type='button' className='btn btn-sm btn-rounded btn-outline-danger ml-2' onClick={() => removeRow("billOfEntry", index)}><i className="fa fa-minus"></i></button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
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
                                                                    className="form-control max-w-[250px]"
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
                                                                    className="form-control max-w-[250px]"
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
                                                                    className="form-control max-w-[250px]"
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
                                                                    className="form-control max-w-[250px]"
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
                                                                    className="form-control max-w-[250px]"
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
                                                                    className="form-control max-w-[250px]"
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
                                                                    className="form-control max-w-[250px]"
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
                                                                    className="form-control max-w-[250px]"
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
                                                                    className="form-control max-w-[250px]"
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
                                                                    className="form-control max-w-[250px]"
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
                                                                    className="form-control max-w-[250px]"
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
                                                                    className="form-control max-w-[250px]"
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

                                            <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page3/${serviceRequestId}`)}>{t('previous')}</button>
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