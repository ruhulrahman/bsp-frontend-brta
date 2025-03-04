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
import { setLoading, setListData, setCurrentPage, setPaginationData, setResetPagination, toggleShowFilter } from '@/store/commonSlice';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import { useNavigate } from 'react-router-dom';
import SearchComponent from '../../../common/list/VehicleRegistrationListSearchComponent';
import ApplicationForward from '../applicationForVehicleRegistration/ApplicationForward';
import ApplicationForwardInspector from '../applicationForVehicleRegistration/ApplicationForwardInspector';
import ApplicationForwardRevenue from '../applicationForVehicleRegistration/ApplicationForwardRevenue';
import useCommonFunctions from '@/hooks/useCommonFunctions';
import CustomPagination from '@/components/common/CustomPagination';

const VehicleRegistrationApprovalList = () => {
    const { t } = useTranslation();

    const navigate = useNavigate()
    const { hasPermission } = useCommonFunctions();

    const dispatch = useDispatch();
    const { activeStatusList, loading, listData, windowSize, pagination, showFilter, dropdowns, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const toggleFilter = () => {
        dispatch(toggleShowFilter());
    }

    const [currentPage, setCurrentPage] = useState(0);  // Spring Boot uses 0-based page numbers
    const [pageSize, setPageSize] = useState(5);       // Default page size
    const [totalPages, setTotalPages] = useState(0);    // Total pages from Spring response
    const [totalElements, setTotalElements] = useState(0);  // Total items
    const [slOffset, setSlOffset] = useState(1);  // Total items

    const setPaginationData = (data) => {
        setCurrentPage(data.page);
        setPageSize(data.size);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setSlOffset(data.size * (data.page + 1) - data.size + 1);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const [searchValues, setSearchValues] = useState({
        serviceRequestNo: '',
        chassisNumber: '',
        engineNumber: '',
        nid: '',
        mobile: '',
        applicationDate: '',
    });

    const resetSearchValues = {
        serviceRequestNo: '',
        chassisNumber: '',
        engineNumber: '',
        nid: '',
        mobile: '',
        applicationDate: '',
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
            // const { data } = await RestApi.post('api/reg/applications/v1/vehicles', searchValues, { params })
            const { data } = await RestApi.post('api/reg/applications/v1/vehicles-for-approval', searchValues, { params })
            // const { data } = await RestApi.post('api/reg/applications/v1/vehicles-for-mvi', searchValues, { params })
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

    const handleOpenViewDetailsModal = (item) => {
        setEditData(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditData(null); // Reset edit data
    };
    const handleSave = async (serviceRequestId) => {
        getListData(serviceRequestId)
    };

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
                                    <SearchComponent values={values} clearData={() => handleReset(resetForm, values)} setFieldValue={setFieldValue} />
                                </FormikForm>
                            )}
                        </Formik>
                    </div>
                </div>
            }
            <div className=" text-slate-700 card border-none bg-white shadow-md rounded-xl">

                <div className="flex flex-wrap items-center justify-between p-2">
                    <div className="w-full sm:w-2/3">
                        <h3 className="text-lg font-semibold text-green-600">{t('vehicleRegistrationApplicationList')}</h3>
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

                <div className="p-0 overflow-auto min-h-[300px]">
                    <Loading loading={loading} />
                    <table className="table-auto min-w-full text-left border border-gray-200">
                        <thead>
                            <tr>
                                <th>Serial</th>
                                <th>Service Request No</th>
                                <th>Chassis No</th>
                                <th>Engine No</th>
                                <th>Vehicle Class</th>
                                <th>CC</th>
                                <th>Manufacturing Year</th>
                                <th>Application Date</th>
                                <th>Application Status</th>
                                <th className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            {listData && listData.map((item, index) => (
                                <tr key={item.sl} className='text-slate-500 text-sm'>
                                    <td>{item.sl}</td>
                                    <td>{item.serviceRequestNo}</td>
                                    <td>{item.chassisNumber}</td>
                                    <td>{item.engineNumber}</td>
                                    <td>{item.vehicleClassName}</td>
                                    <td>{item.ccOrKw}</td>
                                    <td>{item.manufacturingYear}</td>
                                    <td>{helpers.dDate(item.applicationDate)}</td>
                                    <td>{item.applicationStatusName}</td>
                                    {/* <td><span className={`badge bg-${item.applicationStatusColor}`}>{item.applicationStatusName}</span></td> */}
                                    <td className='text-center'>
                                        {hasPermission('vehicle_application_approval') && (
                                            <OverlayTrigger overlay={<Tooltip>{t('applicationDetails')}</Tooltip>}>
                                                <button onClick={() => openModal(item, 'approval')} className='btn btn-sm rounded-full text-[12px] btn-outline-dark mr-1'>
                                                    <i className="fa fa-eye"></i>
                                                </button>
                                            </OverlayTrigger>
                                        )}
                                        {hasPermission('vehicle_inspection_submission') && (
                                            <OverlayTrigger overlay={<Tooltip>{t('applicationDetails')}</Tooltip>}>
                                                <button onClick={() => openModal(item, 'inspection')} className='btn btn-sm rounded-full text-[12px] btn-outline-dark mr-1'>
                                                    <i className="fa fa-eye"></i>
                                                </button>
                                            </OverlayTrigger>
                                        )}
                                        {hasPermission('vehicle_revenue_check_submission') && (
                                            <OverlayTrigger overlay={<Tooltip>{t('applicationDetails')}</Tooltip>}>
                                                <button onClick={() => openModal(item, 'revenue')} className='btn btn-sm rounded-full text-[12px] btn-outline-dark mr-1'>
                                                    <i className="fa fa-eye"></i>
                                                </button>
                                            </OverlayTrigger>
                                        )}
                                        {/* <OverlayTrigger overlay={<Tooltip>{t('viewDetails')}</Tooltip>}>
                                            <button onClick={() => handleOpenViewDetailsModal(item)} className='btn btn-sm text-[12px] btn-outline-dark mr-1'>
                                                <i className="fa fa-eye"></i>
                                            </button>
                                        </OverlayTrigger> */}
                                        {/* <OverlayTrigger overlay={<Tooltip>{t('edit')}</Tooltip>}>
                                            <button onClick={() => navigate(`/admin/user-management/add-or-update-user/${false}/${item.id}`)} className='btn btn-sm text-[12px] btn-outline-info'>
                                                <i className="fa fa-pen"></i>
                                            </button>
                                        </OverlayTrigger> */}
                                    </td>
                                </tr>
                            ))}

                            {listData && listData.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center text-danger text-slate-500">
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

                <ApplicationForward
                    show={modalOpenApproval}
                    onHide={handleCloseModal}
                    onSave={handleSave}
                    editData={editData}
                />

                <ApplicationForwardInspector
                    show={modalOpenInspection}
                    onHide={handleCloseModal}
                    onSave={handleSave}
                    editData={editData}
                />

                <ApplicationForwardRevenue
                    show={modalOpenRevenue}
                    onHide={handleCloseModal}
                    onSave={handleSave}
                    editData={editData}
                />
            </div>
        </>
    )
}

export default (VehicleRegistrationApprovalList)
