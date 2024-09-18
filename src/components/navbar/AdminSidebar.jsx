import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ openSidebar }) => {

    const [openConfiguration, setOpenConfiguration] = useState(false);
    const [openUserManagement, setOpenUserManagement] = useState(false);

    return (
        <>
            <nav className={`bg-gray-800 text-white ${openSidebar ? 'w-[265px] min-h-screen' : 'w-0 h-0 hidden'}`}>
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
                            <span className={`text-sm rotate-180 ml-2 ${openConfiguration ? 'rotate-0' : ''}`}>
                                <i className="bi bi-chevron-down"></i>
                            </span>
                        </div>
                        {openConfiguration && (
                            <ul id="example-collapse-text" className="pl-10" style={{ height: 'auto', visibilty: 'visible' }}>
                                <li>
                                    <NavLink to="/admin/configurations/country-list">
                                        {/* <i className="bi bi-chevron-right"></i> */}
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">Countries</span>
                                    </NavLink>
                                </li>
                                {/* <li>
                                    <NavLink to="/admin/configurations/location-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">Locations</span>
                                    </NavLink>
                                </li> */}
                                <li>
                                    <NavLink to="/admin/configurations/status-group-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">Status Groups</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/configurations/status-list">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">Status</span>
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <div onClick={() => setOpenUserManagement(!openUserManagement)} className="flex items-center justify-content-between cursor-pointer">
                            <i className="bi bi-gear-fill"></i>
                            <span className="text-[15px] ml-4 text-gray-200 font-bold">User Management</span>
                            <span className={`text-sm rotate-180 ml-2 ${openUserManagement ? 'rotate-0' : ''}`}>
                                <i className="bi bi-chevron-down"></i>
                            </span>
                        </div>
                        {openUserManagement && (
                            <ul id="example-collapse-text" className="pl-10 h-auto visible">
                                <li>
                                    <NavLink to="/admin/user-management/user">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">Users</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/user-management/designation">
                                        <span className="text-[15px] ml-4 text-gray-200 font-bold">Designations</span>
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default AdminSidebar
