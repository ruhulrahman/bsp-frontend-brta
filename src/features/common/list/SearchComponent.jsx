import React, { useState } from 'react';
import './SearchComponent.css'; // Import the CSS file
import { withNamespaces } from 'react-i18next';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import Form from 'react-bootstrap/Form';
import ReactSelect from '@/components/ui/ReactSelect';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import { Label } from '@headlessui/react';

const SearchComponent = ({ t }) => {

    const { activeStatusList, loading, listData, windowSize, pagination, showFilter, dropdowns, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [searchValues, setSearchValues] = useState({
        serviceRequestNo: '',
        chassisNumber: '',
        engineNumber: '',
        nid: '',
        mobile: '',
        applicationDate: '',
    });

    const resetSearchValues = {
        serviceRequestNo: '',
        chassisNumber: '',
        engineNumber: '',
        nid: '',
        mobile: '',
        applicationDate: '',
    };

    const handleReset = (resetForm) => {
        resetForm({
            values: resetSearchValues, // Reset to initial values
        });
    };

    return (
        <div className="card bg-gray-300 mb-3">
            <div className="card-body p-2">
                <div className="row mb-1">
                    <div className="col">
                        <h5 className='text-dark font-semibold'>{t('search_filter')}</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 col-lg-3 col-sm-12">
                        <Form.Group className="mb-3" controlId="serviceRequestNo">
                            <label htmlFor="serviceRequestNo" className='labelClass'>Service Request No</label>
                            <Field type="text" name="serviceRequestNo" className="form-control" />
                            <ErrorMessage name="serviceRequestNo" component="div" className="text-danger" />
                        </Form.Group>
                    </div>

                    <div className="col-md-4 col-lg-3 col-sm-12">
                        <Form.Group className="mb-3" controlId="chassisNumber">
                            <label htmlFor="chassisNumber" className='labelClass'>Chassis No</label>
                            <Field type="text" name="chassisNumber" className="form-control" />
                            <ErrorMessage name="chassisNumber" component="div" className="text-danger" />
                        </Form.Group>
                    </div>

                    <div className="col-md-4 col-lg-3 col-sm-12">
                        <Form.Group className="mb-3" controlId="engineNumber">
                            <label htmlFor="engineNumber" className='labelClass'>Engine No</label>
                            <Field type="text" name="engineNumber" className="form-control" />
                            <ErrorMessage name="engineNumber" component="div" className="text-danger" />
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 col-lg-3 col-sm-12">
                        <Form.Group className="mb-3" controlId="nid">
                            <label htmlFor="nid" className='labelClass'>NID</label>
                            <Field type="text" name="nid" className="form-control" />
                            <ErrorMessage name="nid" component="div" className="text-danger" />
                        </Form.Group>
                    </div>

                    <div className="col-md-4 col-lg-3 col-sm-12">
                        <Form.Group className="mb-3" controlId="mobile">
                            <label htmlFor="mobile" className='labelClass'>Mobile No</label>
                            <Field type="text" name="mobile" className="form-control" />
                            <ErrorMessage name="mobile" component="div" className="text-danger" />
                        </Form.Group>
                    </div>

                    <div className="col-md-4 col-lg-3 col-sm-12">
                        <Form.Group className="mb-3" controlId="applicationDate">
                            <label htmlFor="applicationDate" className='labelClass'>Application Date</label>
                            <Field type="text" name="applicationDate" className="form-control" />
                            <ErrorMessage name="applicationDate" component="div" className="text-danger" />
                        </Form.Group>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 col-lg-3 col-sm-12"></div>
                    <div className="col-md-4 col-lg-3 col-sm-12"></div>
                    <div className="col-md-4 col-lg-3 col-sm-12"></div>
                    <div className="col-md-4 col-lg-3 col-sm-12">
                        <div className="d-flex content-between">
                            <button type='submit' className="btn btn-success btn-sm w-full mr-2">{t('search')}</button>
                            <button type='reset' onClick={() => handleReset(resetForm)} className="btn btn-outline-danger btn-sm w-full">{t('clear')}</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default withNamespaces()(SearchComponent);
