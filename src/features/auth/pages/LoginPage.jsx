import logo from '@/assets/images/logo.png';
import React from 'react';
import { Link } from 'react-router-dom';
// import logo from '../../../assets/images/logo.png';

import { toaster } from '@/utils/helpers.js';
import { ToastContainer } from 'react-toastify';

const LoginPage = () => {
    
    
    const handleLogin = () => {
        console.log('clicked')
        toaster('Success')
    }
    
    return (
        <div className="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900  rounded-xl shadow-lg">
            <div className="flex flex-col justify-center items-center h-full select-none">
                <div className="flex flex-col items-center justify-center gap-2 mb-8">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="w-14" />
                    </Link>
                    <p className="m-0 text-[16px] font-semibold dark:text-white">Login to your BSP Account</p>
                    <span className="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]">Get started with our app, just start section and enjoy experience.
                    </span>
                </div>
            </div>
            <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-400 ">Username</label>
                <input className="border rounded-lg px-3 py-2 mb-2 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900" placeholder="Username" />
            </div>
            <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-gray-400">Password</label>
                <input type="password" className="border rounded-lg px-3 py-2 mb-2 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900" placeholder="••••••••" />
            </div>
            <div className="mt-1">
                <button onClick={handleLogin} className="py-1 px-8 bg-blue-500 hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none">Login</button>
                <ToastContainer />
            </div>
        </div>
    )
}

export default LoginPage
