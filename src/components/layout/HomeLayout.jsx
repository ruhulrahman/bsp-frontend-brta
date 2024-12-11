import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomeTopNavBar from './navbar/home/TopNavbar';
import FooterSection from '../../features/home/pages/FooterSection';

const HomeLayout = () => {
  return (
    <>
      <HomeTopNavBar />
      <Outlet />
      <ToastContainer />
      <FooterSection />
    </>
  );
};

export default HomeLayout;
