import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {

    const [openSidebar, setOpenSidebar] = useState(true);

    const [openConfiguration, setOpenConfiguration] = useState(false);
    const [openUserManagement, setOpenUserManagement] = useState(false);

    return (
        <>
            <aside>
                <div className='flex justify-between text-green-500 bg-gray-600 p-[18px]'>
                    <h2 className="text-xl font-semibold">BRTA Service Portal</h2>
                    <button onClick={() => setOpenSidebar(!openSidebar)} id="menu-button" className="focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
                
                <nav className={openSidebar ? 'w-64 bg-gray-800 text-white visible' : 'w-0 hidden'}>
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
                        <li>
                            <div onClick={() => setOpenUserManagement(!openUserManagement)} className="flex items-center justify-content-between cursor-pointer">
                                <i className="bi bi-gear-fill"></i>
                                <span className="text-[15px] ml-4 text-gray-200 font-bold">User Management</span>
                                <span className={`text-sm rotate-180 ${open ? 'rotate-0' : ''}`}>
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            {openUserManagement && (
                                <ul id="example-collapse-text" className="pl-10" style={{ height: '80px', visibilty: 'visible' }}>
                                    <li>
                                        <NavLink to="/admin/user-management/user">
                                            <span className="text-[15px] ml-4 text-gray-200 font-bold">Users</span>
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default AdminSidebar
