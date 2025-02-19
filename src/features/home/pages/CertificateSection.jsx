import logo from '@/assets/images/logo.png';
import i18n from '@/i18n';
import React, { useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import slider6 from '@/assets/images/slider/slider-6.jpg';
import carDrive from '@/assets/images/home/car-drive.png';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
// import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import RestApi from '@/utils/RestApi';
import Loading from '@/components/common/Loading';
import { setListData, setLoading, toggleShowFilter } from '@/store/commonSlice';

const CertificateSection = () => {
const { t } = useTranslation();
    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)

    const setLanguage = (language) => {
        localStorage.setItem('preferredLanguage', language);
    }

    const changeLanguage = (lng) => {
        setLanguage(lng)
        const preferredLanguage = localStorage.getItem('preferredLanguage');
        i18n.changeLanguage(preferredLanguage);
    }

    let preferredLanguage = localStorage.getItem('preferredLanguage');
    preferredLanguage = preferredLanguage ? preferredLanguage : 'bn'

    const navigate = useNavigate();

    const isAuthenticated = localStorage.getItem('token') && localStorage.getItem('userTypeCode') ? true : false;
    const userTypeCode = localStorage.getItem('userTypeCode')

    let dashboardRedirectUrl = ''

    if (userTypeCode === 'system_admin') {
        dashboardRedirectUrl = '/admin/dashboard'
    } else if (userTypeCode === 'system_user') {
        dashboardRedirectUrl = '/system-user/dashboard'
    } else if (userTypeCode === 'applicant') {
        dashboardRedirectUrl = '/applicant-panel/dashboard'
    }

    const [initialValues, setInitialValues] = useState({
        transactionNo: '',
        chasisNo: '',
    })
    const validationSchema = Yup.object().shape({
        // vehicleTypeId: Yup.string().required('The Field is required'),
    });

    return (
        <div className="container-fluid mx-auto my-[150px] px-4">
            <div className="flex flex-wrap justify-center sm:gap-6 lg:gap-6 xl:gap-20 4xl:gap-48">
                {/* Card 1 */}
                <div className="flex flex-col lg:max-h-[395px] 3xl:max-h-[600px] sm:w-[460px] 3xl:w-[800px] p-12 shadow-lg rounded-lg bg-white">
                    <h3 className="text-[26px] text-center mb-6">{t('trusteeBoardCertificate')}</h3>
                    <div className="space-y-6">
                        <div>
                            <Form.Group className="mb-[24px]">
                                <Form.Label>{t('transactionNo')}</Form.Label>
                                <input type="text" name="transactionNo" className="form-control" />
                            </Form.Group>
                        </div>
                        <div>
                            <Form.Group className="mb-[24px]">
                                <Form.Label>{t('last4DigitOfChassisNumber')}</Form.Label>
                                <input type="text" name="chassisNo" className="form-control" />
                            </Form.Group>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button type="submit" className="btn btn-success w-full">{t('view')}</button>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="flex flex-col lg:max-h-[395px] 3xl:max-h-[600px] w-full sm:w-[460px] 3xl:w-[800px] p-12 shadow-lg rounded-lg bg-white">
                    <h3 className="text-[26px] text-center mb-6">{t('eFitnessResult')}</h3>
                    <div className="space-y-6">
                        <div>
                            <Form.Group className="mb-[24px]">
                                <Form.Label>{t('serviceRequestNo')}</Form.Label>
                                <input type="text" name="serviceRequestNo" className="form-control" />
                            </Form.Group>
                        </div>
                        <div>
                            <Form.Group className="mb-[24px]">
                                <Form.Label>{t('last4DigitOfChassisNumber')}</Form.Label>
                                <input type="text" name="chassisNo" className="form-control" />
                            </Form.Group>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button type="submit" className="btn btn-success w-full">{t('view')}</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default (CertificateSection);
