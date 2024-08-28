import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import AdminNavbar from '../navbar/AdminNavbar';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
// import { Link, Outlet } from 'react-router-dom';
// import MyNavbar from '@/components/common/MyNavbar.jsx';



// function dropdown() {
//     document.querySelector("#submenu").classList.toggle("hidden");
//     document.querySelector("#arrow").classList.toggle("rotate-0");
// }
// dropdown();

// function openSidebar() {
//     document.querySelector(".sidebar").classList.toggle("hidden");
// }

const AdminLayout = () => {

    const [openConfiguration, setOpenConfiguration] = useState(false);

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    // const isAuthenticated = localStorage.getItem('token')!== null;


    return (
        <div>
            {/* <!-- Sidebar --> */}
            {/* <!-- Dashboard Layout --> */}
            <div className="flex min-h-screen">
                {/* <!-- Sidebar --> */}
                {/* <aside className="w-64 bg-gray-800 text-white">
                    <div className='flex justify-between text-green-500 bg-gray-600 p-3'>
                        <h2 className="text-xl font-semibold">BRTA Service Portal</h2>
                        <button id="menu-button" className="focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>

                    <nav>
                        <ul className='admin-sidebar-ul bg-yellow-500'>
                            <li>
                                <Link to="/admin" className={({ isActive }) => isActive ? "bg-green-700 text-white font-bold" : ""}>Dashboard</Link>
                            </li>
                            <li>
                                <Link to="/admin/profile" className={({ isActive }) => isActive ? "bg-green-700 text-white font-bold" : ""}>Profile</Link>
                            </li>
                        </ul>
                    </nav>
                </aside> */}
                <aside className="w-64 bg-gray-800 text-white">
                    
                <div className='flex justify-between text-green-500 bg-gray-600 p-[18px]'>
                        <h2 className="text-xl font-semibold">BRTA Service Portal</h2>
                        <button id="menu-button" className="focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                    <nav>
                        <ul className='admin-sidebar-ul'>
                            <li>
                                <NavLink to="/admin/dashboard">
                                    <i className="bi bi-house-door-fill"></i>
                                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Dashboard</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/profile">
                                    <i className="bi bi-person-fill"></i>
                                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Profile</span>
                                </NavLink>
                            </li>
                            <li>
                                <div onClick={() => setOpenConfiguration(!openConfiguration)} className="flex items-center justify-content-between cursor-pointer">
                                    <i className="bi bi-gear-fill"></i>
                                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Configurations</span>
                                    <span className={`text-sm rotate-180 ${open ? 'rotate-0' : ''}`}>
                                        <i className="bi bi-chevron-down"></i>
                                    </span>
                                </div>
                                {openConfiguration && (
                                    <ul id="example-collapse-text" className="pl-10" style={{ height: '80px', visibilty: 'visible' }}>
                                        <li>
                                            <NavLink to="/admin/configurations/social">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">Social</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/admin/configurations/personal">
                                                <span className="text-[15px] ml-4 text-gray-200 font-bold">Personal</span>
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </nav>
                </aside>


                {/* <aside className="w-64 bg-gray-800 text-white">
                    <span
                        className="absolute text-white text-4xl top-5 left-4 cursor-pointer"
                        onclick="openSidebar()"
                    >
                        <i className="bi bi-filter-left px-2 bg-gray-900 rounded-md"></i>
                    </span>
                    <div
                        className="sidebar fixed top-0 bottom-0 lg:left-0 overflow-y-auto text-center"
                    >
                        <div className="text-gray-100 text-xl">
                            <div className="p-2.5 mt-1 flex items-center">
                                <i className="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600"></i>
                                <h1 className="font-bold text-gray-200 text-[15px] ml-3">TailwindCSS</h1>
                                <i
                                    className="bi bi-x cursor-pointer ml-28 lg:hidden"
                                    onclick="openSidebar()"
                                ></i>
                            </div>
                            <div className="my-1 bg-gray-600 h-[1px]"></div>
                        </div>
                        <div
                            className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700 text-white"
                        >
                            <i className="bi bi-search text-sm"></i>
                            <input
                                type="text"
                                placeholder="Search"
                                className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
                            />
                        </div>
                        <Link to="/admin" className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
                            <i className="bi bi-house-door-fill"></i>
                            <span className="text-[15px] ml-4 text-gray-200 font-bold">Dashboard</span>
                        </Link>
                        <Link to="/admin/profile" className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
                            <i className="bi bi-house-door-fill"></i>
                            <span className="text-[15px] ml-4 text-gray-200 font-bold">Profile</span>
                        </Link>
                        <div
                            className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                        >
                            <i className="bi bi-bookmark-fill"></i>
                            <span className="text-[15px] ml-4 text-gray-200 font-bold">Bookmark</span>
                        </div>
                        <div className="my-4 bg-gray-600 h-[1px]"></div>
                        <div
                            className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                        >
                            <i className="bi bi-gear-fill"></i>
                            <div className="flex justify-between w-full items-center">
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">Configurations</span>
                                <span className="text-sm rotate-180" id="arrow">
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                        </div>

                        <div
                            class="text-left text-sm mt-2 w-4/5 mx-auto text-gray-200 font-bold"
                            id="submenu"
                        >
                            <h1 class="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                                Social
                            </h1>
                            <h1 class="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                                Personal
                            </h1>
                            <h1 class="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                                Friends
                            </h1>
                        </div>

                        <Link to="/logout" className="p-1 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-red-600 text-white">
                            <i className="bi bi-box-arrow-in-right"></i>
                            <span className="text-[15px] ml-4 text-gray-200 font-bold">Logout</span>
                        </Link>
                    </div>
                </aside> */}

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
                    <AdminNavbar />
                    <main className="bg-white p-1 m-2 rounded shadow-lg">
                        {/* <h1>Dashboard Layout</h1> */}
                        <Outlet /> {/* Renders nested routes */}
                    </main>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
