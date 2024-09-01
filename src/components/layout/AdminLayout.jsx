import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../navbar/AdminNavbar';
import AdminSidebar from '../navbar/AdminSidebar';

const AdminLayout = () => {
    // Sidebar Toggle State
    const [openSidebar, setOpenSidebar] = useState(true);
    console.log('openSidebar', openSidebar)

    const [key, setKey] = useState(window.location.pathname);
    return (
        <div>
            <div className="flex min-h-screen">
                <div className="flex-1">
                    <AdminNavbar openSidebar={openSidebar} onToggleSidebar={() => setOpenSidebar(!openSidebar)} />
                    {/* Main Content */}
                    <main className="flex-1">
                        <div className='flex'>
                            <div className='flex-none w-[265px]'>
                                {/* Sidebar */}
                                <AdminSidebar openSidebar={openSidebar} />
                            </div>
                            <div className="w-full m-3.5 ">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
