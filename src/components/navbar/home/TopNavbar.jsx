import React from 'react'
import { Link, NavLink, Route } from 'react-router-dom'
import logo from '@/assets/images/logo.png';
import i18n from '@/i18n';
import { withNamespaces } from 'react-i18next';

const TopNavbar = ({ t }) => {

    const setLanguage = (language) => {
        localStorage.setItem('preferredLanguage', language);
      }

    const changeLanguage = (lng) => {
        setLanguage(lng)
        const preferredLanguage = localStorage.getItem('preferredLanguage');
        i18n.changeLanguage(preferredLanguage);
    }
    
    const preferredLanguage = localStorage.getItem('preferredLanguage');

    return (
        <>
            <header className="sticky inset-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
                <nav className="mx-auto flex max-w-6xl gap-8 px-6 transition-all duration-200 ease-in-out lg:px-12 py-2">
                    <div className="relative flex items-center">
                        <Link to="/">
                            <img src={logo} alt="Logo" className="w-10" loading="lazy" style={{ color: 'transparent' }} width="20" height="20" />
                            {/* <img src="https://www.svgrepo.com/show/499831/target.svg" loading="lazy" style={{ color: 'transparent' }} width="32" height="32" /> */}
                        </Link>
                    </div>
                    <ul className="hidden items-center justify-center gap-6 md:flex">
                        <li className="pt-1.5 font-dm text-sm font-medium text-slate-700 hover:text-green-700">
                            <NavLink className={({ isActive }) => isActive ? 'text-green-700' : ''} to="/">Home</NavLink>
                        </li>
                    </ul>
                    <div className="flex-grow"></div>
                    <div className="hidden items-center justify-center gap-6 md:flex">
                        <NavLink className={({ isActive }) => isActive ? 'text-green-700' : 'font-dm text-sm font-medium text-slate-700'} to="/login">Login</NavLink>
                        <NavLink className={({ isActive }) => isActive ? 'text-green-700' : 'rounded-md bg-gradient-to-br from-green-600 to-emerald-400 px-3 py-1.5 font-dm text-sm font-medium text-white shadow-md shadow-green-400/50 transition-transform duration-200 ease-in-out hover:scale-[1.03]'} to="/register">Registration</NavLink>
                        {preferredLanguage === 'en' &&
                        <button onClick={() => changeLanguage('bn')} className='flex justify-center btn btn-success'>
                            <span className="text-md">BN</span>
                        </button>}
                        {preferredLanguage === 'bn' &&
                        <button onClick={() => changeLanguage('en')} className='flex justify-center btn btn-danger'>
                            <span className="text-md">EN</span>
                        </button>}
                    </div>
                    <div className="relative flex items-center justify-center md:hidden">
                        <button type="button" to='/registration'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="h-6 w-auto text-slate-900"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path></svg>
                        </button>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default withNamespaces()(TopNavbar)
