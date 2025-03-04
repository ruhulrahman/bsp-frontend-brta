import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeAuthUser } from '@/features/common/auth/authSlice';
import { useDispatch } from 'react-redux';
import { removeToken, removeTokenInfo, setOfficeRole, removeUserOfficeRole, removeUserPermissions } from '../../features/common/auth/authSlice';
import RestApi from '@/utils/RestApi';

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        // Clear authentication data (e.g., tokens, user info)
        unsetLoggedInUserOrgAndRole();
    }, [navigate]);

    const [loading, setLoading] = useState(true)

    const unsetLoggedInUserOrgAndRole = async () => {

        setLoading(true);

        try {
            // const result = await RestApi.get('api/user/me')
            const result = await RestApi.post('api/v1/auth/unset-logged-in-user-office-role')
            if (result.status == 200) {
                dispatch(removeAuthUser());
                dispatch(removeToken());
                dispatch(removeTokenInfo());
                dispatch(removeUserOfficeRole());
                dispatch(removeUserPermissions());
                // dispatch(setOfficeRole(true));
                // localStorage.setItem('roleSet', false);

                // Optionally, clear other related data
                // sessionStorage.clear();
                // localStorage.clear();

                // Redirect to the login page
            }
        } catch (error) {
            console.log('error', error)
        } finally {
            setLoading(false);
            localStorage.removeItem('token');
            localStorage.setItem('roleSet', false);
            navigate('/login');
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <p className="text-lg font-medium text-gray-700">Logging you out...</p>
        </div>
    );
};

export default Logout;
