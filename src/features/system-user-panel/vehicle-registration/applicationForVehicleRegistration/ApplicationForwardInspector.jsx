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
import { toaster } from '@/utils/helpers.js';
import VehicleInspection from "./VehicleInspection.jsx"
import RevenueCheck from "./RevenueCheck.jsx"
import VehicleApprove from "./VehicleApprove.jsx"
import useCommonFunctions from '@/hooks/useCommonFunctions';

const ApplicationForwardInspector = ({ t, show, onHide, onSave, editData }) => {

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
                        <Modal.Title>{t('applicationForward')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row p-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h1 className='font-semibold mb-3'>Service Request No: {editData.serviceRequestNo}</h1>
                                            <h1 className='font-semibold mb-3'>Chassis No: {editData.chassisNumber}</h1>
                                            <h1 className='font-semibold mb-3'>Engine No: {editData.engineNumber}</h1>
                                            <h1 className='font-semibold mb-3'>Vehicle Class: {editData.vehicleClassName}</h1>

                                        </div>
                                        <div className="col-md-6">
                                            <h1 className='font-semibold mb-3'>CC: {editData.ccOrKw}</h1>
                                            <h1 className='font-semibold mb-3'>Manufacturing Year: {editData.manufacturingYear}</h1>
                                            <h1 className='font-semibold mb-3'>Application Date: {editData.applicationDate}</h1>
                                            <h1 className='font-semibold mb-3'>Application Status: {editData.applicationStatusName}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6">
                                <VehicleInspection editData={editData}></VehicleInspection>
                            </div>
                            <div className="col-md-3"></div>                            
                        </div>                       

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>{t('close')}</Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    );
};

export default withNamespaces()(ApplicationForwardInspector);
