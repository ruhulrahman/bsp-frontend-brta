import React, { useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import Pagination from 'react-bootstrap/Pagination'
import AddNew from './AddNew';
import Loading from '@/components/common/Loading';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import helpers, { toaster } from '@/utils/helpers.js';
import { setLoading, setListData, setCurrentPage, setPaginationData } from '@/store/commonSlice';

const DesignationList = () => {
const { t } = useTranslation();

    const dispatch = useDispatch();
    const { statusList, loading, listData, pagination } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    // const [currentPage, setCurrentPage] = useState(0);  // Spring Boot uses 0-based page numbers
    const [pageSize, setPageSize] = useState(5);       // Default page size
    const [totalPages, setTotalPages] = useState(0);    // Total pages from Spring response
    const [totalElements, setTotalElements] = useState(0);  // Total items

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page))
    };

    useEffect(() => {
        getListData()
    }, [pagination.currentPage]);

    // Render pagination using React Bootstrap Pagination
    const renderPagination = () => {
        let items = [];

        items.push(
            <Pagination.First
                key="first"
                onClick={() => handlePageChange(0)}
                disabled={pagination.currentPage === 0}
            />
        );

        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
            />
        );

        // Ellipsis Logic (similar to previous example)
        const windowSize = 5;
        const maxLeft = Math.max(pagination.currentPage - Math.floor(windowSize / 2), 0);
        const maxRight = Math.min(pagination.currentPage + Math.floor(windowSize / 2), pagination.totalPages - 1);

        if (maxLeft > 0) {
            items.push(
                <Pagination.Item key={0} onClick={() => handlePageChange(0)}>
                    1
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
                    active={i === pagination.currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i + 1}
                </Pagination.Item>
            );
        }

        if (maxRight < pagination.totalPages - 1) {
            if (maxRight < pagination.totalPages - 2) {
                items.push(<Pagination.Ellipsis key="right-ellipsis" />);
            }
            items.push(
                <Pagination.Item
                    key={pagination.totalPages - 1}
                    onClick={() => handlePageChange(pagination.totalPages - 1)}
                >
                    {pagination.totalPages}
                </Pagination.Item>
            );
        }

        items.push(
            <Pagination.Next
                key="next"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages - 1}
            />
        );

        items.push(
            <Pagination.Last
                key="last"
                onClick={() => handlePageChange(pagination.totalPages - 1)}
                disabled={pagination.currentPage === pagination.totalPages - 1}
            />
        );

        return items;
    };

    const [searchValues, setSearchValues] = useState({
        nameEn: '',
        isActive: '',
    });

    const resetSearchValues = {
        nameEn: '',
        isActive: '',
    };

    const inputOnChange = (e) => {
        console.log('e', e)
        const { name, value } = e.target;
        setSearchValues((prevValues) => ({
            ...prevValues,
            [name]: value, // Update specific field based on name
        }));
    }

    const clearSearchFields = () => {
        setSearchValues({
            nameEn: '',
            isActive: ''
        });
    };

    // Custom clear method to reset the form
    const clearData = (resetForm) => {
        resetForm({
            values: resetSearchValues, // Reset to initial values
        }); // Resets the form fields
        setSearchValues(resetSearchValues); // Resets the search values
        getListData(); // Re-fetches the data with the cleared search values
        console.log('Form has been cleared');
    };

    const handleReset = (resetForm) => {
        resetForm({
            values: resetSearchValues, // Reset to initial values
        });
        getListData()
    };

    const searchData = (values) => {
        // setSearchValues(values);
        getListData(values)
    }

    const getListData = async (values = searchValues) => {

        const params = Object.assign({ page: pagination.currentPage, size: pagination.perPage }, values)
        console.log('params', params)

        dispatch(setLoading(true));
        dispatch(setListData([]));
        try {
            const { data } = await RestApi.get('api/v1/admin/configurations/designation/list', { params })
            // console.log('data ==', data)
            dispatch(setListData(data.content));
            dispatch(setPaginationData(data));
            helper.paginationData(data)
            // setCurrentPage(data.page);  // Spring Boot uses 0-based page numbers
            // setPageSize(data.size);       // Default page size
            setTotalPages(data.totalPages);    // Total pages from Spring response
            setTotalElements(data.totalElements);
        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    }

    const deleteData = (data) => {
        console.log("deleteData", data);
        Swal.fire({
            title: t('are_you_sure_to_delete_this'),
            text: t('you_will_not_be_able_to_revert_this'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#15803D",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.isConfirmed) {

                console.log("deleteData", data);
                // confirmDeleteData(data.id)
                dispatch(setLoading(true));
                try {
                    await RestApi.post(`api/v1/admin/configurations/designation/delete/${data.id}`)

                    Swal.fire({
                        title: t('deleted'),
                        text: t('your_data_has_been_deleted'),
                        icon: "success"
                    });

                    getListData()
                } catch (error) {
                    console.log('error', error)
                } finally {
                    dispatch(setLoading(false));
                }
            }
        });
    }

    const confirmDeleteData = async (id) => {
        dispatch(setLoading(true));
        try {
            await RestApi.post('api/v1/designation/create', { id })
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
    const [editData, setEditData] = useState(null);

    const handleOpenAddModal = () => {
        setEditData(null);
        setModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setEditData(user);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditData(null); // Reset edit data
    };


    const handleSave = async (values) => {
        console.log('Form submitted:', values);
        // onSave(values);
        dispatch(setLoading(true));
        // let result = ''
        try {
            console.log('values', values)
            // if (values.id) {
            //     // result = await RestApi.post('api/v1/admin/configurations/designation/create', values)
            //     result = await RestApi.post('api/v1/designation/create', values)
            // } else {
            //     result = await RestApi.post('api/v1/designation/create', values)
            // }

            const { data } = await RestApi.post('api/v1/designation/create', values)
            if (data.success) {
                toaster(data.message)
                handleCloseModal();
                getListData()
            }

        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            dispatch(setLoading(false));
        }
    };

    const [showFilter, setShowFilter] = useState(true)

    const toggleFilter = () => {
        setShowFilter(!showFilter)
    }




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
                            {({ values, resetForm }) => (
                                <FormikForm>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <Form.Group className="mb-3" controlId="nameEn">
                                                <Field type="text" name="nameEn" className="form-control" placeholder="Enter name" />
                                                <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Group className="mb-3" controlId="nameEn">
                                                <Field
                                                    component="select"
                                                    id="location"
                                                    name="isActive"
                                                    multiple={false}
                                                    className="w-full rounded-md"
                                                >
                                                    <option value="">{t('select')}</option>
                                                    {statusList.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {currentLanguage === 'en' ? option.nameEn : option.nameBn}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="flex">
                                                <div className="flex-1">
                                                    <button type='submit' className="btn btn-success btn-sm w-full">{t('search')}</button>
                                                </div>
                                                <div className="flex-1 ml-2">
                                                    <button type='reset' onClick={() => handleReset(resetForm)} className="btn btn-outline-danger btn-sm w-full">{t('clear')}</button>
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
                        <h3 className="text-lg font-semibold text-green-600">{t('designationList')}</h3>
                        <p className="text-slate-500">{t('review_each_data_before_edit_or_delete')}</p>
                        <span className="badge bg-success">{t('totalRecords')}: {totalElements}</span>
                    </div>
                    <div className="col-md-4 col-sm-12 text-right">
                        <OverlayTrigger
                            overlay={
                                <Tooltip>
                                    Toogle {t('search_filter')}
                                </Tooltip>
                            }
                        >
                            <button className="btn btn-success btn-rounded btn-sm mr-2" onClick={toggleFilter}><i className="fa fa-filter"></i></button>
                        </OverlayTrigger>

                        <button className='btn btn-black btn-rounded btn-sm' onClick={handleOpenAddModal}>{t('add_new')}</button>
                        <AddNew
                            show={modalOpen}
                            onHide={handleCloseModal}
                            onSave={handleSave}
                            editData={editData}
                        />
                    </div>
                </div>
                <div className="p-0 overflow-auto min-h-[300px]">
                    <Loading loading={loading} />
                    <table className="table-auto min-w-full text-left border border-gray-200">
                        <thead>
                            <tr>
                                <th>{t('sl')}</th>
                                <th>{t('name') + ` (${t('en')})`}</th>
                                <th>{t('name') + ` (${t('bn')})`}</th>
                                <th>{t('level')}</th>
                                <th>{t('status')}</th>
                                <th>{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {listData && listData.map((item, index) => (
                                <tr key={item.id} className='text-slate-500 text-sm'>
                                    {/* <td>{index + 1}</td> */}
                                    <td>{pagination.slOffset + index}</td>
                                    <td>{item.nameEn}</td>
                                    <td>{item.nameBn}</td>
                                    <td>{item.levelNumber}</td>
                                    <td>
                                        <span className={`badge ${item.isActive ? 'bg-success' : 'bg-danger'}`}> {item.isActive ? t('active') : t('inactive')}</span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleOpenEditModal(item)} className='btn btn-rounded btn-sm text-[12px] btn-outline-info'>
                                            <i className="fa fa-pen"></i>
                                        </button>
                                        <button onClick={() => deleteData(item)} className='btn btn-sm  btn-rounded text-[12px] btn-outline-danger ml-1'>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {listData && listData.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center text-slate-500">
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

export default (DesignationList)
