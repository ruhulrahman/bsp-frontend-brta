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
import helper, { toaster } from '@/utils/helpers.js';
import { setLoading, setListData, setCurrentPage, setPaginationData, setResetPagination, toggleShowFilter } from '@/store/commonSlice';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import { useNavigate } from 'react-router-dom';
import useCommonFunctions from '@/hooks/useCommonFunctions';
import DrivingLicenseApplicationListSearchComponent from '@/features/common/list/DrivingLicenseApplicationListSearchComponent';
import DLApprovalModal from "./DLApprovalModal";
// import DownloadReport from '@/components/common/DownloadReport';
// import ReportViewer from '@/components/common/ReportViewer';

const DLRegistrationApprovalList = ({ t }) => {

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
        nid: '',
        learnerNo: '',
        mobile: '',
        applicationDate: '',
    });

    const resetSearchValues = {
        serviceRequestNo: '',
        nid: '',
        learnerNo: '',
        mobile: '',
        applicationDate: '',
    };

    const handleReset = (resetForm) => {
        resetForm({
            values: resetSearchValues, // Reset to initial values
        });

        if (currentPage != 0) {
            setCurrentPage(0)
        } else {
            getListData()
        }
    };

    const searchData = (values) => {
        if (currentPage != 0) {
            setCurrentPage(0)
            getListData(values)
        } else {
            getListData(values)
        }
    }

    const getListData = async (values = searchValues) => {

        const params = Object.assign({ page: currentPage, size: pagination.perPage });

        dispatch(setLoading(true));
        dispatch(setListData([]));
        try {
            const { data } = await RestApi.post('api/driving-license/v1/application-list', values, { params })
            dispatch(setListData(data.content));
            setPaginationData(data);
            console.log(data.content);
        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

    const [parameters, setParameters] = useState({});

    // const handleDownload = () => {
    //     // DownloadReport('drivingLicenseApplicaitonList', parameters);
    //     // DownloadReport('drivingLicenseApplicaitonList', searchValues);
    //     ReportViewer('drivingLicenseApplicaitonList', searchValues);
    // };

    const [formOpen, setFormOpen] = useState(false)

    const toggleFormOpen = (value) => {
        setFormOpen(value);
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);


    const openModal = (item) => {
        setModalOpen(true);
        setEditData(item);
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
                        <Formik
                            initialValues={searchValues}
                            onSubmit={(values, { resetForm }) => {
                                // console.log('Form Submitted', values);
                                searchData(values);
                            }}
                        >
                            {({ values, resetForm, setFieldValue }) => (
                                <FormikForm>
                                    <DrivingLicenseApplicationListSearchComponent values={values} clearData={() => handleReset(resetForm)} />
                                </FormikForm>
                            )}
                        </Formik>
                    </div>
                </div>
            }
            <div className=" text-slate-700 card bg-white border-none shadow-md rounded-xl">
                <div className="flex flex-wrap items-center justify-between p-2">
                    <div className="w-full sm:w-2/3">
                        <h3 className="text-lg font-semibold  text-green-600">{t('drivingLicenseApplicationList')}</h3>
                        <p className="text-slate-500">{t('review_each_data_before_edit_or_delete')}</p>
                    </div>
                    <div className="w-full sm:w-1/3 text-right mt-2 sm:mt-0">
                        <OverlayTrigger overlay={<Tooltip>{t('toggle_search_filter')}</Tooltip>}>
                            <button className="btn btn-success btn-rounded btn-sm mr-2" onClick={toggleFilter}>
                                <i className="fa fa-filter"></i>
                            </button>
                        </OverlayTrigger>
                    </div>
                </div>

                <div className="p-0 overflow-auto min-h-[300px]">
                    <Loading loading={loading} />
                    <table className="table-auto min-w-full text-left border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-sm">
                                <th>Serial</th>
                                <th>Service Request No</th>
                                <th>Name</th>
                                <th>Applicant Type</th>
                                <th>License Type</th>
                                <th>Driving Issued Authority</th>
                                <th>NID</th>
                                <th>Application Date</th>
                                <th>Application Status</th>
                                <th className="text-center min-w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listData && listData.map((item, index) => (
                                <tr key={item.sl} className="text-slate-500 text-sm">
                                    <td>{item.sl}</td>
                                    <td>{item.serviceRequestNo}</td>
                                    <td>{item.applicantName}</td>
                                    <td>{item.applicantType}</td>
                                    <td>{item.licenseType}</td>
                                    <td>{item.drivingIssueAuthority}</td>
                                    <td>{item.nid}</td>
                                    <td>{helper.dDate(item.applicationDate)}</td>
                                    <td><span className={`badge bg-${item.applicationStatusColor}`}>{item.applicationStatus}</span></td>
                                    <td className="text-center flex flex-wrap gap-2 justify-center">

                                        <OverlayTrigger overlay={<Tooltip>{t('viewDetails')}</Tooltip>}>
                                            <button onClick={() => openModal(item)} className="btn btn-sm rounded-full text-xs btn-outline-dark">
                                                <i className="fa fa-eye"></i>
                                            </button>
                                        </OverlayTrigger>

                                        {/* <button onClick={handleDownload} className='btn btn-sm rounded-full text-xs btn-warning'><i className="fa fa-download"></i></button> */}

                                        {(item.applicationStatusCode === 'dl_app_draft') && (
                                            <OverlayTrigger overlay={<Tooltip>{t('edit')}</Tooltip>}>
                                            <button onClick={() => navigate(`/applicant-panel/driving-license/new-driving-license/application-page1/${item.serviceRequestNo}`)} className='btn btn-sm rounded-full text-[12px] btn-outline-info'>
                                                <i className="fa fa-pen"></i>
                                            </button>
                                        </OverlayTrigger>
                                        )}

                                        {(item.applicationStatusCode === 'dl_app_pending' || item.applicationStatusCode === 'dl_app_final_approved') && (
                                            <OverlayTrigger overlay={<Tooltip>{t('viewDetails')}</Tooltip>}>
                                                <button onClick={() => navigate(`/applicant-panel/driving-license/new-driving-license/reports/${item.serviceRequestNo}`)} className="btn btn-sm btn-rounded text-xs btn-outline-dark">
                                                    Report
                                                </button>
                                            </OverlayTrigger>
                                        )}

                                        {!item.isLicenseFeePaid && item.applicationStatusCode === 'dl_app_primary_approved' && (
                                            <OverlayTrigger overlay={<Tooltip>{t('Submit Application')}</Tooltip>}>
                                                <button onClick={() => navigate(`/applicant-panel/driving-license/new-driving-license/payment-for-smart-card-driving-license-issue/${item.serviceRequestNo}`)} className="btn btn-sm text-xs btn-outline-primary">
                                                    Apply for Smart Card
                                                </button>
                                            </OverlayTrigger>
                                        )}

                                    </td>
                                </tr>
                            ))}
                            {listData && listData.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="text-center text-danger text-slate-500">
                                        <i className="fa fa-exclamation-circle"></i> {t('no_data_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end m-4">
                    <Pagination size="sm">{renderPagination()}</Pagination>
                </div>

                <DLApprovalModal
                    show={modalOpen}
                    onHide={handleCloseModal}
                    onSave={handleSave}
                    editData={editData}
                />


            </div>
        </>
    )
}

export default withNamespaces()(DLRegistrationApprovalList)
