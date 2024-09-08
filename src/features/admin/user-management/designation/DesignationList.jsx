import React, { useEffect, useState } from 'react';
// import Badge from 'react-bootstrap/Badge';
import { withNamespaces } from 'react-i18next';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// import Pagination from 'react-bootstrap/Pagination'
import AddNew from './AddNew';
import Loading from '@/components/common/Loading';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Select from 'react-select';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import { MultiSelect } from "react-multi-select-component";
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import { toaster } from '@/utils/helpers.js';

const DesignationList = ({ t }) => {

    const { statusList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const options = [
        { value: 'Dhaka Metro-1', label: 'Dhaka Metro-1' },
        { value: 'Dhaka Metro-2', label: 'Dhaka Metro-2' },
        { value: 'Dhaka Metro-3', label: 'Dhaka Metro-3' },
        { value: 'Dhaka Metro-4', label: 'Dhaka Metro-4' }
    ]

    const [initialSearchValues, setInitialSearchValues] = useState({
        nameEn: '',
        nameBn: '',
        is_active: '',
    })

    const resetSearchValues = {
        nameEn: '',
        nameBn: '',
        is_active: '',
    };

    const inputOnChange = (e) => {
        console.log('e', e)
        const { name, value } = e.target;
        // console.log('name', value)
        setInitialSearchValues({
            ...initialSearchValues,
            [name]: value
        })
    }

    // const [selectedOption, setSelectedOption] = useState(null);

    const selectOnChange = (selectedOption) => {
        console.log('selectedOption', selectedOption);
        setInitialSearchValues({
            ...initialSearchValues,
            office: selectedOption ? selectedOption.value : ''
        });
    };

    const searchData = () => {
        console.log("searchData", initialSearchValues);
        getListData()
    }

    const clearSearchFields = () => {
        setInitialSearchValues(resetSearchValues)
    };
    

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getListData()
    }, []);

    const [listData, setListData] = useState([])
    const getListData = async () => {

        const params = Object.assign(window.pagination, initialSearchValues)

        setLoading(true);
        try {
            const result = await RestApi.get('api/v1/designation/list', { params })
            console.log('result', result)
            if (result.status == 200) {
                setListData(result)
            }
        } catch (error) {
            console.log('error', error)
        } finally {
            setLoading(false);
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
                const updatedUsers = users.filter(user => user.id !== data.id);
                setUsers(updatedUsers);

                Swal.fire({
                    title: t('deleted'),
                    text: t('your_data_has_been_deleted'),
                    icon: "success"
                });
            }
        });
    }

    const [formOpen, setFormOpen] = useState(false)
    const editItem = ''
    // const editData = (data) => {
    //     this.editItem = data
    //     console.log("editData", data);
    //     setFormOpen(true);
    // }

    const toggleFormOpen = (value) => {
        setFormOpen(value);
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // State to manage the list of users
    const [users, setUsers] = useState([
        { id: 1, src: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg', name: 'John Doe', email: 'john@creative-tim.com', office: 'Dhaka Metro-1', designation: 'HR Admin', is_active: true },
        { id: 2, src: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg', name: 'John Doe', email: 'john@creative-tim.com', office: 'Dhaka Metro-2', designation: 'Software Engineer', is_active: false },
        { id: 3, src: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg', name: 'John Doe', email: 'john@creative-tim.com', office: 'Dhaka Metro-3', designation: 'Team Lead', is_active: true },
        { id: 4, src: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg', name: 'John Doe', email: 'john@creative-tim.com', office: 'Dhaka Metro-4', designation: 'Software Engineer', is_active: false },
    ]);


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

    // const handleSave = (userData) => {
    //     if (editData) {
    //         // Editing an existing user
    //         setUsers(users.map(user => user.id === userData.id ? userData : user));
    //     } else {
    //         // Adding a new user
    //         const newUser = { ...userData, id: users.length + 1 };
    //         setUsers([...users, newUser]);
    //     }
    //     handleCloseModal();
    //     getListData()
    // };

    
    const handleSave = async (values) => {
        console.log('Form submitted:', values);
        // onSave(values);
        setLoading(true);
        let result = ''
        try {
            console.log('values', values)
            if (values.id) {
                // result = await RestApi.post('api/v1/admin/configurations/designation/create', values)
                result = await RestApi.post('api/v1/designation/create', values)
            } else {
                result = await RestApi.post('api/v1/designation/create', values)
            }

            if (result.status == 201) {
                toaster('Country has been created')
                handleCloseModal();
                getListData()
            }

        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setLoading(false);
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

    return (
        <>
            {showFilter &&
                <div className="card bg-gray-300 mb-3">
                    <div className="card-body p-2">

                        <div className="row">
                            <div className="col">
                                <h5 className='text-dark font-semibold'>{t('search_filter')}</h5>
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-md-3">
                                <input type="text" name="nameEn" value={initialSearchValues.nameEn} onChange={inputOnChange} className="form-control" placeholder="Enter name" />
                            </div>
                            {/* <div className="col-md-3">
                                <Select isClearable={true} styles={styles} maxMenuHeight={100} options={options} name="office" value={initialSearchValues.office} onChange={selectOnChange} placeholder="Select Office" />
                            </div> */}
                            <div className="col-md-3">
                                <Form.Select name='is_active' value={initialSearchValues.is_active} onChange={e => setInitialSearchValues({...initialSearchValues, is_active: e.target.value})}>
                                    <option value="">Select Office</option>
                                    {statusList.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {currentLanguage === 'en' ? option.name_en : option.name_bn}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>
                            {/* <div className="col-md-3">
                                <Select theme={customThemeFn} isClearable={true} options={options} name="designation" value={initialSearchValues.designation} onChange={selectOnChange} placeholder="Select Designation" />
                            </div>
                            <div className="col-md-3">
                                <MultiSelect
                                    options={options}
                                    name="designation"
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy="Select Designation"
                                />
                            </div> */}
                            <div className="col-md-3">
                                <div className="flex">
                                    <div className="flex-1">
                                        <button onClick={searchData} className="btn btn-success btn-sm w-full">Search</button>
                                    </div>
                                    <div className="flex-1 ml-2">
                                        <button onClick={clearSearchFields} className="btn btn-outline-danger btn-sm w-full">Clear</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            }
            <div className=" text-slate-700 card bg-white shadow-md rounded-xl">
                <div className='row m-1'>
                    <div className="col-md-8 col-sm-12">
                        <h3 className="text-lg font-semibold text-slate-800">{t('Designation List')}</h3>
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
                            <button className='btn btn-info btn-rounded btn-sm mr-2' onClick={toggleFilter}><i className="fa fa-filter"></i></button>
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
                <div className="p-0 overflow-scroll relative min-h-[300px]">
                    <Loading loading={loading} />
                    <table className="mt-2 text-left table table-responsive min-w-max">
                        <thead>
                            <tr>
                                <th>{t('name') + ` (${t('en')})`}</th>
                                <th>{t('name') + ` (${t('bn')})`}</th>
                                <th>{t('status')}</th>
                                <th>{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {users.map(user => (
                                <tr key={user.id} className='text-slate-500 text-sm'>
                                    <td>{user.name}</td>
                                    <td>{user.office}</td>
                                    <td>
                                        <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}> {user.is_active ? t('active') : t('inactive')}</span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleOpenEditModal(user)} className='btn btn-sm text-[12px] btn-outline-info'>
                                            <i className="fa fa-pen"></i>
                                        </button>
                                        <button onClick={() => deleteData(user)} className='btn btn-sm text-[12px] btn-outline-danger ml-1'>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between p-3">
                    <p className="block text-sm text-slate-500">
                        Page 1 of 10
                    </p>
                    <div className="flex gap-1">
                        <button
                            className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button">
                            Previous
                        </button>
                        <button
                            className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withNamespaces()(DesignationList)
