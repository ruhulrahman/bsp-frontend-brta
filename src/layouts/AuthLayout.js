import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div>
      <main>
        <h1>Auth Layout</h1>
        <Outlet /> {/* Renders nested routes */}
      </main>
    </div>
  );
};

export default AuthLayout;
