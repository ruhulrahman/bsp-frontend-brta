import i18n from '@/i18n';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../navbar/AdminNavbar';
import AdminSidebar from '../navbar/AdminSidebar';
import { ToastContainer } from 'react-toastify';
import { withNamespaces } from 'react-i18next';
import RestApi from '@/utils/RestApi';
import Loading from '@/components/common/Loading';
import { useDispatch } from 'react-redux';
import { setAuthUser, setToken } from '../../features/common/auth/authSlice';
import { setLoading, setCommonDropdowns } from '@/store/commonSlice';

const AdminLayout = ({ t }) => {
    
    const currentLanguage = i18n.language;

    const dispatch = useDispatch()
    // Sidebar Toggle State
    const [openSidebar, setOpenSidebar] = useState(true);
    // console.log('openSidebar', openSidebar)

    const [key, setKey] = useState(window.location.pathname);

    useEffect(() => {
        getAuthData()
        getCommonDropdownData()
    }, []);

    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(true)
    const getAuthData = async () => {

        setLoading(true);
        try {
            const result = await RestApi.get('api/user/me')
            if (result.status == 200) {
                dispatch(setAuthUser(result.data));
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
            const { data } = await RestApi.get('api/v1/admin/configurations/common-dropdown-list')
            console.log('data', data)
            dispatch(setCommonDropdowns(data.data));
        } catch (error) {
            console.log('error', error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="d-flex">
                {/* <!-- Sidebar --> */}
                {openSidebar &&  
                <div className="flex-grow-2 bg-gray-800  text-white sidebar w-[265px] lg:w-[265px]  md:w-[265px] sm:w-[265px] min-h-screen">
                    {currentLanguage === 'bn' && (
                    <h2 className="font-semibold m-2 text-green-500">{t('brtaServicePortal')}</h2>
                )}

                {currentLanguage === 'en' && (
                    <h2 className="text-xl font-semibold m-2 text-green-500">{t('brtaServicePortal')}</h2>
                )}
                    <AdminSidebar openSidebar={openSidebar} />
                </div>}

                {/* <!-- Main Content Area --> */}
                <div className="flex-grow-1">
                    {/* <nav className="navbar navbar-expand-lg navbar-light bg-info">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="#">Admin Panel</a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <a className="nav-link" href="/admin/profile">
                                            <i className="fas fa-user"></i> Profile
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/logout">
                                            <i className="fas fa-sign-out-alt"></i> Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav> */}
                    <AdminNavbar openSidebar={openSidebar} onToggleSidebar={() => setOpenSidebar(!openSidebar)} />

                    <div className="container-fluid p-3">
                        <Loading loading={loading} />
                        <Outlet />
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </>
    );
};

export default withNamespaces()(AdminLayout);
