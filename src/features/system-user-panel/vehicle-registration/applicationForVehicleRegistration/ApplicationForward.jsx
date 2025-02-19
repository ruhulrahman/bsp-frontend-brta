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
import ForwardHeader from './ForwardHeader.jsx';

const ApplicationForward = ({ show = false, onHide = () => {}, onSave = () => {}, editData = null }) => {
const { t } = useTranslation();

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

    const reloadList = (serviceRequestId) => {
        onSave(serviceRequestId)
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
                        
                        <ForwardHeader editData={editData}/>

                        <div className="row px-1 mt-[24px]">
                            {hasPermission('permitted') && (
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="card px-[24px] border-none pb-[24px]">
                                        <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('vehicleInspection')}</h3>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <VehicleInspection editData={editData} reloadList={reloadList}></VehicleInspection>
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
                                                <VehicleApprove editData={editData} reloadList={reloadList}></VehicleApprove>
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

export default (ApplicationForward);
