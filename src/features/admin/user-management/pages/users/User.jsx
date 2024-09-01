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

const User = ({ t }) => {

    const options = [
        { value: 'Dhaka Metro-1', label: 'Dhaka Metro-1' },
        { value: 'Dhaka Metro-2', label: 'Dhaka Metro-2' },
        { value: 'Dhaka Metro-3', label: 'Dhaka Metro-3' },
        { value: 'Dhaka Metro-4', label: 'Dhaka Metro-4' }
    ]

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getListData()
    }, []);

    const getListData = () => {
        console.log("getListData");
        setTimeout(() => setLoading(false), 1000)
    }

    const [initialSearchValues, setInitialSearchValues] = useState({
        name_en: '',
        name_bn: '',
        email: '',
        office: '',
        username: '',
        is_active: '',
    })

    const resetSearchValues = {
        name_en: '',
        name_bn: '',
        email: '',
        office: '',
        username: '',
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

    const handleSave = (userData) => {
        if (editData) {
            // Editing an existing user
            setUsers(users.map(user => user.id === userData.id ? userData : user));
        } else {
            // Adding a new user
            const newUser = { ...userData, id: users.length + 1 };
            setUsers([...users, newUser]);
        }
        handleCloseModal();
        getListData()
    };

    const [showFilter, setShowFilter] = useState(false)

    const toggleFilter = () => {
        setShowFilter(!showFilter)
    }

    return (
        <>
            {showFilter &&
                <div className="card bg-gray-300 mb-3">
                    <div className="card-body p-2">

                        <div className="row">
                            <div className="col">
                                <h5 className='text-dark font-semibold'>Search Filter</h5>
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-md-3">
                                <input type="text" name="name_en" value={initialSearchValues.name_en} onChange={inputOnChange} className="form-control" placeholder="Enter name" autocomplete="off" />
                            </div>
                            <div className="col-md-3">
                                <Select options={options} name="office" value={initialSearchValues.office} onChange={selectOnChange} placeholder="Select Office" />
                            </div>
                            <div className="col-md-3">
                                <input type="text" name="email" value={initialSearchValues.email} onChange={inputOnChange} className="form-control" placeholder="Enter email" autocomplete="off" />
                            </div>
                            <div className="col-md-3">
                                <input type="text" v-model="search.contact_email" className="form-control" id="contact_email" placeholder="Key contact email" autocomplete="off" />
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-md-3">
                            </div>
                            <div className="col-md-3">
                            </div>
                            <div className="col-md-3">
                            </div>
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
                        <h3 className="text-lg font-semibold text-slate-800">{t('user_list')}</h3>
                        <p className="text-slate-500">{t('review_each_data_before_edit_or_delete')}</p>
                    </div>
                    <div className="col-md-4 col-sm-12 text-right">
                        <OverlayTrigger
                            overlay={
                                <Tooltip>
                                    Toogle Search Filter
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
                                <th>{t('name')}</th>
                                <th>Office & Designation</th>
                                <th>{t('status')}</th>
                                <th>Employed</th>
                                <th>{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {users.map(user => (
                                <tr key={user.id} className='text-slate-500'>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <img src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg"
                                                alt="John Michael" className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                            <div className="flex flex-col">
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {user.name}
                                                </p>
                                                <p
                                                    className="text-sm text-slate-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {user.office}
                                            </p>
                                            <p
                                                className="text-sm text-slate-500">
                                                {user.designation}
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}> {user.is_active ? t('active') : t('inactive')}</span>
                                    </td>
                                    <td>
                                        <p className="text-sm text-slate-500">
                                            23/04/18
                                        </p>
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

export default withNamespaces()(User)
