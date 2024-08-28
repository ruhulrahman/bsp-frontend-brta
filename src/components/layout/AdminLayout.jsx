import { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import AdminNavbar from '../navbar/AdminNavbar';
import AdminSidebar from '../navbar/AdminSidebar';
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

    return (
        <div>
            <div className="flex min-h-screen">
                {/* <!-- Sidebar --> */}
                <AdminSidebar/>
                {/* <!-- Main Content --> */}
                <main className="flex-1">
                    <AdminNavbar />
                    <main className="bg-white p-3 m-3 rounded shadow-lg">
                        <Outlet /> {/* Renders nested routes */}
                    </main>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
