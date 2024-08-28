import React, { useEffect } from 'react'
import Badge from 'react-bootstrap/Badge';
import { withNamespaces } from 'react-i18next';
import AddNew from './AddNew';

const User = ({ t }) => {

    const searchData = () => {
        console.log("searchData");
        getListData()
    }

    const getListData = () => {
        console.log("getListData");
    }
    
    useEffect(() => {
        getListData()
    }, []);

    return (
        <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
            <div className="relative mx-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
                <div className="flex items-center justify-between ">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">{t('user_list')}</h3>
                        <p className="text-slate-500">{t('review_each_data_before_edit_or_delete')}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
                        {/* <button className='btn-black-rounded'>Add New</button> */}
                        <AddNew />
                        {/* <button
                                className="flex select-none items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                                    stroke-width="2" className="w-4 h-4">
                                    <path
                                        d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z">
                                    </path>
                                </svg>
                                Add New
                            </button> */}
                    </div>
                </div>

            </div>
            <div className="p-0 overflow-scroll">
                <table className="w-full mt-4 text-left table-auto min-w-max">
                    <thead>
                        <tr>
                            <th>{t('name')}</th>
                            <th>Office & Designation</th>
                            <th>{t('status')}</th>
                            <th>Employed</th>
                            <th>{t('action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="flex items-center gap-3">
                                    <img src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg"
                                        alt="John Michael" className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            John Michael
                                        </p>
                                        <p
                                            className="text-sm text-slate-500">
                                            john@creative-tim.com
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Manager
                                    </p>
                                    <p
                                        className="text-sm text-slate-500">
                                        Organization
                                    </p>
                                </div>
                            </td>
                            <td>
                                <span className="badge bg-success">{t('active')}</span>
                            </td>
                            <td>
                                <p className="text-sm text-slate-500">
                                    23/04/18
                                </p>
                            </td>
                            <td>
                                <button
                                    className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button">
                                    <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                                            className="w-4 h-4">
                                            <path
                                                d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z">
                                            </path>
                                        </svg>
                                    </span>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="flex items-center gap-3">
                                    <img src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg"
                                        alt="Alexa Liras" className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Alexa Liras
                                        </p>
                                        <p
                                            className="text-sm text-slate-500">
                                            alexa@creative-tim.com
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Designer
                                    </p>
                                    <p
                                        className="text-sm text-slate-500">
                                        Marketing
                                    </p>
                                </div>
                            </td>
                            <td>
                                <div className="w-max">
                                    <span className='badge bg-danger'>{t('inactive')}</span>
                                </div>
                            </td>
                            <td>
                                <p className="text-sm text-slate-500">
                                    23/04/18
                                </p>
                            </td>
                            <td>
                                <button
                                    className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button">
                                    <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                                            className="w-4 h-4">
                                            <path
                                                d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z">
                                            </path>
                                        </svg>
                                    </span>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="flex items-center gap-3">
                                    <img src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg"
                                        alt="Laurent Perrier"
                                        className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Laurent Perrier
                                        </p>
                                        <p
                                            className="text-sm text-slate-500">
                                            laurent@creative-tim.com
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Executive
                                    </p>
                                    <p
                                        className="text-sm text-slate-500">
                                        Projects
                                    </p>
                                </div>
                            </td>
                            <td>
                                <span className="badge bg-danger">{t('inactive')}</span>
                            </td>
                            <td>
                                <p className="text-sm text-slate-500">
                                    19/09/17
                                </p>
                            </td>
                            <td>
                                <button
                                    className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button">
                                    <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                                            className="w-4 h-4">
                                            <path
                                                d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z">
                                            </path>
                                        </svg>
                                    </span>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="flex items-center gap-3">
                                    <img src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg"
                                        alt="Michael Levi" className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Michael Levi
                                        </p>
                                        <p
                                            className="text-sm text-slate-500">
                                            michael@creative-tim.com
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Designer
                                    </p>
                                    <p
                                        className="text-sm text-slate-500">
                                        Developer
                                    </p>
                                </div>
                            </td>
                            <td>
                                <span className="badge bg-success">{t('active')}</span>
                            </td>
                            <td>
                                <p className="text-sm text-slate-500">
                                    24/12/08
                                </p>
                            </td>
                            <td>
                                <button
                                    className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                    data-dialog-target="dialog"
                                >
                                    <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                                            className="w-4 h-4">
                                            <path
                                                d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z">
                                            </path>
                                        </svg>
                                    </span>
                                </button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between p-3">
                <p className="block text-sm text-slate-500">
                    Page 1 of 10
                </p>
                <div className="flex gap-1">
                    <button
                        className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button">
                        Previous
                    </button>
                    <button
                        className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button">
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default withNamespaces()(User)
