import React, { useEffect, useState } from 'react';
import ReactSelect from '@/components/ui/ReactSelect';
import { withNamespaces } from 'react-i18next';
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

const VehicleRegistrationApprovalList = ({ t }) => {

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
        // dispatch(setCurrentPage(page))
        setCurrentPage(page)
    };


    useEffect(() => {
        getListData()
    }, [currentPage]);

    // Render pagination using React Bootstrap Pagination
    const renderPagination = () => {
        let items = [];

        items.push(
            <Pagination.First
                key="first"
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0}
            />
        );

        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
            />
        );

        // Ellipsis Logic (similar to previous example)
        const maxLeft = Math.max(currentPage - Math.floor(windowSize / 2), 0);
        const maxRight = Math.min(currentPage + Math.floor(windowSize / 2), totalPages - 1);

        if (maxLeft > 0) {
            items.push(
                <Pagination.Item key={0} onClick={() => handlePageChange(0)}>
                    {currentLanguage === 'en' ? 1 : toBengaliNumber(1)}
                </Pagination.Item>
            );
            if (maxLeft > 1) {
                items.push(<Pagination.Ellipsis key="left-ellipsis" />);
            }
        }

        for (let i = maxLeft; i <= maxRight; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {currentLanguage === 'en' ? i + 1 : toBengaliNumber(i + 1)}
                </Pagination.Item>
            );
        }

        if (maxRight < totalPages - 1) {
            if (maxRight < totalPages - 2) {
                items.push(<Pagination.Ellipsis key="right-ellipsis" />);
            }
            items.push(
                <Pagination.Item
                    key={totalPages - 1}
                    onClick={() => handlePageChange(totalPages - 1)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        items.push(
            <Pagination.Next
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
            />
        );

        items.push(
            <Pagination.Last
                key="last"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
            />
        );

        return items;
    };

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

    const handleReset = (resetForm, currentValues) => {
        if (!helpers.compareValuesAreSame(searchValues, currentValues)) {

            resetForm({
                values: resetSearchValues, // Reset to initial values
            });

            if (currentPage != 0) {
                setCurrentPage(0)
            } else {
                getListData()
            }
        }
    }

    const searchData = (values) => {
        if (!helpers.compareValuesAreSame(searchValues, values)) {
            if (currentPage != 0) {
                setCurrentPage(0)
                getListData(values)
            } else {
                getListData(values)
            }
        }
    }

    const getListData = async (values = searchValues) => {
        const params = Object.assign({ page: currentPage, size: pagination.perPage });
        // const applicationDate = values.applicationDate ? new Date(values.applicationDate) : ''
        // const requestBody = Object.assign({},values, {applicationDate})

        dispatch(setLoading(true));
        dispatch(setListData([]));
        try {
            const { data } = await RestApi.post('api/reg/applications/v1/vehicles', values, { params })
            dispatch(setListData(data.content));
            setPaginationData(data);
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
    const handleSave = async (values, setSubmitting, resetForm) => {


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
                                    <SearchComponent values={values} clearData={() => handleReset(resetForm, values)} />
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
                                    <Pagination size='sm'>{renderPagination()}</Pagination>
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

export default withNamespaces()(VehicleRegistrationApprovalList)
