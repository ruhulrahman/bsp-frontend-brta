import React from 'react';
import { Navigate } from 'react-router-dom';
import { withTranslation, useTranslation } from 'react-i18next';

const AuthGuard = ({ children }) => {
const { t } = useTranslation();
    const isAuthenticated = localStorage.getItem('token');
    // const isAuthenticated = true;
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default AuthGuard;