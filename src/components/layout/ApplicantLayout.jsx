import logoBrta from '@/assets/images/logo-brta.png';
import Loading from '@/components/common/Loading';
import useWindowSize from '@/hooks/useWindowSize';
import i18n from '@/i18n';
import { setCommonDropdowns } from '@/store/commonSlice';
import RestApi from '@/utils/RestApi';
import { useContext, useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { setAuthUser, setUserPermissions, setToken } from '../../features/common/auth/authSlice';
import Navbar from './navbar/applicant/Navbar';
import Sidebar from './navbar/applicant/Sidebar';
import { AuthProvider } from '@/components/common/AuthContext';

const ApplicantLayout = ({ t }) => {

    const { screenWidth, screenHeight } = useWindowSize();

    const currentLanguage = i18n.language;

    const dispatch = useDispatch()
    // Sidebar Toggle State
    const [openSidebar, setOpenSidebar] = useState(true);



    const [key, setKey] = useState(window.location.pathname);

    useEffect(() => {
        getAuthData()
        // getCommonDropdownData()
    }, []);

    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(true)
    const getAuthData = async () => {

        setLoading(true);
        try {
            // const result = await RestApi.get('api/user/me')
            const result = await RestApi.get('api/v1/auth/get-auth-user')
            if (result.status == 200) {
                dispatch(setAuthUser(result.data));
                dispatch(setUserPermissions(result.data.permissionCodes));
                dispatch(setToken(localStorage.getItem('token')));
            }
        } catch (error) {
            console.log('error', error)
        } finally {
            setLoading(false);
        }
    }
    const getCommonDropdownData = async () => {

        setLoading(true);
        try {
            const { data } = await RestApi.get('api/v1/admin/common/dropdown-list')
            // console.log('data', data)
            dispatch(setCommonDropdowns(data.data));
        } catch (error) {
            console.log('error', error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (screenWidth < 768) {
            setOpenSidebar(false)
        } else if (screenWidth > 768) {
            setOpenSidebar(true)
        }
    }, [screenWidth])

    return (
        <AuthProvider>
            <div className="d-flex">
                {/* <!-- Sidebar --> */}

                <div className={`flex-grow-2 bg-gray-800  text-white sidebar ${openSidebar ? 'open' : 'hide'} scrollbar-design-2 w-[265px] lg:w-[265px]  md:w-[265px] sm:w-[265px] min-h-screen`}>
                    <div className="sidebar-brand d-flex align-items-center justify-between py-[15px] px-[8px]">
                        <Link to="/">
                            <img className="h-[40px] w-auto" src={logoBrta} alt="BRTA" />
                        </Link>
                        {currentLanguage === 'bn' && (
                            <span className="font-semibold text-green-500">{t('brtaServicePortal')}</span>
                        )}
                        {currentLanguage === 'en' && (
                            <span className="text-xl font-semibold text-green-500">{t('brtaServicePortal')}</span>
                        )}
                    </div>
                    <Sidebar openSidebar={openSidebar} />
                </div>

                {/* <!-- Main Content Area --> */}
                <div className="flex-grow-1">
                    <Navbar openSidebar={openSidebar} onToggleSidebar={() => setOpenSidebar(!openSidebar)} />

                    <div className={`${openSidebar ? 'ml-[265px]' : 'ml-[0px]'}`}>
                        <div className="container-fluid p-3">
                            <Loading loading={loading} />
                            <Outlet />
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            </div>
        </AuthProvider>
    );
};

export default withNamespaces()(ApplicantLayout);
