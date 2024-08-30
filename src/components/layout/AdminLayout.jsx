import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../navbar/AdminNavbar';
import AdminSidebar from '../navbar/AdminSidebar';

const AdminLayout = () => {
    const [key, setKey] = useState(window.location.pathname);
    return (
        <div>
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <AdminSidebar/>
                <div className="flex-1">
                    <AdminNavbar />
                {/* Main Content */}
                    <main className="bg-white m-3.5 rounded shadow-lg">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
