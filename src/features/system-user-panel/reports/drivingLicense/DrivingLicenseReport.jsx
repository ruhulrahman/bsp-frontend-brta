import React, { useEffect, useState } from 'react';
import ReactSelect from '@/components/ui/ReactSelect';
import { withTranslation, useTranslation } from 'react-i18next';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import Pagination from 'react-bootstrap/Pagination'
import Loading from '@/components/common/Loading';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import helpers, { toaster } from '@/utils/helpers.js';
import { setLoading, setListData, setCurrentPage, setPaginationData, setResetPagination, toggleShowFilter } from '@/store/commonSlice';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import { useNavigate } from 'react-router-dom';
import SearchComponent from '@/features/common/list/VehicleRegistrationListSearchComponent';
import useCommonFunctions from '@/hooks/useCommonFunctions';
import CustomPagination from '@/components/common/CustomPagination';
import DrivingLicenseReportPdf from './DrivingLicenseReportPdf';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Flatpickr from "react-flatpickr";

const DrivingLicenseReport = () => {
    const { t } = useTranslation();

    const navigate = useNavigate()
    const { hasPermission } = useCommonFunctions();

    const dispatch = useDispatch();
    const { activeStatusList, loading, listData, windowSize, pagination, showFilter, dropdowns, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const toggleFilter = () => {
        dispatch(toggleShowFilter());
    }

    const [searchValues, setSearchValues] = useState({
        orgId: '',
        licenseTypeId: '',
        applicationDate: '',
    });

    const resetSearchValues = {
        orgId: '',
        licenseTypeId: '',
        applicationDate: '',
    };

    // Fetch data whenever searchValues or currentPage changes
    useEffect(() => {
        getListData();
    }, [searchValues]);

    const handleReset = (resetForm, currentValues) => {
        if (!helpers.compareValuesAreSame(resetSearchValues, currentValues)) {

            resetForm({
                values: resetSearchValues, // Reset to initial values
            });

            // Always call getListData after resetting the form
            setSearchValues(resetSearchValues); // Update the search values state
            setCurrentPage(0); // Reset to the first page
            // No need to call getListData here; useEffect will handle it
        }
    }

    const searchData = (values) => {
        if (!helpers.compareValuesAreSame(searchValues, values)) {
            setSearchValues(values); // Update the search values
            setCurrentPage(0); // Reset to the first page
            // getListData(values); // Fetch data with the new search values
        }
    }

    const resetReportData = {
        draftedApplications: 0,
        learnerIssued: 0,
        passedInDrivingTest: 0,
        failedInDrivingTest: 0,
        applicationForSmartCard: 0,
        dlApproved: 0,
        dlRejected: 0,
    }

    const [reportData, setReportData] = useState(resetReportData)


    const getListData = async (values = searchValues) => {
        // console.log('searchValues', searchValues)
        const params = Object.assign(values);
        // console.log('params', params)

        // dispatch(setLoading(true));
        setReportData(resetReportData)
        try {
            const { data } = await RestApi.get('api/v1/driving-license/report', { params })
            setReportData(data)
            // console.log('data', data);
        } catch (error) {
            console.log('error', error)
        } finally {
            // dispatch(setLoading(false));
        }
    }

    return (
        <>
            {showFilter &&
                <div>
                    <div>
                        <div className="row mb-1">
                        </div>
                        <Formik
                            initialValues={searchValues}
                            onSubmit={(values, { resetForm }) => {
                                // console.log('Form Submitted', values);
                                searchData(values);
                            }}
                        >
                            {({ values, resetForm, setFieldValue }) => (
                                <FormikForm>

                                    <div className="card border-none bg-white mb-3">
                                        <div className="card-body p-2">
                                            <div className="row mb-1">
                                                <div className="col">
                                                    <h5 className='text-green-600 font-semibold'>{t('search_filter')}</h5>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12">
                                                    <Form.Group className="mb-3" controlId="orgId">
                                                        <label htmlFor="orgId" className='labelClass'>{t('office')}</label>
                                                        <Field
                                                            name="orgId"
                                                            component={ReactSelect}
                                                            options={dropdowns.orgList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.orgId}
                                                            onChange={(option) => {
                                                                setFieldValue('orgId', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="orgId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12">
                                                    <Form.Group className="mb-3" controlId="licenseTypeId">
                                                        <label htmlFor="licenseTypeId" className='labelClass'>{t('drivingLicenseType')}</label>
                                                        <Field
                                                            name="licenseTypeId"
                                                            component={ReactSelect}
                                                            options={dropdowns.drivingLicenseTypeList}
                                                            placeholder={t('pleaseSelectOne')}
                                                            value={values.licenseTypeId}
                                                            onChange={(option) => {
                                                                setFieldValue('licenseTypeId', option ? option.value : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="licenseTypeId" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                {/* <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12">
                                                    <Form.Group className="mb-3" controlId="applicationDate">
                                                        <label htmlFor="applicationDate" className='labelClass'>{t('applicationDate')}</label>
                                                        <Field type="date" name="applicationDate" value={values.applicationDate} className="form-control" placeholder={t('enterSomething')} />
                                                        <ErrorMessage name="applicationDate" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div> */}

                                                <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12">
                                                    <Form.Group className="mb-3" controlId="applicationDate">
                                                        <label htmlFor="applicationDate" className='labelClass'>{t('applicationDate')}</label>
                                                        <Flatpickr
                                                            className="form-control"
                                                            placeholder={t('pleaseSelectDate')}
                                                            options={{ dateFormat: 'Y-m-d' }}
                                                            name="applicationDate"
                                                            value={values.applicationDate}
                                                            onChange={(option) => {
                                                                const dateValue = helpers.dDate(option[0], 'YYYY-MM-DD')
                                                                setFieldValue('applicationDate', dateValue ? dateValue : '')
                                                            }}
                                                        />
                                                        <ErrorMessage name="applicationDate" component="div" className="text-danger" />
                                                    </Form.Group>
                                                </div>

                                                <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12 d-flex align-items-center justify-content-start float-right">
                                                    <div className="w-full flex mt-2">
                                                        <button type='submit' className="btn btn-success btn-sm w-full mr-2">{t('search')}</button>
                                                        <button type='reset' onClick={() => handleReset(resetForm, values)} className="btn btn-outline-danger btn-sm w-full">{t('clear')}</button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    {/* <SearchComponent values={values} clearData={() => handleReset(resetForm, values)} /> */}
                                </FormikForm>
                            )}
                        </Formik>
                    </div>
                </div>
            }

            <Loading loading={loading} />

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">{t('Driving License Report')}</h1>
                <PDFDownloadLink
                    className="btn btn-warning my-3"
                    document={<DrivingLicenseReportPdf reportData={reportData} />}
                    fileName="driving-license-report.pdf"
                >
                    {({ blob, url, loading, error }) =>
                        <>
                            <i className="bi bi-download mr-[10px]"></i>
                            {loading ? 'Generating PDF...' : 'Download Report'}
                        </>
                    }
                </PDFDownloadLink>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
                <div className="bg-white shadow-md rounded-xl p-6">
                    <span className="text-md font-semibold text-info">Drafted Applications</span>
                    <span className="text-4xl font-semibold text-slate-700 block mt-2">{reportData.draftedApplications}</span>
                </div>
                <div className="bg-white shadow-md rounded-xl p-6">
                    <span className="text-md font-semibold text-warning">Learner Issued</span>
                    <span className="text-4xl font-semibold text-slate-700 block mt-2">{reportData.learnerIssued}</span>
                </div>
                <div className="bg-white shadow-md rounded-xl p-6">
                    <span className="text-md font-semibold text-success">Passed In Driving Test</span>
                    <span className="text-4xl font-semibold text-slate-700 block mt-2">{reportData.passedInDrivingTest}</span>
                </div>
                <div className="bg-white shadow-md rounded-xl p-6">
                    <span className="text-md font-semibold text-danger">Failed In Driving Test</span>
                    <span className="text-4xl font-semibold text-slate-700 block mt-2">{reportData.failedInDrivingTest}</span>
                </div>
                <div className="bg-white shadow-md rounded-xl p-6">
                    <span className="text-md font-semibold text-info">Application For Smart Card</span>
                    <span className="text-4xl font-semibold text-slate-700 block mt-2">{reportData.applicationForSmartCard}</span>
                </div>
                <div className="bg-white shadow-md rounded-xl p-6">
                    <span className="text-md font-semibold text-success">Driving License Approved</span>
                    <span className="text-4xl font-semibold text-slate-700 block mt-2">{reportData.dlApproved}</span>
                </div>
                <div className="bg-white shadow-md rounded-xl p-6">
                    <span className="text-md font-semibold text-danger">Driving License Rejected</span>
                    <span className="text-4xl font-semibold text-slate-700 block mt-2">{reportData.dlRejected}</span>
                </div>
            </div>
        </>
    )
}

export default (DrivingLicenseReport)
