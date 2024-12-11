import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import { Container, Card, CardBody, CardHeader, CardTitle, Form, Row, Col } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import i18n from '@/i18n';
import Loading from '@/components/common/Loading';
import { useParams, useNavigate } from 'react-router-dom';
import helper, { toaster } from '@/utils/helpers.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import DLMedicalForm from '@/assets/documents/driving-license/DLMedicalForm.pdf';
import questionMark from '@/assets/images/questionMark.png';

const DrivingLicenseApplicationPreRequisites = ({ t }) => {

    let { serviceRequestId, isViewable } = useParams()
    isViewable = isViewable === 'true' ? true : false
    const navigate = useNavigate();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const prerequisites = [
        {
            text: 'Medical Certificate from a registered doctor (Maximum size 600 KB). To download the Medical Certificate form',
            link: DLMedicalForm,
            type: 'file',
        },
        {
            text: 'Scanned copy of National ID (Maximum size 600 KB).',
        },
        {
            text: 'Scanned copy of Utility Bill (Maximum size 600 KB). [If applicant’s present address is not the same as National ID address, attach present address’s Utility Bill.]',
        },
        {
            text: 'Scanned copy of Educational Certificate (Maximum size 600 KB). [Minimum class 8 pass.]',
        },
        {
            text: 'An applicant/user can apply for only one driving license.',
        },
        {
            text: 'The driving license application will be under the purview of the concerned BRTA circle office based on the thana mentioned at the current address of the user.',
        },
        {
            text: 'The applicant/user must fill in the correct information in both Bengali and English in the online application.',
        },
        {
            text: 'Legal action will be taken against those who provide false information while submitting a smart driving license application.',
        },
    ];


    return (
        <>
            <Row>
                <Col>
                    <Card className="shadow-lg border-none">
                        <div className="p-[40px]">
                            <img src={questionMark} className='w-[216px] border-3 border-white rounded-full' alt="Question Mark" />

                            <h2 className="text-[22px] font-semibold text-green-600 mt-[24px] mb-2">Prerequisites for Driving License Application</h2>
                            <p className="mb-2 font-[14px] text-[#586576]">
                                Please note that the application process may take some time. To ensure smooth progress, make sure you have the required documents in good condition and within the specified file size limit.
                            </p>
                            <hr className='mb-4' />
                            <ul className="list-decimal pl-5 space-y-2 text-sm text-[#586576]">
                                {prerequisites.map((item, index) => (
                                    <li key={index} className="mb-1">
                                        {item.link ? (
                                            item.type === 'file' ? (
                                                <>
                                                    <span className="mr-1 xl:text-[16px] xs:text-[12px]">{item.text}</span>
                                                    <a href={item.link} download className="text-blue-600 xl:text-[16px] xs:text-[12px] hover:underline">
                                                        Click here
                                                    </a>
                                                </>
                                            ) : (
                                                <a href={item.link} className="text-blue-600 xl:text-[16px] xs:text-[12px] hover:underline">
                                                    {item.text}
                                                </a>
                                            )
                                        ) : (
                                            <span className="xl:text-[16px] xs:text-[12px]">{item.text}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="row">
                                <div className="col-md-12 text-right">
                                    <button className='btn btn-success mt-5' onClick={() => navigate('/applicant-panel/driving-license/new-driving-license/application-page1')}>
                                        <i className="fa fa-check"></i> Agree
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default withNamespaces()(DrivingLicenseApplicationPreRequisites);