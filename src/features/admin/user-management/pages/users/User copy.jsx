import React, { useEffect, useState } from 'react';
// import Badge from 'react-bootstrap/Badge';
import { withNamespaces } from 'react-i18next';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import Spinner from 'react-bootstrap/Spinner';
// import Pagination from 'react-bootstrap/Pagination'
import AddNew from './AddNew';
import Loading from '@/components/common/Loading';

const User = ({ t }) => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getListData()
    }, []);

    const getListData = () => {
        console.log("getListData");
        setTimeout(() => setLoading(false), 1000)
    }

    const searchData = () => {
        console.log("searchData");
        getListData()
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
        { id: 2, src: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg', name: 'John Doe', email: 'john@creative-tim.com', office: 'Dhaka Metro-1', designation: 'Software Engineer', is_active: false },
        { id: 3, src: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg', name: 'John Doe', email: 'john@creative-tim.com', office: 'Dhaka Metro-1', designation: 'Team Lead', is_active: true },
        { id: 4, src: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg', name: 'John Doe', email: 'john@creative-tim.com', office: 'Dhaka Metro-1', designation: 'Software Engineer', is_active: false },
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

    return (
        <div className=" text-slate-700 bg-white shadow-md rounded-xl">
            <div className='row m-1'>
                <div className="col-md-8 col-sm-12">
                    <h3 className="text-lg font-semibold text-green-600">{t('user_list')}</h3>
                    <p className="text-slate-500">{t('review_each_data_before_edit_or_delete')}</p>
                        <span className="badge bg-success">{t('totalRecords')}: {totalElements}</span>
                </div>
                <div className="col-md-4 col-sm-12 text-right">

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
                                    <span className="badge bg-success"> {user.is_active ? t('active') : t('inactive')}</span>
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
                                    <button onClick={() => deleteData('123')} className='btn btn-sm text-[12px] btn-outline-danger ml-1'>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <div className="flex items-center gap-3">
                                    <img src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg"
                                        alt="John Michael" className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            John Michael
                                        </p>
                                        <p
                                            className="text-sm text-slate-500">
                                            john@creative-tim.com
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Manager
                                    </p>
                                    <p
                                        className="text-sm text-slate-500">
                                        Organization
                                    </p>
                                </div>
                            </td>
                            <td>
                                <span className="badge bg-success">{t('active')}</span>
                            </td>
                            <td>
                                <p className="text-sm text-slate-500">
                                    23/04/18
                                </p>
                            </td>
                            <td>
                                <button onClick={() => editData('123')} className='btn btn-sm text-[12px] btn-outline-info'>
                                    <i className="fa fa-pen"></i>
                                </button>
                                <button onClick={() => deleteData('123')} className='btn btn-sm text-[12px] btn-outline-danger ml-1'>
                                    <i className="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="flex items-center gap-3">
                                    <img src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg"
                                        alt="Alexa Liras" className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Alexa Liras
                                        </p>
                                        <p
                                            className="text-sm text-slate-500">
                                            alexa@creative-tim.com
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Designer
                                    </p>
                                    <p
                                        className="text-sm text-slate-500">
                                        Marketing
                                    </p>
                                </div>
                            </td>
                            <td>
                                <div className="w-max">
                                    <span className='badge bg-danger'>{t('inactive')}</span>
                                </div>
                            </td>
                            <td>
                                <p className="text-sm text-slate-500">
                                    23/04/18
                                </p>
                            </td>
                            <td>
                                <button className='btn btn-sm text-[12px] btn-outline-info'>
                                    <i className="fa fa-pen"></i>
                                </button>
                                <button className='btn btn-sm text-[12px] btn-outline-danger ml-1'>
                                    <i className="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="flex items-center gap-3">
                                    <img src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg"
                                        alt="Laurent Perrier"
                                        className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Laurent Perrier
                                        </p>
                                        <p
                                            className="text-sm text-slate-500">
                                            laurent@creative-tim.com
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Executive
                                    </p>
                                    <p
                                        className="text-sm text-slate-500">
                                        Projects
                                    </p>
                                </div>
                            </td>
                            <td>
                                <span className="badge bg-danger">{t('inactive')}</span>
                            </td>
                            <td>
                                <p className="text-sm text-slate-500">
                                    19/09/17
                                </p>
                            </td>
                            <td>
                                <button className='btn btn-sm text-[12px] btn-outline-info'>
                                    <i className="fa fa-pen"></i>
                                </button>
                                <button className='btn btn-sm text-[12px] btn-outline-danger ml-1'>
                                    <i className="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="flex items-center gap-3">
                                    <img src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg"
                                        alt="Michael Levi" className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Michael Levi
                                        </p>
                                        <p
                                            className="text-sm text-slate-500">
                                            michael@creative-tim.com
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Designer
                                    </p>
                                    <p
                                        className="text-sm text-slate-500">
                                        Developer
                                    </p>
                                </div>
                            </td>
                            <td>
                                <span className="badge bg-success">{t('active')}</span>
                            </td>
                            <td>
                                <p className="text-sm text-slate-500">
                                    24/12/08
                                </p>
                            </td>
                            <td>
                                <button className='btn btn-sm text-[12px] btn-outline-info'>
                                    <i className="fa fa-pen"></i>
                                </button>
                                <button className='btn btn-sm text-[12px] btn-outline-danger ml-1'>
                                    <i className="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>

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
    )
}

export default withNamespaces()(User)
