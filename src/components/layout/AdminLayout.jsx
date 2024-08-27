import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import AdminNavbar from '../navbar/AdminNavbar';
// import { Link, Outlet } from 'react-router-dom';
// import MyNavbar from '@/components/common/MyNavbar.jsx';

const AdminLayout = () => {

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    // const isAuthenticated = localStorage.getItem('token')!== null;


    return (
        <>
            {/* <!-- Sidebar --> */}
            {/* <!-- Dashboard Layout --> */}
            <div className="flex min-h-screen">
                {/* <!-- Sidebar --> */}
                <aside className="w-64 bg-gray-800 text-white">
                    <div className='flex justify-between text-green-500 bg-gray-600 p-3'>
                        <h2 className="text-xl font-semibold">BRTA Service Portal</h2>
                        <button id="menu-button" className="focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>

                    <nav className=''>
                        <ul className='admin-sidebar-ul'>
                            <li className="">
                                <Link to="/admin" className={({ isActive }) => isActive ? "text-white font-bold" : "text-gray-400"}>Dashboard</Link>
                            </li>
                            <li className="">
                                <Link to="/admin/profile">Profile</Link>
                            </li>
                        </ul>
                    </nav>
                </aside>

        {/* <div id="bdSidebar" 
             className="d-flex flex-column 
                    flex-shrink-0 
                    p-3 bg-success
                    text-white offcanvas-md offcanvas-start">
            <a href="#" 
               className="navbar-brand">
            </a>
            <hr/>
            <ul className="mynav nav nav-pills flex-column mb-auto">
                <li className="nav-item mb-1">
                    <a href="#">
                        <i className="fa-regular fa-user"></i>
                        Profile
                    </a>
                </li>

                <li className="nav-item mb-1">
                    <a href="#">
                        <i className="fa-regular fa-bookmark"></i>
                        Saved Articles
                        <span className="notification-badge">5</span>
                    </a>
                </li>
                <li className="nav-item mb-1">
                    <a href="#">
                        <i className="fa-regular fa-newspaper"></i>
                        Articles
                    </a>
                </li>
                <li className="nav-item mb-1">
                    <a href="#">
                        <i className="fa-solid fa-archway"></i>
                        Institutions
                    </a>
                </li>
                <li className="nav-item mb-1">
                    <a href="#">
                        <i className="fa-solid fa-graduation-cap"></i>
                        Organizations
                    </a>
                </li>

                <li className="sidebar-item  nav-item mb-1">
                    <a href="#" 
                       className="sidebar-link collapsed" 
                       data-bs-toggle="collapse"
                       data-bs-target="#settings"
                       aria-expanded="false"
                       aria-controls="settings">
                        <i className="fas fa-cog pe-2"></i>
                        <span className="topic">Settings </span>
                    </a>
                    <ul id="settings" 
                        className="sidebar-dropdown list-unstyled collapse" 
                        data-bs-parent="#sidebar">
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link">
                                <i className="fas fa-sign-in-alt pe-2"></i>
                                <span className="topic"> Login</span>
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link">
                                <i className="fas fa-user-plus pe-2"></i>
                                <span className="topic">Register</span>
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link">
                                <i className="fas fa-sign-out-alt pe-2"></i>
                                <span className="topic">Log Out</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
            <hr/>
            <div className="d-flex">

                <i className="fa-solid fa-book  me-2"></i>
                <span>
                    <h6 className="mt-1 mb-0">
                          Geeks for Geeks Learning Portal
                      </h6>
                </span>
            </div>
        </div> */}


                {/* <!-- Main Content --> */}
                <main className="flex-1">
                    {/* <div className="flex justify-between items-center mb-3  bg-gray-700 p-3">
                        <h2 className="text-xl font-semibold text-white">Welcome to the Dashboard</h2>
                        <div>
                            <span className='text-white mr-2'>Ruhul Amin</span>
                            <button className="bg-red-600 text-white px-4 rounded" onClick={handleLogout}>Logout</button>
                        </div>
                    </div> */}
                    <AdminNavbar/>
                    <main  className="bg-white p-1 m-2 rounded shadow-lg">
                        {/* <h1>Dashboard Layout</h1> */}
                        <Outlet /> {/* Renders nested routes */}
                    </main>
                </main>
            </div>
        </>
    );
};

export default AdminLayout;
