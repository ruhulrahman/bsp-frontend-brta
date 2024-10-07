import React, { useEffect, useState } from 'react';
import ReactSelect from '@/components/ui/ReactSelect';
import { withNamespaces } from 'react-i18next';
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
import helper, { toaster } from '@/utils/helpers.js';
import { setLoading, setListData, setCurrentPage, setPaginationData, setResetPagination, toggleShowFilter } from '@/store/commonSlice';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import { useNavigate } from 'react-router-dom';

const UserList = ({ t }) => {

    const navigate = useNavigate()

    const dispatch = useDispatch();
    const { activeStatusList, loading, listData, windowSize, pagination, showFilter, dropdowns, permissionTypeList } = useSelector((state) => state.common)
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
        nameEn: '',
        email: '',
        mobile: '',
        userTypeId: '',
        designationId: '',
        isActive: '',
    });

    const resetSearchValues = {
        nameEn: '',
        email: '',
        mobile: '',
        userTypeId: '',
        designationId: '',
        isActive: '',
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

        const params = Object.assign({ page: currentPage, size: pagination.perPage }, values)

        dispatch(setLoading(true));
        dispatch(setListData([]));
        try {
            const { data } = await RestApi.get('api/v1/admin/user-management/user/list', { params })
            dispatch(setListData(data.content));
            setPaginationData(data)
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
                    await RestApi.delete(`api/v1/admin/user-management/user/delete/${data.id}`)

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

    const handleOpenEditModal = (item) => {
        setEditData(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditData(null); // Reset edit data
    };


    const handleSave = async (values, setSubmitting, resetForm) => {

        try {
            let result = ''
            if (values.id) {
                result = await RestApi.put(`api/v1/admin/user-management/user/update/${values.id}`, values)
            } else {
                result = await RestApi.post('api/v1/admin/user-management/user/create', values)
            }

            if (result.data.success) {
                toaster(result.data.message)
                handleCloseModal()
                getListData()
            }

        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setSubmitting(false)
        }
    };

    // const handleMakerChange = (e) => {
    //     setSearchValues({...searchValues, makerId: e.target.value });
    // }



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
                                        <div className="col-md-4 col-lg-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="nameEn">
                                                <Field type="text" name="nameEn" className="form-control" placeholder={t('enterName')} />
                                                <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4 col-lg-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="email">
                                                <Field type="text" name="email" className="form-control" placeholder={t('enterEmail')} />
                                                <ErrorMessage name="email" component="div" className="text-danger" />
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4 col-lg-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="mobile">
                                                <Field type="text" name="mobile" className="form-control" placeholder={t('enterMobile')} />
                                                <ErrorMessage name="mobile" component="div" className="text-danger" />
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4 col-lg-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="userTypeId">
                                                <Field
                                                    name="userTypeId"
                                                    component={ReactSelect}
                                                    options={dropdowns.userTypeList}
                                                    placeholder={t('selectUserType')}
                                                    value={values.userTypeId}
                                                    onChange={(option) => {
                                                        setFieldValue('userTypeId', option ? option.value : '')
                                                    }} // Update Formik value
                                                />
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4 col-lg-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="designationId">
                                                <Field
                                                    name="designationId"
                                                    component={ReactSelect}
                                                    options={dropdowns.designationList}
                                                    placeholder={t('selectDesignation')}
                                                    value={values.designationId}
                                                    onChange={(option) => {
                                                        setFieldValue('designationId', option ? option.value : '')
                                                    }} // Update Formik value
                                                />
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4 col-lg-3 col-sm-12">
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
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 col-lg-3 col-sm-12"></div>
                                        <div className="col-md-4 col-lg-3 col-sm-12"></div>
                                        <div className="col-md-4 col-lg-3 col-sm-12"></div>
                                        <div className="col-md-4 col-lg-3 col-sm-12">
                                            <div className="d-flex content-between">
                                                <button type='submit' className="btn btn-success btn-sm w-full mr-2">{t('search')}</button>
                                                <button type='reset' onClick={() => handleReset(resetForm)} className="btn btn-outline-danger btn-sm w-full">{t('clear')}</button>
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
                        <h3 className="text-lg font-semibold text-slate-800">{t('userList')}</h3>
                        <p className="text-slate-500">{t('review_each_data_before_edit_or_delete')}</p>
                    </div>
                    <div className="col-md-4 col-sm-12 text-right">
                        <OverlayTrigger overlay={<Tooltip>{t('toggle_search_filter')}</Tooltip>}>
                            <button className='btn btn-info btn-rounded btn-sm mr-2' onClick={toggleFilter}><i className="fa fa-filter"></i></button>
                        </OverlayTrigger>

                        {/* <button className='btn btn-black btn-rounded btn-sm' onClick={handleOpenAddModal}>{t('add_new')}</button> */}
                        <button className='btn btn-black btn-rounded btn-sm' onClick={() => navigate(`/admin/user-management/add-or-update-user/${false}`)}>{t('add_new')}</button>
                        <AddNew
                            show={modalOpen}
                            onHide={handleCloseModal}
                            onSave={handleSave}
                            editData={editData}
                        />
                    </div>
                </div>
                <div className="p-0 overflow-scroll relative min-h-[300px]">
                    <Loading loading={loading} />
                    <table className="mt-2 text-left table table-responsive min-w-max">
                        <thead>
                            <tr>
                                <th>{t('sl')}</th>
                                <th>{t('name') + ` (${t('en')})`}</th>
                                <th>{t('name') + ` (${t('bn')})`}</th>
                                <th>{t('email')}</th>
                                <th>{t('mobile')}</th>
                                <th>{t('userType')}</th>
                                <th>{t('designation')}</th>
                                <th>{t('status')}</th>
                                <th className='text-center'>{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {listData && listData.map((item, index) => (
                                <tr key={item.id} className='text-slate-500 text-sm'>
                                    {/* <td>{slOffset + index}.</td> */}
                                    {/* <td>{toBengaliNumber(slOffset + index)}.</td> */}
                                    <td>{currentLanguage === 'en' ? slOffset + index : toBengaliNumber(slOffset + index)}.</td>
                                    <td>{item.nameEn}</td>
                                    <td>{item.nameBn}</td>
                                    <td>{item.email}</td>
                                    <td>{currentLanguage === 'en' ? item.mobile : toBengaliNumber(item.mobile)}</td>
                                    <td>
                                        {currentLanguage === 'en' ? item.userTypeNameEn : item.userTypeNameBn}
                                    </td>
                                    <td>
                                        {currentLanguage === 'en' ? item.designationNameEn : item.designationNameBn}
                                    </td>
                                    <td>
                                        <span className={`badge ${item.isActive ? 'bg-success' : 'bg-danger'} rounded-full`}> {item.isActive ? t('active') : t('inactive')}</span>
                                    </td>
                                    <td className='text-center'>
                                        {/* <OverlayTrigger overlay={<Tooltip>{t('edit')}</Tooltip>}>
                                            <button onClick={() => handleOpenEditModal(item)} className='btn btn-sm text-[12px] btn-outline-info'>
                                                <i className="fa fa-pen"></i>
                                            </button>
                                        </OverlayTrigger> */}
                                        <OverlayTrigger overlay={<Tooltip>{t('viewDetails')}</Tooltip>}>
                                            <button onClick={() => navigate(`/admin/user-management/add-or-update-user/${true}/${item.id}`)} className='btn btn-sm text-[12px] btn-outline-dark mr-1'>
                                                <i className="fa fa-eye"></i>
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip>{t('edit')}</Tooltip>}>
                                            <button onClick={() => navigate(`/admin/user-management/add-or-update-user/${false}/${item.id}`)} className='btn btn-sm text-[12px] btn-outline-info'>
                                                <i className="fa fa-pen"></i>
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip>{t('delete')}</Tooltip>}>
                                            <button onClick={() => deleteData(item)} className='btn btn-sm text-[12px] btn-outline-danger ml-1'>
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </OverlayTrigger>
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
                <div className='row m-2.5'>
                    <div className="col-md-12 text-right">
                        <div className="flex items-center justify-end">
                            <div className="flex">
                                <Pagination size='sm'>{renderPagination()}</Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withNamespaces()(UserList)
