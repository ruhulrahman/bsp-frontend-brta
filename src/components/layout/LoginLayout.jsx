import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginBackground from '../../assets/images/login-background.png';
<stlye>
  {`
    .login-background-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('${LoginBackground.png}');
        background-size: cover;
      }
  `}
</stlye>

const LoginLayout = () => {

  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem('token') && localStorage.getItem('userTypeCode') ? true : false;
  const userTypeCode = localStorage.getItem('userTypeCode')

  let dashboardRedirectUrl = ''

  if (userTypeCode === 'system_admin') {
    dashboardRedirectUrl = '/admin/dashboard'
  } else if (userTypeCode === 'system_user') {
    dashboardRedirectUrl = '/system-user/dashboard'
  } else if (userTypeCode === 'applicant') {
    dashboardRedirectUrl = '/applicant-panel/dashboard'
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate(dashboardRedirectUrl);
    }
  }, []);

  return (
    <div>

      {/* <TopNavbar /> */}

      <main>
        <div style={{ backgroundImage: `url(${LoginBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0 }} className="w-screen min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
          <Outlet /> {/* Renders nested routes */}
          <ToastContainer />
        </div>
      </main>
    </div>
  );
};

export default LoginLayout;
