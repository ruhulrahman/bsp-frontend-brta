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
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import AddNew from './AddNew';
import CustomPagination from '@/components/common/CustomPagination';
// import CustomPagination from './CustomPagination';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPermissions, createPermission, updatePermission, updateOrCreatePermission, deletePermission } from './api';

const PermissionList = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const dispatch = useDispatch();
    const { activeStatusList, loading, listData, windowSize, pagination, showFilter, dropdowns, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const toggleFilter = () => {
        dispatch(toggleShowFilter());
    }

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [slOffset, setSlOffset] = useState(1);
    const pageSize = 10; // Adjust as needed

    const setPaginationData = (data) => {
        setCurrentPage(data.page);
        // setPageSize(data.size);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setSlOffset(data.size * (data.page + 1) - data.size + 1);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    };

    const [searchValues, setSearchValues] = useState({
        nameEn: '',
        type: '',
        parentId: '',
        isActive: '',
    });

    const resetSearchValues = {
        nameEn: '',
        type: '',
        parentId: '',
        isActive: '',
    };

    // Fetch data whenever searchValues or currentPage changes
    // useEffect(() => {
    //     getListData();
    // }, [searchValues, currentPage]);

    // Use React Query to fetch the list data
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['permissions', currentPage, searchValues], // Query key
        queryFn: async () => {
            const params = { ...searchValues, page: currentPage, size: pageSize };
            const { data } = await RestApi.get('api/v1/admin/user-management/permission/list', { params });
            console.log('data', data)
            // dispatch(setListData(data.content));
            // setPaginationData(data);
            return data;
        },
        enabled: true,
        keepPreviousData: true, // Keep previous data while fetching new data
        // enabled: true, // This prevents automatic fetching
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        onSuccess: (data) => {
            dispatch(setListData(data.content));
            setPaginationData(data);
        },
        onError: (error) => {
            console.log('error', error)
        }
    });

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

    // const getListData = async (values = searchValues) => {

    //     const params = { ...searchValues, page: currentPage, size: pagination.perPage };

    //     dispatch(setLoading(true));
    //     dispatch(setListData([]));
    //     try {
    //         const { data } = await RestApi.get('api/v1/admin/user-management/permission/list', { params })
    //         dispatch(setListData(data.content));
    //         setPaginationData(data)
    //     } catch (error) {
    //         console.log('error', error)
    //     } finally {
    //         dispatch(setLoading(false));
    //     }
    // }

    const deleteData = (data) => {
        // console.log("deleteData", data);
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

                // dispatch(setLoading(true));
                // deletePermissionMutation.mutate(data.id);
                deleteMutation.mutate(data.id);
                // try {
                //     await RestApi.delete(`api/v1/admin/user-management/permission/delete/${data.id}`)

                //     Swal.fire({
                //         title: t('deleted'),
                //         text: t('your_data_has_been_deleted'),
                //         icon: "success",
                //         confirmButtonText: t('ok'),
                //         customClass: {
                //             confirmButton: 'btn btn-success'
                //         }
                //     });

                //     const newListData = listData.filter(item => item.id != data.id);

                //     if (newListData.length === 0) {
                //         if (currentPage != 0) {
                //             setCurrentPage(currentPage - 1);
                //         }
                //     }
                //     dispatch(setListData(newListData));
                // } catch (error) {
                //     console.log('error', error)
                // } finally {
                //     dispatch(setLoading(false));
                // }
            }
        });
    }

    const deletePermissionMutation = useMutation({
        mutationFn: (id) => deletePermission,
        onSuccess: () => {
            // Invalidate the query to refetch data
            queryClient.invalidateQueries({ queryKey: ['permissions'] });
        },
    });

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


    // const handleSave = async (values, setSubmitting, resetForm, setErrors) => {

    //     try {
    //         let result = ''
    //         if (values.id) {
    //             result = await RestApi.put(`api/v1/admin/user-management/permission/update/${values.id}`, values)
    //         } else {
    //             result = await RestApi.post('api/v1/admin/user-management/permission/create', values)
    //         }

    //         if (result.data.success) {
    //             toaster(result.data.message)
    //             handleCloseModal()
    //             getParentPermissionList();
    //             getListData()
    //         }

    //     } catch (error) {
    //         console.log('error', error)
    //         if (error.response && error.response.data) {
    //             setErrors(error.response.data)
    //         }
    //     } finally {
    //         setSubmitting(false)
    //     }
    // };

    const handleSave = async (values, setSubmitting, resetForm, setErrors) => {

        if (values.id) {
            updateMutation.mutate(values)
        } else {
            createMutation.mutate(values)
        }
    }

    // Create post mutation
    const createMutation = useMutation({
        mutationFn: createPermission,
        onSuccess: () => {
            queryClient.invalidateQueries(["permissions"]); // Refresh the list
        },
    });

    const [editingPermission, setEditingPermission] = useState(null);

    // Update post mutation
    const updateMutation = useMutation({
        mutationFn: updatePermission,
        onSuccess: () => {
            queryClient.invalidateQueries(["permissions"]); // Refresh the list
            setEditingPermission(null); // Clear edit mode
        },
    });

    // Delete post mutation
    const deleteMutation = useMutation({
        mutationFn: deletePermission,
        onSuccess: () => {
            queryClient.invalidateQueries(["permissions"]); // Refresh the list
        },
    });


    const [parentPermissionList, setParentPermissionList] = useState([]);

    useEffect(() => {
        getParentPermissionList()
    }, [])

    const getParentPermissionList = async () => {

        try {
            const { data } = await RestApi.get('api/v1/admin/user-management/permission/parent-list')
            setParentPermissionList(data)
            // console.log('parentPermissionList', parentPermissionList)
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error fetching data.</p>}
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
                                            <Form.Group className="mb-3" controlId="nameEn">
                                                <Field type="text" name="nameEn" className="form-control" placeholder={t('enterName')} />
                                                <ErrorMessage name="nameEn" component="div" className="text-danger" />
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="type">
                                                <Field
                                                    id="type"
                                                    name="type"
                                                    component={ReactSelect}
                                                    options={permissionTypeList}
                                                    placeholder={t('selectPermissionType')}
                                                    value={values.type}
                                                    onChange={(option) => {
                                                        setFieldValue('type', option ? option.value : '')
                                                    }} // Update Formik value
                                                />
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-3 col-sm-12">
                                            <Form.Group className="mb-3" controlId="parentId">
                                                <Field
                                                    id="parentId"
                                                    name="parentId"
                                                    component={ReactSelect}
                                                    options={parentPermissionList}
                                                    placeholder={t('selectParentPermission')}
                                                    value={values.parentId}
                                                    onChange={(option) => {
                                                        setFieldValue('parentId', option ? option.value : '')
                                                    }} // Update Formik value
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
                                    </div>

                                    <div className="row">
                                        <div className="col-md-3 col-sm-12"></div>
                                        <div className="col-md-3 col-sm-12"></div>
                                        <div className="col-md-3 col-sm-12"></div>
                                        <div className="col-md-3 col-sm-12">
                                            <div className="d-flex content-between">
                                                <button type='submit' className="btn btn-success btn-sm w-full mr-2">{t('search')}</button>
                                                <button type='reset' onClick={() => handleReset(resetForm, values)} className="btn btn-outline-danger btn-sm w-full">{t('clear')}</button>
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
                        <h3 className="text-lg font-semibold text-green-600">{t('permissionList')}</h3>
                        <p className="text-slate-500">{t('review_each_data_before_edit_or_delete')}</p>
                        <span className="badge bg-success">{t('totalRecords')}: {data?.totalElements}</span>
                    </div>
                    <div className="col-md-4 col-sm-12 text-right">
                        <OverlayTrigger overlay={<Tooltip>{t('toggle_search_filter')}</Tooltip>}>
                            <button className="btn btn-success btn-rounded btn-sm mr-2" onClick={toggleFilter}><i className="fa fa-filter"></i></button>
                        </OverlayTrigger>

                        <button className='btn btn-black btn-rounded btn-sm' onClick={handleOpenAddModal}>{t('add_new')}</button>
                        <AddNew
                            show={modalOpen}
                            onHide={handleCloseModal}
                            onSave={handleSave}
                            editData={editData}
                            parentPermissionList={parentPermissionList}
                        />
                    </div>
                </div>
                <div className="p-0 relative min-h-[300px]">
                    <Loading loading={loading} />
                    <table className="mt-2 text-left table table-responsive">
                        <thead>
                            <tr>
                                <th>{t('sl')}</th>
                                <th>{t('name') + ` (${t('en')})`}</th>
                                <th>{t('name') + ` (${t('bn')})`}</th>
                                <th>{t('permissionCode')}</th>
                                <th className='text-center'>{t('permissionType')}</th>
                                <th>{t('pageUrl')}</th>
                                <th>{t('parentPermission')}</th>
                                <th>{t('status')}</th>
                                <th className='text-center min-w-[120px]'>{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {data?.content && data.content.map((item, index) => (
                                <tr key={item.id} className='text-slate-500 text-sm'>
                                    {/* <td>{slOffset + index}.</td> */}
                                    {/* <td>{toBengaliNumber(slOffset + index)}.</td> */}
                                    <td>{currentLanguage === 'en' ? slOffset + index : toBengaliNumber(slOffset + index)}.</td>
                                    <td>{item.nameEn}</td>
                                    <td>{item.nameBn}</td>
                                    <td><span className='badge bg-secondary'>{item.permissionCode}</span></td>
                                    <td className='text-center'>{item.typeName}</td>
                                    <td>{item.pageUrl}</td>
                                    <td>
                                        {currentLanguage === 'en' ? item.parentName : item.parentName}
                                    </td>
                                    <td>
                                        <span className={`badge ${item.isActive ? 'bg-success' : 'bg-danger'} rounded-full`}> {item.isActive ? t('active') : t('inactive')}</span>
                                    </td>
                                    <td className='text-center'>
                                        <OverlayTrigger overlay={<Tooltip>{t('edit')}</Tooltip>}>
                                            <button onClick={() => handleOpenEditModal(item)} className='btn btn-rounded btn-sm text-[12px] btn-outline-info'>
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
                                        // totalPages={totalPages}
                                        totalPages={data?.totalPages}
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

export default (PermissionList)
