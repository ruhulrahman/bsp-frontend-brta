import React, { createContext, useState, useEffect } from 'react';
import RestApi from '@/utils/RestApi';
import { useDispatch } from 'react-redux';
import { setCommonDropdowns as setStoreCommonDropdowns } from '@/store/commonSlice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [commonDropdowns, setCommonDropdowns] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);
  const dispatch = useDispatch()

  useEffect(() => {
    // Fetch user details before rendering the app
    const fetchUser = async () => {
      try {
        const { data } = await RestApi.get('/api/v1/admin/common/dropdown-list'); // Adjust API endpoint
        if (data.success) {
          setCommonDropdowns(data.data);
          dispatch(setStoreCommonDropdowns(data.data));
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setCommonDropdowns(null); // Optional: Redirect to login page if needed
      } finally {
        setLoadingContext(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ commonDropdowns, setCommonDropdowns, loadingContext, setLoadingContext }}>
      {children}
    </AuthContext.Provider>
  );
};
