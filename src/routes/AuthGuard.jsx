import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default AuthGuard;