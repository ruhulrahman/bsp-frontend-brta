import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import HomeTopNavBar from '../navbar/home/TopNavbar';

const HomeLayout = () => {
  return (
    <div>
      {/* <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </header> */}
      <HomeTopNavBar />

      <main className="container">
        <Outlet /> {/* Renders nested routes */}
      </main>

      <footer className="footer text-center bg-gray-200 p-4 mt-4">
        <p className='mb-0'>Copyright © {new Date().getFullYear()} - All right reserved by <b>Bangladesh Road Transport Authority (BRTA)</b></p>
      </footer>
    </div>
  );
};

export default HomeLayout;
