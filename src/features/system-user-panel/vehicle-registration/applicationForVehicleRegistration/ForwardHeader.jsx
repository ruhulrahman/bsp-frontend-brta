import React, { useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import Loading from '@/components/common/Loading';
import ReactSelect from '@/components/ui/ReactSelect';
import * as Yup from 'yup';
import { setListData, setLoading, toggleShowFilter } from '@/store/commonSlice';
import RestApi from '@/utils/RestApi';
import VehicleInspection from "./VehicleInspection.jsx"
import RevenueCheck from "./RevenueCheck.jsx"
import VehicleApprove from "./VehicleApprove.jsx"
import useCommonFunctions from '@/hooks/useCommonFunctions';
import helpers, { toaster } from '@/utils/helpers.js';

const ForwardHeader = ({ editData = null }) => {
    const { t } = useTranslation();

    console.log('editData', editData)

    const { hasPermission } = useCommonFunctions();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    return (
        <>
            {editData &&
                <div className="row px-3 py-1">
                    <div className="card border-none">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h1 className='font-normal mb-3'>Service Request No: {editData.serviceRequestNo}</h1>
                                    <h1 className='font-normal mb-3'>Chassis No: {editData.chassisNumber}</h1>
                                    <h1 className='font-normal mb-3'>Engine No: {editData.engineNumber}</h1>
                                    <h1 className='font-normal mb-3'>Vehicle Class: {editData.vehicleClassName}</h1>

                                </div>
                                <div className="col-md-6">
                                    <h1 className='font-normal mb-3'>CC: {editData.ccOrKw}</h1>
                                    <h1 className='font-normal mb-3'>Manufacturing Year: {editData.manufacturingYear}</h1>
                                    <h1 className='font-normal mb-3'>Application Date: {helpers.dDate(editData.applicationDate)}</h1>
                                    {/* <h1 className='font-normal mb-3'>Application Status: {editData.applicationStatusName}</h1> */}
                                    <h1 className='font-normal mb-3'>Application Status: <span className={`badge bg-${editData.applicationStatusColor}`}>{editData.applicationStatusName}</span></h1>
                                    {editData.approvalDate && (
                                        <h1 className='font-normal mb-3'>Approval Date: <span className={`badge bg-${editData.applicationStatusColor}`}>{helpers.dDate(editData.approvalDate)}</span></h1>
                                    )}
                                    {editData.rejectionDate && (
                                        <h1 className='font-normal mb-3'>Rejected Date: <span className={`badge bg-${editData.applicationStatusColor}`}>{helpers.dDate(editData.rejectionDate)}</span></h1>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default (ForwardHeader);
