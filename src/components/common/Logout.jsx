import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeAuthUser } from '@/features/common/auth/authSlice';
import { useDispatch } from 'react-redux';
import { removeToken, removeTokenInfo } from '../../features/common/auth/authSlice';

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        // Clear authentication data (e.g., tokens, user info)
        localStorage.removeItem('token');
        dispatch(removeAuthUser());
        dispatch(removeToken());
        dispatch(removeTokenInfo());

        // Optionally, clear other related data
        // sessionStorage.clear();
        // localStorage.clear();

        // Redirect to the login page
        navigate('/login');
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <p className="text-lg font-medium text-gray-700">Logging you out...</p>
        </div>
    );
};

export default Logout;
