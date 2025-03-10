import React, { useState } from 'react';
import './SearchComponent.css'; // Import the CSS file
import { withTranslation, useTranslation } from 'react-i18next';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import Form from 'react-bootstrap/Form';
import ReactSelect from '@/components/ui/ReactSelect';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import { Label } from '@headlessui/react';
import Flatpickr from "react-flatpickr";
import helpers, { toaster } from '@/utils/helpers.js';

const DrivingLicenseApplicationListSearchComponent = ({ setFieldValue, values, clearData}) => {
    const { t } = useTranslation();

    const { activeStatusList, loading, listData, windowSize, pagination, showFilter, dropdowns, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    return (
        <div className="card border-none mb-3">
            <div className="card-body p-2">
                <div className="row mb-1">
                    <div className="col">
                        <h5 className='text-green-600 font-semibold'>{t('search_filter')}</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12">
                        <Form.Group className="mb-3" controlId="serviceRequestNo">
                            <label htmlFor="serviceRequestNo" className='labelClass'>Service Request No</label>
                            <Field type="text" name="serviceRequestNo" className="form-control" placeholder={t('enterSomething')} />
                            <ErrorMessage name="serviceRequestNo" component="div" className="text-danger" />
                        </Form.Group>
                    </div>

                    <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12">
                        <Form.Group className="mb-3" controlId="learnerNo">
                            <label htmlFor="learnerNo" className='labelClass'>Learner No</label>
                            <Field type="text" name="learnerNo" className="form-control" placeholder={t('enterSomething')} />
                            <ErrorMessage name="learnerNo" component="div" className="text-danger" />
                        </Form.Group>
                    </div>
                    <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12">
                        <Form.Group className="mb-3" controlId="nid">
                            <label htmlFor="nid" className='labelClass'>NID</label>
                            <Field type="text" name="nid" className="form-control" placeholder={t('enterSomething')} />
                            <ErrorMessage name="nid" component="div" className="text-danger" />
                        </Form.Group>
                    </div>

                    <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12">
                        <Form.Group className="mb-3" controlId="mobile">
                            <label htmlFor="mobile" className='labelClass'>Mobile No</label>
                            <Field type="text" name="mobile" className="form-control" placeholder={t('enterSomething')} />
                            <ErrorMessage name="mobile" component="div" className="text-danger" />
                        </Form.Group>
                    </div>

                    {/* <div className="col-md-4 col-lg-3 col-xxl-2 col-sm-12">
                        <Form.Group className="mb-3" controlId="applicationDate">
                            <label htmlFor="applicationDate" className='labelClass'>Application Date</label>
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
                            <button type='reset' onClick={() => clearData()} className="btn btn-outline-danger btn-sm w-full">{t('clear')}</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default (DrivingLicenseApplicationListSearchComponent);
