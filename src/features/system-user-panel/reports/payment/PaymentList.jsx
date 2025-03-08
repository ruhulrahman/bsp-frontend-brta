import React, { useEffect, useState } from 'react';
import ReactSelect from '@/components/ui/ReactSelect';
import { withTranslation, useTranslation } from 'react-i18next';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import Pagination from 'react-bootstrap/Pagination'
import Loading from '@/components/common/Loading';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import helpers, { toaster } from '@/utils/helpers.js';
import { setLoading, setListData, toggleShowFilter } from '@/store/commonSlice';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import { useNavigate } from 'react-router-dom';
import useCommonFunctions from '@/hooks/useCommonFunctions';
import CustomPagination from '@/components/common/CustomPagination';
import ViewDetails from './ViewDetails';

const PaymentList = () => {
    const { t } = useTranslation();

    const navigate = useNavigate()
    const { hasPermission } = useCommonFunctions();

    const dispatch = useDispatch();
    const { activeStatusList, loading, listData, windowSize, pagination, showFilter, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const toggleFilter = () => {
        dispatch(toggleShowFilter());
    }

    const [currentPage, setCurrentPage] = useState(0);  // Spring Boot uses 0-based page numbers
    const [pageSize, setPageSize] = useState(30);       // Default page size
    const [totalPages, setTotalPages] = useState(0);    // Total pages from Spring response
    const [totalElements, setTotalElements] = useState(0);  // Total items
    const [slOffset, setSlOffset] = useState(1);  // Total items

    const setPaginationData = (data) => {
        setCurrentPage(data.number);
        setPageSize(data.size);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setSlOffset(data.size * (data.number + 1) - data.size + 1);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const [searchValues, setSearchValues] = useState({
        challanNo: '',
        paymentId: '',
        transactionId: '',
        paidAmount: '',
    });

    const resetSearchValues = {
        challanNo: '',
        paymentId: '',
        transactionId: '',
        paidAmount: '',
    };

    // Fetch data whenever searchValues or currentPage changes
    useEffect(() => {
        getListData();
    }, [searchValues, currentPage]);

    const handleReset = (resetForm, currentValues) => {
        if (!helpers.compareValuesAreSame(resetSearchValues, currentValues)) {

            resetForm({
                values: resetSearchValues, // Reset to initial values
            });

            // Always call getListData after resetting the form
            setSearchValues(resetSearchValues); // Update the search values state
            setCurrentPage(0); // Reset to the first page
            // No need to call getListData here; useEffect will handle it
        }
    }

    const searchData = (values) => {
        if (!helpers.compareValuesAreSame(searchValues, values)) {
            setSearchValues(values); // Update the search values
            setCurrentPage(0); // Reset to the first page
            // getListData(values); // Fetch data with the new search values
        }
    }

    const getListData = async (serviceRequestId) => {
        const params = Object.assign({ page: currentPage, size: pagination.perPage });
        // const applicationDate = values.applicationDate ? new Date(values.applicationDate) : ''
        // const requestBody = Object.assign({},values, {applicationDate})

        dispatch(setLoading(true));
        dispatch(setListData([]));
        try {
            const { data } = await RestApi.post('api/bsp/payment-report/list/get', searchValues, { params })
            dispatch(setListData(data.content));
            setPaginationData(data);
            if (serviceRequestId) {
                const selectedItem = data.content.find(item => item.serviceRequestId == serviceRequestId)
                setEditData(selectedItem)
            }
            console.log(data.content);
        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

    const [formOpen, setFormOpen] = useState(false)

    const toggleFormOpen = (value) => {
        setFormOpen(value);
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenApproval, setModalOpenApproval] = useState(false);
    const [modalOpenRevenue, setModalOpenRevenue] = useState(false);
    const [modalOpenInspection, setModalOpenInspection] = useState(false);
    const [editData, setEditData] = useState(null);

    const handleOpenAddModal = () => {
        setEditData(null);
        setModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setEditData(item);
        setModalOpen(true);
    };

    const openModal = (item, modalName) => {
        if (modalName == 'approval') {
            setModalOpenApproval(true);
        } else if (modalName == 'revenue') {
            setModalOpenRevenue(true);
        } else if (modalName == 'inspection') {
            setModalOpenInspection(true);
        }
        setEditData(item);
    };

    const CloseModal = (item, modalName) => {
        if (modalName == 'approval') {
            setModalOpenApproval(false);
        } else if (modalName == 'revenue') {
            setModalOpenRevenue(false);
        } else if (modalName == 'inspection') {
            setModalOpenInspection(false);
        }
        setEditData('');
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditData(null); // Reset edit data
    };
    const handleSave = async () => {
        // getListData()
    };

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const handleOpenViewDetailsModal = (item) => {
        // setViewData(item)
        getPaymentDetails(item)
    };

    const handleCloseViewDetailsModal = () => {
        setViewModalOpen(false);
        setViewData(null); // Reset edit data
    }

    const getPaymentDetails = async (item) => {
        const params = Object.assign({paymentid: item.paymentId});
        dispatch(setLoading(true));
        try {
            const { data } = await RestApi.get(`api/bsp/acs/v1/payment/details/${item.paymentId}`, { params })
            console.log('data', data);
            const paymentDetails = Object.assign({}, item, data)
            setViewData(paymentDetails)
            setViewModalOpen(true)
        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <>
            {showFilter &&
                <div>
                    <div>
                        <div className="row mb-1">
                        </div>
                        <Formik
                            initialValues={searchValues}
                            onSubmit={(values, { resetForm }) => {
                                // console.log('Form Submitted', values);
                                searchData(values);
                            }}
                        >
                            {({ values, resetForm, setFieldValue }) => (
                                <FormikForm>
                                    <div className="card border-none bg-white mb-3">
                                        <div className="card-body p-2">
                                            <div className="row mb-1">
                                                <div className="col">
                                                    <h5 className='text-green-600 font-semibold'>{t('search_filter')}</h5>
                                                </div>
                                            </div>
                                            <div className="row">

                                                <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12">
                                                    <Form.Group className="mb-3" controlId="challanNo">
                                                        <label htmlFor="challanNo" className='labelClass'>Challan No</label>
                                                        <Field type="text" name="challanNo" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="challanNo" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12">
                                                    <Form.Group className="mb-3" controlId="paymentId">
                                                        <label htmlFor="paymentId" className='labelClass'>Payment Id</label>
                                                        <Field type="text" name="paymentId" className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="paymentId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12 d-flex align-items-center justify-content-start float-right">
                                                    <div className="w-full flex mt-2">
                                                        <button type='submit' className="btn btn-success btn-sm w-full mr-2">{t('search')}</button>
                                                        <button type='reset' onClick={() => handleReset(resetForm, values)} className="btn btn-outline-danger btn-sm w-full">{t('clear')}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </FormikForm>
                            )}
                        </Formik>
                    </div>
                </div>
            }
            <div className=" text-slate-700 card border-none bg-white shadow-md rounded-xl">

                <div className="flex flex-wrap items-center justify-between p-2">
                    <div className="w-full sm:w-2/3">
                        <h3 className="text-lg font-semibold text-green-600">{t('paymentList')}</h3>
                        <p className="text-slate-500">{t('review_each_data_before_edit_or_delete')}</p>
                        <span className="badge bg-success">{t('totalRecords')}: {totalElements}</span>
                    </div>
                    <div className="w-full sm:w-1/3 text-right mt-2 sm:mt-0">
                        <OverlayTrigger overlay={<Tooltip>{t('toggle_search_filter')}</Tooltip>}>
                            <button className="btn btn-success btn-rounded btn-sm mr-2" onClick={toggleFilter}>
                                <i className="fa fa-filter"></i>
                            </button>
                        </OverlayTrigger>
                        {/* <button className='btn btn-black btn-rounded btn-sm' onClick={() => navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)}>{t('newVehicleRegistration')}</button> */}
                    </div>
                </div>

                <ViewDetails
                    show={viewModalOpen}
                    onHide={handleCloseViewDetailsModal}
                    onSave={handleSave}
                    viewData={viewData}
                />

                <div className="p-0 overflow-auto min-h-[300px]">
                    <Loading loading={loading} />
                    <table className="table-auto min-w-full text-left border border-gray-200">
                        <thead>
                            <tr>
                                <th>Serial</th>
                                <th>Service Name</th>
                                <th>Challan No</th>
                                <th>Client Name</th>
                                <th>Paid Amount</th>
                                <th>Payment ID</th>
                                <th className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listData && listData.map((item, index) => (
                                <tr key={item.sl} className='text-slate-500 text-sm'>
                                    <td>{currentLanguage === 'en' ? slOffset + index : toBengaliNumber(slOffset + index)}.</td>
                                    <td>{currentLanguage === 'en' ? item.serviceNameEn : item.serviceNameBn}</td>
                                    <td>{item.challanNo}</td>
                                    <td>{item.clientName}</td>
                                    <td>{item.paidAmount}</td>
                                    <td>{item.paymentId}</td>
                                    <td className='text-center'>
                                        <OverlayTrigger overlay={<Tooltip>{t('viewDetails')}</Tooltip>}>
                                            <button onClick={() => handleOpenViewDetailsModal(item)} className='btn btn-rounded btn-sm text-[12px] btn-outline-dark'>
                                                <i className="fa fa-eye"></i>
                                            </button>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            ))}

                            {listData && listData.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center text-danger text-slate-500">
                                        <i className="fa fa-exclamation-circle"></i> {t('no_data_found')}
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
                {listData && listData.length > 0 && (
                    <div className='row m-2.5'>
                        <div className="col-md-12 text-right">
                            <div className="flex items-center justify-end">
                                <div className="flex">
                                    <CustomPagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default (PaymentList)
