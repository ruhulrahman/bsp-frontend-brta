import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../navbar/AdminNavbar';
import AdminSidebar from '../navbar/AdminSidebar';
import { ToastContainer } from 'react-toastify';
import RestApi from '@/utils/RestApi';
import Loading from '@/components/common/Loading';
import { useDispatch } from 'react-redux';
import { setAuthUser, setToken } from '../../features/common/auth/authSlice';

const AdminLayout = () => {
    const dispatch = useDispatch()
    // Sidebar Toggle State
    const [openSidebar, setOpenSidebar] = useState(true);
    console.log('openSidebar', openSidebar)

    const [key, setKey] = useState(window.location.pathname);

    useEffect(() => {
        getAuthData()
    }, []);

    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(true)
    const getAuthData = async () => {

        setLoading(true);
        try {
            const result = await RestApi.get('api/user/me')
            console.log('result', result)
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

    return (
        <div>
            <div className="flex min-h-screen">
                <div className="flex-1">
                    <AdminNavbar openSidebar={openSidebar} onToggleSidebar={() => setOpenSidebar(!openSidebar)} />
                    {/* Main Content */}
                    <main className="flex-1">
                        <div className='flex'>
                            <div className='flex-none w-[265px]'>
                                {/* Sidebar */}
                                <AdminSidebar openSidebar={openSidebar} />
                            </div>
                            <div className="w-full m-3.5 ">
                                <Loading loading={loading} />
                                <Outlet />
                                <ToastContainer />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
