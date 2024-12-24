import Checkbox from '@/components/ui/Checkbox';
import ReactSelect from '@/components/ui/ReactSelect';
import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
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
import { Windows } from 'react-bootstrap-icons';
import { setLoading, setListData, setCurrentPage, setPaginationData, setResetPagination, toggleShowFilter } from '@/store/commonSlice';
import { Link } from "react-router-dom";


const NewDrivingLicenseFirstPayment = ({ t }) => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, windowSize, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;
    let { serviceRequestNo, isViewable } = useParams();
    isViewable = isViewable === 'true' ? true : false

    const [tin, setTin] = useState('');
    const [mobile, setMobile] = useState('');
    const [nid, setNid] = useState('');
    const [dob, setDob] = useState('');

    useEffect(() => {
        // if (serviceRequestNo) {
        // getPaymentDataByserviceRequestNo(serviceRequestNo);
        getServiceWithFeesByParentServiceCode();
        getUserNidInfo();
        // getUserTinInfoById();
        // } else {
        //     setPaymentData([]);
        // }
    }, [serviceRequestNo]);

    function generateGUID() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };

    const [serviceEconomicCode, setServiceEconomicCode] = useState('')
    const [paymentServiceList, setpaymentServiceList] = useState([])
    const [grandTotalItem, setGrandTotalItem] = useState({
        grandTotalMainFee: 0,
        grandTotalVat: 0,
        grandTotalAmount: 0,
    })

    const getServiceWithFeesByParentServiceCode = async () => {

        const serviceCode = 'before_driving_skills_test_fees';

        try {
            const { data } = await RestApi.get(`api/v1/admin/configurations/driving-related-service-fees-with-parent-service-code/${serviceCode}`)
            const feesList = data.list

            if (feesList && feesList.length) {
                feesList.forEach((item, index) => {
                    item.sl = index + 1
                    item.vat = Math.ceil(item.mainFee * (15 / 100)) // 15% Vat 
                    item.totalAmount = item.mainFee + item.vat
                })

                setGrandTotalItem({
                    grandTotalMainFee: feesList.reduce((r, d) => r + d.mainFee, 0),
                    grandTotalVat: feesList.reduce((r, d) => r + d.vat, 0),
                    grandTotalAmount: feesList.reduce((r, d) => r + d.totalAmount, 0),
                })
                setpaymentServiceList(feesList);
                setServiceEconomicCode(data.serviceEconomicCode);
            }

        } catch (error) {
            console.log('error', error)
        }
    }



    const getUserNidInfo = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-nid-info`)
            setNid(data.nidNumber);
            setMobile(data.mobile);
            setDob(helper.dDate(data.dob, 'yyyy-MM-DD'));
        } catch (error) {
            console.log('error', error)
        }
    }

    const getUserTinInfoById = async () => {

        try {
            const response = await RestApi.get('api/v1/admin/user-management/user/get-tin-info', { timeout: 60000 })

            setTin(response.data.tinNumber);
            setMobile(response.data.mobile);

        } catch (error) {
            console.log('error', error)
        }
    }

    const [isSubmitting, setSubmitting] = useState(false)

    const payNowServiceFee = async () => {
        setSubmitting(true);

        try {

            let paidAmount = grandTotalItem.grandTotalAmount

            const requestBody = {
                "serviceCode": 'before_driving_skills_test_fees',
                "serviceRequestNo": serviceRequestNo,
                "paymentid": helper.generateUniqueId(),
                "paidamount": paidAmount,
                // "tin": tin,
                "nid": nid,
                "dob": dob,
                "paymenttype": serviceEconomicCode && serviceEconomicCode.economicCode ? serviceEconomicCode.economicCode : '',
                "organization_code": serviceEconomicCode && serviceEconomicCode.orgCode ? serviceEconomicCode.orgCode : '',
                "mobile": mobile,
                "AddlEconomic": [
                    {
                        "paidamount": paidAmount,
                        "economic_code": serviceEconomicCode && serviceEconomicCode.economicCode ? serviceEconomicCode.economicCode : '',
                        "organization_code": serviceEconomicCode && serviceEconomicCode.orgCode ? serviceEconomicCode.orgCode : ''
                    }
                ]
            }

            dispatch(setLoading(true));

            let result = await RestApi.post('api/bsp/acs/v1/payment/initiate/online', requestBody, { timeout: 30000 });
            // dispatch(setLoading(false));
            console.log("result.data.url:" + result.data.url);
            console.log("result:" + result);
            if (result.data.url !== null && result.data.url !== '') {
                window.location.href = result.data.url;
            }

        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setSubmitting(false);
            dispatch(setLoading(false));
        }
    }

    return (
        <div>
            <div>
                <CardHeader>
                    <CardTitle className='mb-2'>Learner Driving License Fees</CardTitle>
                </CardHeader>
                <div>
                    <Loading loading={loading} loadingText={t('loading')} />

                    <div className='mb-3 card p-[24px] border-none min-h-[300px]'>
                        <div className="p-0 overflow-auto">
                            <p className='mb-2'><span className='font-semibold'>Economic Description with Code: </span>{serviceEconomicCode && `${serviceEconomicCode.economicDescriptionEn} (${serviceEconomicCode.economicCode})`}</p>
                            <table className="table-auto min-w-full text-left border border-gray-200">
                                <thead>
                                    <tr>
                                        <th>{t('sl')}</th>
                                        <th>{t('feesName')}</th>
                                        <th className='text-center'>{t('mainFees')}</th>
                                        <th className='text-center'>{t('vat')}</th>
                                        <th className='text-right'>{t('totalAmount')}</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {paymentServiceList && paymentServiceList.map((item, index) => (
                                        <tr key={item.sl} className='text-slate-500 text-sm'>
                                            <td>{item.sl}</td>
                                            <td>{currentLanguage === 'en' ? item.serviceNameEn : item.serviceNameBn}</td>
                                            <td className='text-center'>{currentLanguage === 'en' ? item.mainFee : toBengaliNumber(item.mainFee)}</td>
                                            <td className='text-center'>{currentLanguage === 'en' ? item.vat : toBengaliNumber(item.vat)}</td>
                                            <td className='text-right'>{currentLanguage === 'en' ? item.totalAmount : toBengaliNumber(item.totalAmount)}</td>
                                        </tr>
                                    ))}

                                    {paymentServiceList && paymentServiceList.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="text-center text-danger text-slate-500">
                                                <i className="fa fa-exclamation-circle"></i> {t('no_data_found')}
                                            </td>
                                        </tr>
                                    )}
                                    <tr className=' !border-slate-200 [&>*]:!bg-[#B6B6B6] [&>*]:!text-black [&>*]:font-semibold'>
                                        <td colSpan={2} className='text-center'>{t('grandTotal')}</td>
                                        <td className='text-center'>{currentLanguage === 'en' ? grandTotalItem.grandTotalMainFee : toBengaliNumber(grandTotalItem.grandTotalMainFee)}</td>
                                        <td className='text-center'>{currentLanguage === 'en' ? grandTotalItem.grandTotalVat : toBengaliNumber(grandTotalItem.grandTotalVat)}</td>
                                        <td className='text-right'>{currentLanguage === 'en' ? grandTotalItem.grandTotalAmount : toBengaliNumber(grandTotalItem.grandTotalAmount)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row mt-[24px] mb-6">
                            <div className="col-md-12 text-right">
                                <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/driving-license/new-driving-license/application-page2/${serviceRequestNo}`)}>{t('previous')}</button>
                                <button onClick={() => payNowServiceFee()} disabled={isSubmitting} className='btn btn-danger btn-rounded btn-xs ml-2'>Pay Now</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
}

export default withNamespaces()(NewDrivingLicenseFirstPayment)
