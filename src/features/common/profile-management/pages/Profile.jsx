import i18n from '@/i18n';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { withTranslation, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import logoBrta from '@/assets/images/logo-brta.png';

const Profile = () => {
  return (
    // <!-- Profile Card -->
    <div>
       <div className="md:grid grid-cols-4 grid-rows-2   gap-2 p-4 rounded-xl">
            <div className="md:col-span-1 h-48 shadow-xl bg-white">
                    <div className="flex w-full h-full relative">
                        <img src="https://res.cloudinary.com/dboafhu31/image/upload/v1625318266/imagen_2021-07-03_091743_vtbkf8.png" className="w-44 h-44 m-auto" alt=""/>
    
                    </div>
            </div>
            <div className="md:col-span-3 h-48 shadow-xl p-4 space-y-2 p-3 bg-white">
                    <div className="flex ">
                        <span
                            className="text-sm border bg-blue-50 font-bold uppercase border-2 rounded-l px-4 py-2 bg-gray-50 whitespace-no-wrap w-2/6">Name:</span>
                        <input 
                            className="px-4 border-l-0 cursor-default border-gray-300 focus:outline-none  rounded-md rounded-l-none shadow-sm -ml-1 w-4/6"
                            type="text" value="Ismael Contreras"  readOnly/>
                    </div>
                    <div className="flex ">
                        <span
                            className="text-sm border bg-blue-50 font-bold uppercase border-2 rounded-l px-4 py-2 bg-gray-50 whitespace-no-wrap w-2/6">Email:</span>
                        <input 
                            className="px-4 border-l-0 cursor-default border-gray-300 focus:outline-none  rounded-md rounded-l-none shadow-sm -ml-1 w-4/6"
                            type="text" value="myemail@server.com"  readOnly/>
                    </div>
                     <div className="flex ">
                        <span
                            className="text-sm border bg-blue-50 font-bold uppercase border-2 rounded-l px-4 py-2 bg-gray-50 whitespace-no-wrap w-2/6">Role:</span>
                        <input 
                            className="px-4 border-l-0 cursor-default border-gray-300 focus:outline-none  rounded-md rounded-l-none shadow-sm -ml-1 w-4/6"
                            type="text" value="Admin"  readOnly/>
                    </div>
            </div>
            <div className="md:col-span-3 h-48 shadow-xl p-4 space-y-2 hidden md:block bg-white">
                <h3 className="font-bold uppercase"> Profile Description</h3>
                <p className=""> 
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget laoreet diam, id luctus lectus. Ut consectetur nisl ipsum, et faucibus sem finibus vitae. Maecenas aliquam dolor at dignissim commodo. Etiam a aliquam tellus, et suscipit dolor. Proin auctor nisi velit, quis aliquet sapien viverra a. 
                </p>
            </div>
                
        </div>
    </div>
  )
}

export default Profile
