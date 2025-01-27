import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
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

const ApplicationForward = ({ t, show, onHide, onSave, editData }) => {

    const dispatch = useDispatch();
    const { hasPermission } = useCommonFunctions();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [vehicleInspectionData, setVehicleInspectionData] = useState({
        forwardTo: ""
    })
    const validationSchema = Yup.object().shape({
        forwardTo: Yup.string().required('h1is field is required'),
    });

    const submitData = async (values, setSubmitting, resetForm) => {

        // const params = Object.assign({ page: currentPage, size: pagination.perPage }, values)

        dispatch(setLoading(true));
        // dispatch(setListData([]));
        // try {
        //     const { data } = await RestApi.post('api/v1/admin/configurations/email-template/list', { params })
        //     dispatch(setListData(data.content));
        // } catch (error) {
        //     console.log('error', error)
        // } finally {
        //     dispatch(setLoading(false));
        // }
        console.log(values);
    }

    return (
        <>
            {editData &&
                <Modal show={show} onHide={onHide} size='xl'>
                    <Modal.Header closeButton>
                        {/* <Modal.Title>{t('applicationForward')}</Modal.Title> */}
                        <Modal.Title>{t('Vehicle Application Details')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row p-3">
                            <div className="card">
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

                        <div className="row px-1 mt-[24px]">
                            {hasPermission('permitted') && (
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="card px-[24px] border-none pb-[24px]">
                                        <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('vehicleInspection')}</h3>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <VehicleInspection editData={editData}></VehicleInspection>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {hasPermission('permitted') && (
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="card px-[24px] border-none pb-[24px]">
                                        <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('vehicleApprovalSection')}</h3>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <VehicleApprove editData={editData}></VehicleApprove>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* <div className="row">
                            <div className="col-md-6">
                                <VehicleInspection editData={editData}></VehicleInspection>
                            </div>
                            <div className="col-md-6">
                                <RevenueCheck editData={editData}></RevenueCheck>
                            </div>
                        </div> */}
                        {/* <div className="row mt-3">
                            <div className="col-md-6">
                                <VehicleApprove editData={editData}></VehicleApprove>
                            </div>
                            <div className="col-md-6">
                            </div>
                        </div> */}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>{t('close')}</Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    );
};

export default withNamespaces()(ApplicationForward);
