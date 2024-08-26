import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/dashboard/settings">Settings</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <h1>Dashboard Layout</h1>
        <Outlet /> {/* Renders nested routes */}
      </main>
    </div>
  );
};

export default DashboardLayout;
