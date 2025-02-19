import logoBrta from '@/assets/images/logo-brta.png';
import Loading from '@/components/common/Loading';
import useWindowSize from '@/hooks/useWindowSize';
import i18n from '@/i18n';
import { setCommonDropdowns } from '@/store/commonSlice';
import RestApi from '@/utils/RestApi';
import { useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { setAuthUser, setUserOfficeRole, setUserPermissions, setToken, setUserImage, removeUserImage } from '../../features/common/auth/authSlice';
import AdminNavbar from './navbar/admin/AdminNavbar';
import AdminSidebar from './navbar/admin/AdminSidebar';

const AdminLayout = () => {
const { t } = useTranslation();

    const { screenWidth, screenHeight } = useWindowSize();

    const currentLanguage = i18n.language;

    const dispatch = useDispatch()

    const { userOfficeRole } = useSelector((state) => state.auth)
    // Sidebar Toggle State
    const [openSidebar, setOpenSidebar] = useState(true);

    const [key, setKey] = useState(window.location.pathname);

    // const navigate = useNavigate();
    // const token = localStorage.getItem('token');
    // console.log('token', token)

    // useEffect(() => {
    //     if (!token) {
    //         navigate('/logout');
    //     }
    // }, [])

    const roleSet = localStorage.getItem('roleSet') === 'true'

    useEffect(() => {
        // if (!roleSet) {
        //     setLoggedInUserOrgAndRole()
        // }
    }, []);

    useEffect(() => {
        getAuthData()
        getUserProfilePhoto()
        getCommonDropdownData()
    }, []);

    const getUserProfilePhoto = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-profile-photo`, {
                responseType: "text", // Use "arraybuffer" for PDFs and "text" for Base64
            })

            // removeUserImage(null)
            // console.log('photo', data)
            
            // setUserImage('hello')
            if (data) {
                const userPhoto = `data:image/jpeg;base64,${data}`
                console.log('userPhoto', userPhoto)
                dispatch(setUserImage(userPhoto))
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(true)
    const setLoggedInUserOrgAndRole = async () => {

        setLoading(true);

        try {
            // const result = await RestApi.get('api/user/me')
            const result = await RestApi.post('api/v1/auth/set-logged-in-user-office-role', userOfficeRole)
            if (result.status == 200) {
            }
        } catch (error) {
            console.log('error', error)
        } finally {
            setLoading(false);
        }
    }

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
        <>
            <div className="d-flex">
                {/* <!-- Sidebar --> */}

                <div className={`flex-grow-2 bg-gray-800  text-white sidebar ${openSidebar ? 'open' : 'hide'} scrollbar-design-2 w-[265px] lg:w-[265px]  md:w-[265px] sm:w-[265px] min-h-screen`}>
                    <div className="sidebar-brand d-flex align-items-center justify-between">
                        {currentLanguage === 'bn' && (
                            <span className="font-semibold m-2 text-green-500">{t('brtaServicePortal')}</span>
                        )}
                        {currentLanguage === 'en' && (
                            <span className="text-xl font-semibold m-2 text-green-500">{t('brtaServicePortal')}</span>
                        )}
                        <Link to="/">
                            <img className="h-8 w-auto mr-2" src={logoBrta} alt="BRTA" />
                        </Link>
                    </div>
                    <AdminSidebar openSidebar={openSidebar} />
                </div>

                {/* <!-- Main Content Area --> */}
                <div className="flex-grow-1">
                    <AdminNavbar openSidebar={openSidebar} onToggleSidebar={() => setOpenSidebar(!openSidebar)} />

                    <div className={`${openSidebar ? 'ml-[265px]' : 'ml-[0px]'}`}>
                        <div className="container-fluid p-3">
                            <Loading loading={loading} />
                            <Outlet />
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default (AdminLayout);
