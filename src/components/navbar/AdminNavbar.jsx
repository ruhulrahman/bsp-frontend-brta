import i18n from '@/i18n';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
 // will print the current language

const navigation = [
    { name: 'Contact', href: '/admin/contact' },
    { name: 'Help', href: '/admin/help' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const AdminNavbar = ({ t, openSidebar, onToggleSidebar }) => {
    const navigate = useNavigate()
    const currentLanguage = i18n.language;

    const setLanguage = (language) => {
        localStorage.setItem('preferredLanguage', language);
    }

    const changeLanguage = (lng) => {
        setLanguage(lng)
        const preferredLanguage = localStorage.getItem('preferredLanguage');
        i18n.changeLanguage(preferredLanguage);
    }

    // let preferredLanguage = localStorage.getItem('preferredLanguage');
    // preferredLanguage = preferredLanguage ? preferredLanguage : 'bn'
    let preferredLanguage = localStorage.getItem('preferredLanguage');
    preferredLanguage = preferredLanguage !== null && preferredLanguage !== undefined ? preferredLanguage : 'bn';
    
    const { authUser } = useSelector((state) => state.auth) || {};

    return (
        <div className='flex'>
            <div onClick={!openSidebar ? onToggleSidebar : undefined} className={`flex justify-between text-green-500 bg-gray-600 p-[18px] transition-all duration-500 ${openSidebar ? 'w-[320px]' : 'w-auto'}`}>
                {openSidebar && currentLanguage === 'bn' ? (
                    <h5 className="font-semibold mr-2">{t('brtaServicePortal')}</h5>
                ) :
                (<h2 className="text-xl font-semibold mr-2">{t('brtaServicePortal')}</h2>
                )}
                <button onClick={onToggleSidebar} id="menu-button" className="btn btn-dark btn-sm flex-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
            <Disclosure as="nav" className="bg-gray-800 flex-initial w-full">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            {/* Mobile menu button*/}
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                            </DisclosureButton>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <img
                                    alt="Your Company"
                                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                    className="h-8 w-auto"
                                />
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    {navigation.map((item) => (
                                        // <a
                                        //     key={item.name}
                                        //     href={item.href}
                                        //     aria-current={item.current ? 'page' : undefined}
                                        //     className={classNames(
                                        //         item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        //         'rounded-md px-3 py-2 text-sm font-medium',
                                        //     )}
                                        // >
                                        //     {item.name}
                                        // </a>
                                        <NavLink key={item.name} className={({ isActive }) => isActive ? 'bg-green-700 rounded-md px-3 py-2 text-sm font-medium text-gray-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'} to={item.href}>
                                            {item.name}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                            {/* {preferredLanguage === 'en' &&
                                <button onClick={() => changeLanguage('bn')} className='flex justify-center btn btn-success'>
                                    <span className="text-md">BN</span>
                                </button>}
                            {preferredLanguage === 'bn' &&
                                <button onClick={() => changeLanguage('en')} className='flex justify-center btn btn-danger'>
                                    <span className="text-md">EN</span>
                                </button>} */}

                                {preferredLanguage === 'en' &&
                        <button onClick={() => changeLanguage('bn')} className='flex justify-center btn btn-success'>
                            <span className="text-md">{t('bangla')}</span>
                        </button>}
                        {preferredLanguage === 'bn' &&
                        <button onClick={() => changeLanguage('en')} className='flex justify-center btn btn-danger'>
                            <span className="text-md">{t('lang')}</span>
                        </button>}

                            <button
                                type="button"
                                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">View notifications</span>
                                <BellIcon aria-hidden="true" className="h-6 w-6" />
                            </button>

                            <div className='text-gray-300 flex flex-col'>
                                {/* <span className='text-[14px]'>Ruhul Amin</span> */}
                                <span className='text-[14px]'>{currentLanguage === 'en' ? authUser?.nameEn : authUser?.nameBn}</span>
                                <span className='text-[12px] text-green-200 text-right leadin'>Admin</span>
                            </div>

                            {/* Profile dropdown */}
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            alt=""
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            className="h-8 w-8 rounded-full"
                                        />
                                    </MenuButton>
                                </div>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <MenuItem>
                                        <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                        {currentLanguage === 'en' ? authUser?.nameEn : authUser?.nameBn}
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                            {t('your_profile')}
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link to="/admin/change-password" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                        {t('change_password')}
                                        </Link>
                                    </MenuItem>
                                    <MenuItem className="w-full">
                                        <Link to={"/logout"} className="px-4 py-2 text-sm text-red-500 text-gray-700 data-[focus]:bg-gray-100 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                            </svg>
                                            Logout
                                        </Link>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                    </div>
                </div>

                <DisclosurePanel className="sm:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navigation.map((item) => (
                            <DisclosureButton
                                key={item.name}
                                as="a"
                                href={item.href}
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium',
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                </DisclosurePanel>
            </Disclosure>
        </div>
    )
}

export default withNamespaces()(AdminNavbar)