import logoBrta from '@/assets/images/logo-brta.png';
import Loading from '@/components/common/Loading';
import useWindowSize from '@/hooks/useWindowSize';
import i18n from '@/i18n';
import { setCommonDropdowns } from '@/store/commonSlice';
import RestApi from '@/utils/RestApi';
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { setAuthUser, setUserPermissions, setToken, setOfficeRole, setUserImage, removeUserImage } from '../../features/common/auth/authSlice';
import Navbar from './navbar/system-user/Navbar';
import Sidebar from './navbar/system-user/Sidebar';

const SystemUserLayout = ({ t }) => {

    const { screenWidth, screenHeight } = useWindowSize();

    const navigate = useNavigate();

    const currentLanguage = i18n.language;

    const dispatch = useDispatch()
    const { userOfficeRole } = useSelector((state) => state.auth)
    // Sidebar Toggle State
    const [openSidebar, setOpenSidebar] = useState(true);

    const [key, setKey] = useState(window.location.pathname);

    const roleSet = localStorage.getItem('roleSet') === 'true'

    // const token = localStorage.getItem('token');
    // console.log('token', token)

    // useEffect(() => {
    //     if (!token) {
    //         navigate('/logout');
    //     }
    // }, [])

    useEffect(() => {
        if (!roleSet) {
            setLoggedInUserOrgAndRole()
        }
    }, []);

    useEffect(() => {
        if (roleSet) {
            getAuthData()
        }
        getCommonDropdownData()
    }, [roleSet]);

    useEffect(() => {
        getUserProfilePhoto()
    },[])

    const getUserProfilePhoto = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-profile-photo`, {
                responseType: "text", // Use "arraybuffer" for PDFs and "text" for Base64
            })

            removeUserImage(null)

            if (data) {
                const userPhoto = `data:image/jpeg;base64,${data}`
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
                dispatch(setOfficeRole(true));
                localStorage.setItem('roleSet', true);
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
                if (localStorage.getItem('token')) {
                    dispatch(setToken(localStorage.getItem('token')));
                }
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
        </>
    );
};

export default withNamespaces()(SystemUserLayout);
