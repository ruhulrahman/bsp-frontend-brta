import Loading from '@/components/common/Loading';
import ReactSelect from '@/components/ui/ReactSelect';
import i18n from '@/i18n';
import { setListData, setLoading, toggleShowFilter } from '@/store/commonSlice';
import RestApi from '@/utils/RestApi';
import helpers, { toaster } from '@/utils/helpers.js';
import { toBengaliNumber } from 'bengali-number';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Pagination from 'react-bootstrap/Pagination';
import Tooltip from 'react-bootstrap/Tooltip';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import AddNew from './AddNew';
import ViewDetails from './ViewDetails';
import { Dropdown } from 'react-bootstrap';

const VehicleRelatedServiceFeesList = ({ t }) => {

    const dispatch = useDispatch();
    const { activeStatusList, loading, dropdowns, listData, windowSize, yesNoList, pagination, showFilter } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const toggleFilter = () => {
        dispatch(toggleShowFilter());
    }

    const [paginationObj, setPaginationObj] = useState({
        currentPage: 0,
        perPage: 5,
        totalRows: 0,
        totalPages: 0,
        slOffset: 1,
    })

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

    // useEffect(() => {
    //     dispatch(setResetPagination())
    // }, []);

    useEffect(() => {
        getListData()
        getAllServiceList()
    }, [currentPage]);

    const [allServiceList, setAllServiceList] = useState([]);
    const getAllServiceList = async () => {

        const parentServiceCode = 'vehicle_related_fees'
        try {
            const { data } = await RestApi.get(`api/v1/admin/configurations/service/all-active-child-services-with-additional/${parentServiceCode}`)
            if (data.success) {
                if (data.data.length > 0) {
                    setAllServiceList(data.data)
                }
            }
        } catch (error) {
            console.log('error', error)
        }
    }

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
        serviceId: '',
        effectiveStartDate: '',
        effectiveEndDate: '',
        isAirCondition: '',
        isHire: '',
        isElectricVehicle: '',
        isApplicableForMultipleVehicleOwner: '',
        cc: '',
        seat: '',
        weight: '',
        kw: '',
        isActive: '',
    })

    const resetSearchValues = {
        serviceId: '',
        effectiveStartDate: '',
        effectiveEndDate: '',
        isAirCondition: '',
        isHire: '',
        isElectricVehicle: '',
        isApplicableForMultipleVehicleOwner: '',
        cc: '',
        seat: '',
        weight: '',
        kw: '',
        isActive: '',
    }

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

    const [serviceIds, setServiceIds] = useState([])

    const getListData = async (values = searchValues) => {

        const params = Object.assign({ page: currentPage, size: pagination.perPage }, values)

        dispatch(setLoading(true));
        dispatch(setListData([]));
        try {
            const { data } = await RestApi.get('api/v1/admin/configurations/vehicle-related-service-fees/list', { params })
            console.log('data', data.data)
            dispatch(setListData(data.data.list.content));
            setPaginationData(data.data.list)
            setServiceIds(data.data.serviceIds);
        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

    const deleteData = (data) => {
        console.log("deleteData", data);
        Swal.fire({
            title: `${t('are_you_sure_to_delete_this')}`,
            text: t('you_will_not_be_able_to_revert_this'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t('yes'),
            cancelButtonText: t('no'),
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {

                dispatch(setLoading(true));
                try {
                    await RestApi.delete(`api/v1/admin/configurations/vehicle-related-service-fees/delete/${data.id}`)

                    Swal.fire({
                        title: t('deleted'),
                        text: t('your_data_has_been_deleted'),
                        icon: "success",
                        confirmButtonText: t('ok'),
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    });

                    const newListData = listData.filter(item => item.id != data.id);

                    if (newListData.length === 0) {
                        if (currentPage != 0) {
                            setCurrentPage(currentPage - 1);
                        }
                    }
                    dispatch(setListData(newListData));
                } catch (error) {
                    console.log('error', error)
                } finally {
                    dispatch(setLoading(false));
                }
            }
        });
    }

    const [formOpen, setFormOpen] = useState(false)

    const toggleFormOpen = (value) => {
        setFormOpen(value);
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const handleOpenAddModal = () => {
        setEditData(null);
        setModalOpen(true);
    };

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const handleOpenViewDetailsModal = (item) => {
        setViewData(item);
        setViewModalOpen(true);
    };

    const handleCloseViewDetailsModal = () => {
        setViewModalOpen(false);
        setViewData(null); // Reset edit data
    }

    const handleOpenEditModal = (item) => {
        setEditData(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditData(null); // Reset edit data
    };


    const handleSave = async (values, setSubmitting, resetForm, setErrors) => {

        try {
            let result = ''
            if (values.id) {
                result = await RestApi.put(`api/v1/admin/configurations/vehicle-related-service-fees/update/${values.id}`, values)
            } else {
                result = await RestApi.post('api/v1/admin/configurations/vehicle-related-service-fees/create', values)
            }

            if (result.data.success) {
                toaster(result.data.message)
                handleCloseModal();
                getListData()
            }

        } catch (error) {
            console.log('error', error)
            if (error.response && error.response.data) {
                setErrors(error.response.data)
            }
        } finally {
            setSubmitting(false)
        }
    };

    const generateVehicleServiceRules = async () => {

        try {
            let result = await RestApi.post(`api/v1/admin/configurations/vehicle-related-service-fees/generate-vehicle-service-fees-rules`)

            console.log('result', result)

        } catch (error) {
            console.log('error', error)
        }
    };

    return (
        <>
            {showFilter &&
                <div className="card bg-gray-300 mb-3">
                    <div className="card-body p-2">
                        <div className="row mb-1">
                            <div className="col">
                                <h5 className='text-dark font-semibold'>{t('search_filter')}</h5>
                            </div>
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
                                    <div className="row">
                                        <div className="col-md-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="serviceId">
                                                <Field
                                                    name="serviceId"
                                                    component={ReactSelect}
                                                    options={allServiceList}
                                                    placeholder={t('selectService')}
                                                    value={values.serviceId}
                                                    onChange={(option) => {
                                                        setFieldValue('serviceId', option ? option.value : '')
                                                    }} // Update Formik value
                                                />
                                                <ErrorMessage name="serviceId" component="div" className="text-danger" />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="vehicleTypeId">
                                                <Field
                                                    name="vehicleTypeId"
                                                    component={ReactSelect}
                                                    options={dropdowns.vehicleTypeList}
                                                    placeholder={t('selectVehicleType')}
                                                    value={values.vehicleTypeId}
                                                    onChange={(option) => {
                                                        setFieldValue('vehicleTypeId', option ? option.value : '')
                                                    }}
                                                />
                                                <ErrorMessage name="vehicleTypeId" component="div" className="text-danger" />
                                            </Form.Group>
                                        </div>
                                        {/* <div className="col-md-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="isElectricVehicle">
                                                <Field
                                                    name="isElectricVehicle"
                                                    component={ReactSelect}
                                                    options={yesNoList}
                                                    placeholder={t('selectElectricVehicle')}
                                                    value={values.isElectricVehicle}
                                                    onChange={(option) => {
                                                        setFieldValue('isElectricVehicle', option ? option.value : '')
                                                    }}
                                                />
                                            </Form.Group>
                                        </div> */}
                                        <div className="col-md-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="isApplicableForMultipleVehicleOwner">
                                                <Field
                                                    name="isApplicableForMultipleVehicleOwner"
                                                    component={ReactSelect}
                                                    options={yesNoList}
                                                    placeholder={t('selectApplicableForMultipleVehicleOwner')}
                                                    value={values.isApplicableForMultipleVehicleOwner}
                                                    onChange={(option) => {
                                                        setFieldValue('isApplicableForMultipleVehicleOwner', option ? option.value : '')
                                                    }}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="isAirCondition">
                                                <Field
                                                    name="isAirCondition"
                                                    component={ReactSelect}
                                                    options={yesNoList}
                                                    placeholder={t('selectAirCondition')}
                                                    value={values.isAirCondition}
                                                    onChange={(option) => {
                                                        setFieldValue('isAirCondition', option ? option.value : '')
                                                    }}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="isHire">
                                                <Field
                                                    name="isHire"
                                                    component={ReactSelect}
                                                    options={yesNoList}
                                                    placeholder={t('selectHire')}
                                                    value={values.isHire}
                                                    onChange={(option) => {
                                                        setFieldValue('isHire', option ? option.value : '')
                                                    }}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="isActive">
                                                <Field
                                                    name="isActive"
                                                    component={ReactSelect}
                                                    options={activeStatusList}
                                                    placeholder={t('selectActiveStatus')}
                                                    value={values.isActive}
                                                    onChange={(option) => {
                                                        setFieldValue('isActive', option ? option.value : '')
                                                    }} // Update Formik value
                                                />
                                            </Form.Group>
                                        </div>
                                        {/* <div className="col-md-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="nameEn">
                                                <Field type="text" name="nameEn" className="form-control" placeholder={t('enterName')} />
                                                <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                            </Form.Group>
                                        </div> */}
                                        <div className="col-md-3 col-sm-12">
                                            <div className="flex">
                                                <div className="flex-1">
                                                    <button type='submit' className="btn btn-success btn-sm w-full">{t('search')}</button>
                                                </div>
                                                <div className="flex-1 ml-2">
                                                    <button type='reset' onClick={() => handleReset(resetForm, values)} className="btn btn-outline-danger btn-sm w-full">{t('clear')}</button>
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
            <div className=" text-slate-700 card bg-white shadow-md rounded-xl">
                <div className='row m-1'>
                    <div className="col-md-8 col-sm-12">
                        <h3 className="text-lg font-semibold text-green-600">{t('vehicleRelatedServiceFees')}</h3>
                        <p className="text-slate-500">{t('review_each_data_before_edit_or_delete')}</p>
                        <span className="badge bg-success">{t('totalRecords')}: {totalElements}</span>
                    </div>
                    <div className="col-md-4 col-sm-12 text-right">
                        <OverlayTrigger overlay={<Tooltip>{t('toggle_search_filter')}</Tooltip>}>
                            <button className="btn btn-success btn-rounded btn-sm mr-2" onClick={toggleFilter}><i className="fa fa-filter"></i></button>
                        </OverlayTrigger>

                        {/* <button className='btn btn-black btn-rounded btn-sm' onClick={generateVehicleServiceRules}>Generate Vehicle Service Rules</button> */}
                        <button className='btn btn-black btn-rounded btn-sm' onClick={handleOpenAddModal}>{t('add_new')}</button>
                        <AddNew
                            show={modalOpen}
                            onHide={handleCloseModal}
                            onSave={handleSave}
                            editData={editData}
                            serviceIds={serviceIds}
                            allServiceList={allServiceList}
                        />


                        <ViewDetails
                            show={viewModalOpen}
                            onHide={handleCloseViewDetailsModal}
                            onSave={handleSave}
                            viewData={viewData}
                        />
                    </div>
                </div>
                <div className="p-0 overflow-auto min-h-[300px]">
                    <Loading loading={loading} />
                    <table className="mt-2 text-left table table-responsive">
                        <thead>
                            <tr>
                                <th>{t('sl')}</th>
                                <th>{t('service')}</th>
                                <th className='text-center'>{t('vehicleTypes')}</th>
                                <th className='text-center'>{t('cc')}</th>
                                <th className='text-center'>{t('seat')}</th>
                                <th className='text-center'>{t('weight')}</th>
                                <th className='text-center'>{t('kw')}</th>
                                <th className='text-center'>{t('mainFee')}</th>
                                <th className='text-center'>{t('effectiveStartDate')}</th>
                                <th className='text-center'>{t('effectiveEndDate')}</th>
                                <th>{t('status')}</th>
                                <th className='text-center min-w-[120px]'>{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {listData && listData.map((item, index) => (
                                <tr key={item.id} className='text-slate-500 text-sm'>
                                    {/* <td>{slOffset + index}.</td> */}
                                    {/* <td>{toBengaliNumber(slOffset + index)}.</td> */}
                                    <td>{currentLanguage === 'en' ? slOffset + index : toBengaliNumber(slOffset + index)}.</td>
                                    <td>{currentLanguage === 'en' ? item.serviceNameEn : item.serviceNameBn}</td>
                                    <td className='text-center'>
                                        {
                                            item.vehicleTypes && item.vehicleTypes.length > 0 && item.vehicleTypes.map((vehicleType) => (
                                                <span className={`badge bg-secondary rounded-full mr-2`}> {currentLanguage === 'en' ? vehicleType.nameEn : vehicleType.nameBn}</span>
                                            ))
                                        }
                                    </td>
                                    <td className='text-center'>
                                        {item.ccMin && item.ccMax ? (
                                            `${item.ccMin} - ${item.ccMax}`
                                        ) : item.ccMin && !item.ccMax ? (
                                            `${item.ccMin}-Above`
                                        ) : !item.ccMin && item.ccMax ? (
                                            `${item.ccMax}-Below`
                                        ) : (
                                            'N/A' // Default fallback if both ccMin and ccMax are missing
                                        )}
                                    </td>
                                    <td className='text-center'>
                                        {item.seatMin && item.seatMax ? (
                                            `${item.seatMin} - ${item.seatMax}`
                                        ) : item.seatMin && !item.seatMax ? (
                                            `${item.seatMin}-Above`
                                        ) : !item.seatMin && item.seatMax ? (
                                            `${item.seatMax}-Below`
                                        ) : (
                                            'N/A' // Default fallback if both seatMin and seatMax are missing
                                        )}
                                    </td>
                                    <td className='text-center'>
                                        {item.weightMin && item.weightMax ? (
                                            `${item.weightMin} - ${item.weightMax}`
                                        ) : item.weightMin && !item.weightMax ? (
                                            `${item.weightMin}-Above`
                                        ) : !item.weightMin && item.weightMax ? (
                                            `${item.weightMax}-Below`
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className='text-center'>
                                        {item.kwMin && item.kwMax ? (
                                            `${item.kwMin} - ${item.kwMax}`
                                        ) : item.kwMin && !item.kwMax ? (
                                            `${item.kwMin}-Above`
                                        ) : !item.kwMin && item.kwMax ? (
                                            `${item.kwMax}-Below`
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className='text-center'>{currentLanguage === 'en' ? item.mainFee : toBengaliNumber(item.mainFee)}</td>
                                    <td className='text-center'>{helpers.dDate(item.effectiveStartDate)}</td>
                                    <td className='text-center'>{helpers.dDate(item.effectiveEndDate)}</td>
                                    <td>
                                        <span className={`badge ${item.isActive ? 'bg-success' : 'bg-danger'} rounded-full`}> {item.isActive ? t('active') : t('inactive')}</span>
                                    </td>
                                    <td className='text-center'>
                                        {/* <Dropdown className="">
                                            <Dropdown.Toggle id="dropdown-autoclose-true" className="!bg-transparent btn after:border-0 text-black !p-2">
                                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleOpenViewDetailsModal(item)} className='btn btn-sm'>
                                                    <OverlayTrigger overlay={<Tooltip>{t('viewDetails')}</Tooltip>}>
                                                        <>
                                                            <i className="fa fa-eye text-black mr-2"></i>{t('viewDetails')}
                                                        </>
                                                    </OverlayTrigger>
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleOpenEditModal(item)} className='btn btn-sm'>
                                                    <OverlayTrigger overlay={<Tooltip>{t('edit')}</Tooltip>}>
                                                        <>
                                                            <i className="fa fa-pen text-cyan-500 mr-2"></i>{t('edit')}
                                                        </>
                                                    </OverlayTrigger>
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => deleteData(item)} className='btn btn-sm'>
                                                    <OverlayTrigger overlay={<Tooltip>{t('delete')}</Tooltip>}>
                                                        <>
                                                            <i className="fa fa-trash text-red-500 mr-2"></i>{t('delete')}
                                                        </>
                                                    </OverlayTrigger>
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown> */}
                                        <OverlayTrigger overlay={<Tooltip>{t('viewDetails')}</Tooltip>}>
                                            <button onClick={() => handleOpenViewDetailsModal(item)} className='btn btn-rounded btn-sm text-[12px] btn-outline-dark'>
                                                <i className="fa fa-eye"></i>
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip>{t('edit')}</Tooltip>}>
                                            <button onClick={() => handleOpenEditModal(item)} className='btn btn-rounded btn-sm text-[12px] btn-outline-info ml-1'>
                                                <i className="fa fa-pen"></i>
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip>{t('delete')}</Tooltip>}>
                                            <button onClick={() => deleteData(item)} className='btn btn-rounded btn-sm text-[12px] btn-outline-danger ml-1'>
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            ))}

                            {listData && listData.length === 0 && (
                                <tr>
                                    <td colSpan={12} className="text-center text-danger text-slate-500">
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
            </div>
        </>
    )
}

export default withNamespaces()(VehicleRelatedServiceFeesList)
