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
import helpers, { toaster } from '@/utils/helpers.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'
import { Windows } from 'react-bootstrap-icons';
import { setLoading, setListData, setCurrentPage, setPaginationData, setResetPagination, toggleShowFilter } from '@/store/commonSlice';
import { Link } from "react-router-dom";


const VehicleRegistrationFirstPayment = ({ t }) => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, windowSize, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;
    // let { serviceRequestId, isViewable } = useParams();
    let { serviceRequestId, serviceRequestNo } = useParams();

    const [paymentData, setPaymentData] = useState([
        {
            sl: '1',
            feeName: 'Label for Fitness',
            feeAmount: 300,
            vat: 45,
            totalAmount: 345,
        },
        {
            sl: '2',
            feeName: 'Fitness Fee',
            feeAmount: 800,
            vat: 120,
            totalAmount: 920,
        },
        {
            sl: '3',
            feeName: 'Label for Road Tax',
            feeAmount: 250,
            vat: 38,
            totalAmount: 288,
        },
        {
            sl: '4',
            feeName: 'Road Tax Fee (Tax Token)',
            feeAmount: 2200,
            vat: 330,
            totalAmount: 2530,
        },
        {
            sl: '5',
            feeName: 'Advance Income tax',
            feeAmount: 25000,
            vat: 3750,
            totalAmount: 28750,
        },
        {
            sl: '6',
            feeName: 'Retro Reflective number plate Fee',
            feeAmount: 2000,
            vat: 300,
            totalAmount: 2300,
        },
        {
            sl: '7',
            feeName: 'Digital Registration Certificate Fee',
            feeAmount: 1500,
            vat: 225,
            totalAmount: 1725,
        },
        {
            sl: '8',
            feeName: 'Vehicle Registration Fee',
            feeAmount: 15000,
            vat: 2250,
            totalAmount: 17250,
        },
    ]);

    const [tin, setTin] = useState('');
    const [mobile, setMobile] = useState('');
    const [nid, setNid] = useState('');
    const [dob, setDob] = useState('');

    const [serviceCode, setServiceCode] = useState('vehicle_registration_related_final_fees')
    const [serviceEconomicCode, setServiceEconomicCode] = useState('')
    const [paymentServiceList, setPaymentServiceList] = useState([])
    const [grandTotalItem, setGrandTotalItem] = useState({
        grandTotalServiceFee: 0,
        grandTotalVat: 0,
        grandTotalAmount: 0,
    })

    useEffect(() => {
        if (serviceRequestId) {
            // getPaymentDataByServiceRequestId(serviceRequestId);
            getServiceWithFeesByParentServiceCode(serviceRequestId)
            getUserNidInfo()
            getUserTinInfoById();
        } else {
            setPaymentData([]);
        }
    }, [serviceRequestId]);
    
    const getServiceWithFeesByParentServiceCode = async (serviceRequestId) => {

        // const serviceCode = 'vehicle_registration_related_final_fees';
        const params = Object.assign({ serviceRequestId: serviceRequestId, serviceCode: serviceCode})

        try {
            const { data } = await RestApi.get(`api/v1/admin/configurations/vehicle-related-specific-service-fees`, { params })
            let feesList = data.list

            if (feesList && feesList.length) {
                feesList = feesList.filter(item => item.serviceFee)
                feesList.forEach((item, index) => {
                    item.sl = index + 1
                    item.vat = Math.ceil(item.serviceFee * (15 / 100)) // 15% Vat 
                    item.totalAmount = item.serviceFee + item.vat
                })

                setGrandTotalItem({
                    grandTotalServiceFee: feesList.reduce((r, d) => r + d.serviceFee, 0),
                    grandTotalVat: feesList.reduce((r, d) => r + d.vat, 0),
                    grandTotalAmount: feesList.reduce((r, d) => r + d.totalAmount, 0),
                })
                setPaymentServiceList(feesList);
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
            setDob(helpers.dDate(data.dob, 'yyyy-MM-DD'));
        } catch (error) {
            console.log('error', error)
        }
    }

    const getUserTinInfoById = async () => {

        try {
            const response = await RestApi.get('api/v1/admin/user-management/user/get-tin-info', { timeout: 60000 })

            console.log('data.tinNumber: ', response.data.tinNumber);
            setTin(response.data.tinNumber);
            setMobile(response.data.mobile);

        } catch (error) {
            console.log('error', error)
        }
    }

    const onSubmit = async (values, setSubmitting, resetForm) => {

        try {
            console.log("values: ", values);

            let paidAmount = values.reduce((r, d) => r + d.totalAmount, 0);
            console.log("paidAmount: " + paidAmount);

            const requestBody = {
                // "paymentid": generateGUID().slice(0,10),
                "paymentid": null,
                "paidamount": paidAmount,
                "tin": tin,
                "paymenttype": "1145101",
                "organization_code": "1500301132187",
                "mobile": mobile,
                "AddlEconomic": [
                    {
                        "paidamount": paidAmount,
                        "economic_code": "1145101",
                        "organization_code": "1500301132187"
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

            // if (result.data.success) {
            //     navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page2/${initialValues.id}`)
            // }

        } catch (error) {
            console.log('error', error)
            // myForm.value.setErrors({ form: mixin.cn(error, 'response.data', null) });
        } finally {
            setSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    const [isSubmitting, setSubmitting] = useState(false)
    const payNowServiceFee = async () => {

        setSubmitting(true);

        try {

            let paidAmount = grandTotalItem.grandTotalAmount

            const requestBody = {
                "serviceType": 'vehicle',
                "serviceCode": serviceCode,
                "serviceRequestNo": serviceRequestNo,
                "paymentid": helpers.generateUniqueId(),
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
            console.log("result.data.url:" + result.data.url);
            console.log("result:" + result);
            if (result.data.url !== null && result.data.url !== '') {
                window.location.href = result.data.url;
            }

        } catch (error) {
            console.log('error', error)
        } finally {
            setSubmitting(false);
            dispatch(setLoading(false));
        }
    }

    return (
        <div>
            <div>
                <CardHeader>
                    <CardTitle className='mb-2'>Vehicle Registration Related Fees</CardTitle>
                </CardHeader>
                <div>
                  
                                <Loading loading={loading} loadingText={t('loading')} />

                                <Card className='mb-3'>
                                    <CardBody>
                                        <div>
                                            <div className="p-0 overflow-auto min-h-[300px]">
                                                <table className="table-auto min-w-full text-left border border-gray-200">
                                                    <thead>
                                                        <tr>
                                                            <th>Serial</th>
                                                            <th>Fees Name</th>
                                                            <th className='text-center'>Fees Amount</th>
                                                            <th className='text-center'>VAT</th>
                                                            <th className='text-right'>Total Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                    {paymentServiceList && paymentServiceList.map((item, index) => (
                                                        <tr key={item.sl} className='text-slate-500 text-sm'>
                                                            <td>{item.sl}</td>
                                                            <td>{currentLanguage === 'en' ? item.serviceNameEn : item.serviceNameBn}</td>
                                                            <td className='text-center'>{currentLanguage === 'en' ? item.serviceFee : toBengaliNumber(item.serviceFee)}</td>
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
                                                        <td className='text-center'>{currentLanguage === 'en' ? grandTotalItem.grandTotalServiceFee : toBengaliNumber(grandTotalItem.grandTotalServiceFee)}</td>
                                                        <td className='text-center'>{currentLanguage === 'en' ? grandTotalItem.grandTotalVat : toBengaliNumber(grandTotalItem.grandTotalVat)}</td>
                                                        <td className='text-right'>{currentLanguage === 'en' ? grandTotalItem.grandTotalAmount : toBengaliNumber(grandTotalItem.grandTotalAmount)}</td>
                                                    </tr>

                                                        {/* {paymentData && paymentData.map((item, index) => (
                                                            <tr key={item.sl} className='text-slate-500 text-sm'>
                                                                <td>{item.sl}</td>
                                                                <td>{item.feeName}</td>
                                                                <td>{item.feeAmount}</td>
                                                                <td>{item.vat}</td>
                                                                <td>{item.totalAmount}</td>
                                                            </tr>
                                                        ))}

                                                        {paymentData && paymentData.length === 0 && (
                                                            <tr>
                                                                <td colSpan={8} className="text-center text-danger text-slate-500">
                                                                    <i className="fa fa-exclamation-circle"></i> {t('no_data_found')}
                                                                </td>
                                                            </tr>
                                                        )}
                                                        <tr className=' !border-slate-200 [&>*]:!bg-[#B6B6B6] [&>*]:!text-black [&>*]:font-semibold'>
                                                            <td colSpan={2} className='text-center'>Grand Total</td>
                                                            <td>{paymentData && paymentData.reduce((item, index) => item + index.feeAmount, 0)}</td>
                                                            <td>{paymentData && paymentData.reduce((item, index) => item + index.vat, 0)}</td>
                                                            <td>{paymentData && paymentData.reduce((item, index) => item + index.totalAmount, 0)}</td>
                                                        </tr> */}

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="row mt-[24px] mb-6">
                                            <div className="col-md-12 text-right">
                                                <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/application-list`)}>{t('previous')}</button>
                                                <button onClick={() => payNowServiceFee()} disabled={isSubmitting} className='btn btn-danger btn-rounded btn-xs ml-2'>Pay Now</button>
                                            </div>
                                        </div>

                                {/* <div className="row mt-2 mb-6">
                                    <div className="col-md-12 text-right">
                                        <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page4/${initialValues.id}`)}>{t('previous')}</button>
                                        <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs ml-2'>Pay Now</button>
                                    </div>
                                </div> */}
                </div>
            </div>
        </div >
    );
}

export default withNamespaces()(VehicleRegistrationFirstPayment)
