import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import MyNavbar from '@/components/common/MyNavbar.jsx';

const DashboardLayout = () => {

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  // const isAuthenticated = localStorage.getItem('token')!== null;

  return (
    <div className='dashboard'>
      {/* <header>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/dashboard/settings">Settings</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </nav>
      </header> */}
      
    {/* <!-- Sidebar --> */}
    <div id="sidebar" className="d-flex flex-column p-3">
        <h2 className="text-center">Dashboard</h2>
        <hr/>
        <ul className="nav flex-column">
            <li className="nav-item">
                <Link to="/dashboard/dashboard" className="sidebar-link">Dashboard</Link>
            </li>
            <li className="nav-item">
                <Link to="/dashboard/dashboard" className="sidebar-link">Profile</Link>
            </li>
            <li className="nav-item">
                <Link to="/dashboard/dashboard" className="sidebar-link">Reports</Link>
            </li>
        </ul>
    </div>

    <MyNavbar username="Ruhul Amin" onLogout={handleLogout} />

      <main>
        {/* <h1>Dashboard Layout</h1> */}
        <Outlet /> {/* Renders nested routes */}
      </main>
    </div>
  );
};

export default DashboardLayout;
