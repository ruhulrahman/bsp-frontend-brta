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
import MviSubmission from "./MviSubmission.jsx"
import DrivingLicenseApprove from "./DrivingLicenseApprove.jsx"
import useCommonFunctions from '@/hooks/useCommonFunctions';
import helper, { toaster } from '@/utils/helpers.js';

const DLApprovalModal = ({ t, show, onHide, onSave, editData, listReload }) => {

    const { hasPermission } = useCommonFunctions();

    return (
        <>
            {editData &&
                <Modal show={show} onHide={onHide} size='xl'>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('Driving License Application Details')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row px-3">
                            <div className="card pt-[10px] border-none">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h1 className='font-normal mb-3'>Service Request No: {editData.serviceRequestNo}</h1>
                                            <h1 className='font-normal mb-3'>Applicant Name: {editData.applicantName}</h1>
                                            <h1 className='font-normal mb-3'>Applicant Type: {editData.applicantType}</h1>
                                            <h1 className='font-normal mb-3'>License Type: {editData.licenseType}</h1>

                                        </div>
                                        <div className="col-md-6">
                                            <h1 className='font-normal mb-3'>Driving Issued Authority: {editData.drivingIssueAuthority}</h1>
                                            <h1 className='font-normal mb-3'>Nid: {editData.nid}</h1>
                                            <h1 className='font-normal mb-3'>Application Date: {helper.dDate(editData.applicationDate)}</h1>
                                            <h1 className='font-normal mb-3'>Application Status: <span className={`badge bg-${editData.applicationStatusColor}`}>{editData.applicationStatus}</span></h1>
                                            {editData.approvalDate && (
                                                <h1 className='font-normal mb-3'>Approval Date: <span className={`badge bg-${editData.applicationStatusColor}`}>{helper.dDate(editData.approvalDate)}</span></h1>
                                            )}
                                            {editData.rejectionDate && (
                                                <h1 className='font-normal mb-3'>Rejected Date: <span className={`badge bg-${editData.applicationStatusColor}`}>{helper.dDate(editData.rejectionDate)}</span></h1>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row px-1 mt-[24px]">

                            {hasPermission('dl_exam_submission') && (
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="card px-[24px] border-none pb-[24px]">
                                        <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('reportSubmission')}</h3>

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <MviSubmission editData={editData} onCloseModal={onHide} listReload={listReload}></MviSubmission>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {hasPermission('driving_license_approval') && (
                                <>

                                    <div className="col-md-6">
                                        <div className="card px-[24px] border-none pb-[24px]">
                                            <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('reportSubmission')}</h3>

                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <MviSubmission editData={editData} onCloseModal={onHide} listReload={listReload}></MviSubmission>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="card px-[24px] border-none pb-[24px]">
                                            <h3 className="text-xl text-green-600 mb-6 pt-[24px]">{t('approvalSection')}</h3>

                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <DrivingLicenseApprove editData={editData} onCloseModal={onHide} listReload={listReload}></DrivingLicenseApprove>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
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

export default withNamespaces()(DLApprovalModal);
