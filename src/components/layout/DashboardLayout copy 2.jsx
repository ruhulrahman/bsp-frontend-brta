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
    <>
      {/* <!-- Dashboard Layout --> */}
      <div className="grid grid-cols-12 min-h-screen">
        {/* <!-- Sidebar --> */}
        <aside className="col-span-2 bg-gray-800 text-white p-4 h-full">
          <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
          <nav>
            <ul>
              <li className="mb-4">
                <a href="#" className="text-gray-300 hover:text-white">Home</a>
              </li>
              <li className="mb-4">
                <a href="#" className="text-gray-300 hover:text-white">Profile</a>
              </li>
              <li className="mb-4">
                <a href="#" className="text-gray-300 hover:text-white">Settings</a>
              </li>
              <li className="mb-4">
                <a href="#" className="text-gray-300 hover:text-white">Reports</a>
              </li>
            </ul>
          </nav>
        </aside>


        {/* <!-- Main Content --> */}
        <main className="col-span-10">
          {/* <!-- Navbar --> */}
          <nav className="bg-gray-800 text-white">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center py-4">
                {/* <!-- Logo --> */}
                <div className="text-xl font-bold">
                  <a href="#">MyBrand</a>
                </div>

                {/* <!-- Menu for larger screens --> */}
                <div className="hidden md:flex space-x-6">
                  <a href="#" className="hover:text-gray-300">Home</a>
                  <a href="#" className="hover:text-gray-300">About</a>
                  <a href="#" className="hover:text-gray-300">Services</a>
                  <a href="#" className="hover:text-gray-300">Contact</a>
                  {/* <!-- Dropdown Menu --> */}
                  <div className="relative group">
                    <button className="hover:text-gray-300">More</button>
                    <div className="absolute hidden group-hover:block bg-gray-700 text-sm rounded shadow-lg mt-2">
                      <a href="#" className="block px-4 py-2 hover:bg-gray-600">Submenu 1</a>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-600">Submenu 2</a>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-600">Submenu 3</a>
                    </div>
                  </div>
                  <button className="block py-2 text-sm bg-red-600 text-white px-4 py-2 rounded">Logout</button>
                </div>

                {/* <!-- Hamburger Menu for mobile --> */}
                <div className="md:hidden">
                  <button id="menu-button" className="focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* <!-- Mobile Menu --> */}
              {/* <div id="mobile-menu" className="hidden md:hidden">
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-700">Home</a>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-700">About</a>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-700">Services</a>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-700">Contactss</a>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-700">Contact</a>
                
                <button className="block py-2 text-sm bg-red-600 text-white px-4 py-2 rounded">Logout</button>
                <div className="relative">
                  <button id="mobile-more-button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700">More</button>
                  <div id="mobile-submenu" className="hidden bg-gray-700 text-sm rounded shadow-lg mt-2">
                    <a href="#" className="block px-4 py-2 hover:bg-gray-600">Submenu 1</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-600">Submenu 2</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-600">Submenu 3</a>
                  </div>
                </div>
              </div> */}
            </div>
          </nav>

          <div className="flex justify-between items-center p-8 mb-8">
            <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
            <button className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p>Your main content goes here.</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
