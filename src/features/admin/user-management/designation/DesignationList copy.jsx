import React, { useEffect, useState } from 'react';
// import Badge from 'react-bootstrap/Badge';
import { withNamespaces } from 'react-i18next';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import Pagination from 'react-bootstrap/Pagination'
import AddNew from './AddNew';
import Loading from '@/components/common/Loading';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Select from 'react-select';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import { MultiSelect } from "react-multi-select-component";
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import { toaster } from '@/utils/helpers.js';
import { setLoading, setListData } from '@/store/commonSlice';
import ReactPaginate from 'react-paginate';

const DesignationList = ({ t }) => {

    const dispatch = useDispatch();
    const { statusList, loading, listData } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [currentPage, setCurrentPage] = useState(0);  // Spring Boot uses 0-based page numbers
    const [pageSize, setPageSize] = useState(10);       // Default page size
    const [totalPages, setTotalPages] = useState(0);    // Total pages from Spring response
    const [totalElements, setTotalElements] = useState(0);  // Total items

    // Handle page change
    const handlePageChange = (page) => {
        console.log('Page', page);
        setCurrentPage(page);
        console.log('currentPage ==', currentPage);
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


    useEffect(() => {
        getListData()
    }, []);

    const getListData = async (values = searchValues) => {

        const params = Object.assign({ page: currentPage, size: pageSize }, values)
        console.log('params', params)

        dispatch(setLoading(true));
        dispatch(setListData([]));
        try {
            // const result = await RestApi.get('api/v1/designation/list', { params })
            const { data } = await RestApi.get('api/search-designation', { params })
            if (data.success) {
                dispatch(setListData(data.data.content));
                setCurrentPage(data.data.page);  // Spring Boot uses 0-based page numbers
                setPageSize(data.data.size);       // Default page size
                setTotalPages(data.data.totalPages);    // Total pages from Spring response
                setTotalElements(data.data.totalElements);
            }
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
        }).then((result) => {
            if (result.isConfirmed) {
                // const updatedUsers = users.filter(user => user.id !== data.id);
                // setUsers(updatedUsers);

                Swal.fire({
                    title: t('deleted'),
                    text: t('your_data_has_been_deleted'),
                    icon: "success"
                });

                getListData()
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

    const targetHeight = 30;

    const styles = {
        control: (base) => ({
            ...base,
            minHeight: 'initial',
        }),
        valueContainer: (base) => ({
            ...base,
            height: `${targetHeight - 1 - 1}px`,
            padding: '0 8px',
        }),
        clearIndicator: (base) => ({
            ...base,
            padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
        }),
    };

    const customControlStyles = base => ({
        height: 20,
        minHeight: 20
    });

    const customThemeFn = (theme) => ({
        ...theme,
        spacing: {
            ...theme.spacing,
            controlHeight: 30,
            baseUnit: 1
        }
    })

    const customStyles = {
        container: (provided) => ({
            ...provided,
            display: 'inline-block',
            width: '100%',
            minHeight: '1px',
            textAlign: 'left',
            border: 'none',
        }),
        control: (provided) => ({
            ...provided,
            border: '1px solid #dee2e6',
            borderRadius: '0',
            minHeight: '1px',
            height: '32px',
        }),
        input: (provided) => ({
            ...provided,
            minHeight: '1px',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            minHeight: '1px',
            paddingTop: '0',
            paddingBottom: '0',
            color: '#757575',
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            minHeight: '1px',
            height: '24px',
        }),
        clearIndicator: (provided) => ({
            ...provided,
            minHeight: '1px',
        }),
        valueContainer: (provided) => ({
            ...provided,
            minHeight: '1px',
            height: '32px',
            paddingTop: '0',
            paddingBottom: '0',
        }),
        singleValue: (provided) => ({
            ...provided,
            minHeight: '1px',
            paddingBottom: '2px',
        }),
    };

    const [selected, setSelected] = useState([]);


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
        const windowSize = 5;
        const maxLeft = Math.max(currentPage - Math.floor(windowSize / 2), 0);
        const maxRight = Math.min(currentPage + Math.floor(windowSize / 2), totalPages - 1);

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
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i + 1}
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
                                // You can reset the form here as well after submission
                                // handleReset(resetForm);
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
                        <h3 className="text-lg font-semibold text-slate-800">{t('designationList')}</h3>
                        <p className="text-slate-500">{t('review_each_data_before_edit_or_delete')}</p>
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
                        {/* <AddNew formOpen={formOpen} setFormOpen={toggleFormOpen} editItem={editItem} /> */}
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
                                    <td>{index + 1}</td>
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
                <div className='row m-2.5'>
                    <div className="col-md-12 text-right">
                        {/* <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        /> */}
                        <div className="flex items-center justify-end">
                            <div className="flex">
                                <Pagination size='sm'>{renderPagination()}</Pagination>
                            </div>
                        </div>

                        {/* React Bootstrap Pagination Controls */}

                        {/* <Pagination size='sm'
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}>
                            <Pagination.First />
                            <Pagination.Prev />
                            <Pagination.Item>{1}</Pagination.Item>
                            <Pagination.Item active>{2}</Pagination.Item>
                            <Pagination.Item>{3}</Pagination.Item>
                            <Pagination.Ellipsis />
                            <Pagination.Next />
                            <Pagination.Last />
                        </Pagination> */}

                        {/* <ReactPaginate
                            breakLabel="..."
                            nextLabel="next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="< previous"
                            renderOnZeroPageCount={null}
                        /> */}
                    </div>
                </div>
                {/* <div className="flex items-center justify-between p-3">
                    <p className="block text-sm text-slate-500">
                        Page 1 of 10
                    </p>
                    <div className="flex gap-1">

                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button">
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={index === currentPage ? "btn btn-success" : "btn btn-white"}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button">
                            Next
                        </button>
                    </div>
                </div> */}
            </div>
        </>
    )
}

export default withNamespaces()(DesignationList)
