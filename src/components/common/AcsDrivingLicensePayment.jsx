import { ErrorMessage, Field, Formik, Form as FormikForm, FieldArray } from 'formik';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Form } from 'react-bootstrap';
import { withTranslation, useTranslation } from 'react-i18next';
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
import { setLoading, setListData, setCurrentPage, setPaginationData, setResetPagination, toggleShowFilter } from '@/store/commonSlice';
import { Link } from "react-router-dom";


const AcsDrivingLicensePayment = ({ title, backUrl, serviceCode, serviceRequestId, serviceRequestNo }) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, windowSize, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [tin, setTin] = useState('');
    const [mobile, setMobile] = useState('');
    const [nid, setNid] = useState('');
    const [dob, setDob] = useState('');
    const [anonymousClientIdentity, setAnonymousClientIdentity] = useState("");
    const [anonymousClientName, setAnonymousClientName] = useState("");
    const [anonymousClientAddress, setAnonymousClientAddress] = useState("");

    const [serviceEconomicCode, setServiceEconomicCode] = useState('')
    const [paymentServiceList, setPaymentServiceList] = useState([])
    const [grandTotalItem, setGrandTotalItem] = useState({
        grandTotalServiceFee: 0,
        grandTotalVat: 0,
        grandTotalAmount: 0,
    })

    useEffect(() => {
        if (serviceRequestId) {
            getPaymentDataByServiceRequestId(serviceRequestId)
            getUserNidInfo()
            // getUserTinInfoById();
        } else {
            setPaymentData([]);
        }
    }, [serviceRequestId]);


    const [AddlEconomic, setAddlEconomic] = useState([]);

    const getPaymentDataByServiceRequestId = async (serviceRequestId) => {

        const params = Object.assign({ serviceRequestId: serviceRequestId, serviceCode: serviceCode })

        try {
            // const { data } = await RestApi.get(`api/v1/admin/configurations/driving-related-service-fees-with-parent-service-code/${serviceCode}`)
            const { data } = await RestApi.get(`api/v1/admin/configurations/driving-related-service-fees-with-parent-service-code`, { params })
            let feesList = data.list

            if (feesList && feesList.length) {
                feesList = feesList.filter(item => item.serviceFee)

                feesList.forEach((item, index) => {
                    item.sl = index + 1
                    item.vat = Math.ceil(item.serviceFee * (15 / 100)) // 15% Vat 
                    item.totalAmount = item.serviceFee + item.vat
                    if (item.serviceEconomicCode?.economicCode) {
                        const economicCodeWithValue = {
                            paidamount: item.totalAmount,
                            economic_code: item.serviceEconomicCode?.economicCode,
                            organization_code: item.serviceEconomicCode?.orgCode
                        }
                        AddlEconomic.push(economicCodeWithValue)
                    }
                })

                // Using Map for merging and summing up paidamount
                const mergedAddlEconomic = Array.from(
                    AddlEconomic.reduce((map, { economic_code, paidamount, organization_code }) => {
                        if (!map.has(economic_code)) {
                            map.set(economic_code, { economic_code, paidamount: 0, organization_code: '' });
                        }
                        map.get(economic_code).paidamount += paidamount;
                        map.get(economic_code).organization_code = organization_code;
                        return map;
                    }, new Map()).values()
                )

                setAddlEconomic(mergedAddlEconomic)

                setGrandTotalItem({
                    grandTotalServiceFee: feesList.reduce((r, d) => r + d.serviceFee, 0),
                    grandTotalVat: feesList.reduce((r, d) => r + d.vat, 0),
                    grandTotalAmount: feesList.reduce((r, d) => r + d.totalAmount, 0),
                })
                setPaymentServiceList(feesList)
                setServiceEconomicCode(data.serviceEconomicCode)
            }

        } catch (error) {
            console.log('error', error)
        }
    }

    const getUserNidInfo = async () => {

        try {
            const { data } = await RestApi.get(`api/v1/admin/user-management/user/get-nid-info`)
            // setNid(data.nidNumber);
            // setMobile(data.mobile);
            // setDob(helpers.dDate(data.dob, 'yyyy-MM-DD'));
            setMobile(data.mobile);
            setAnonymousClientIdentity(data.nidNumber);
            setAnonymousClientName(data.nameEn);
            setAnonymousClientAddress(data.presentAddress);
        } catch (error) {
            console.log('error', error)
        }
    }

    const getUserTinInfoById = async () => {

        try {
            const response = await RestApi.get('api/v1/admin/user-management/user/get-tin-info', { timeout: 60000 })

            setTin(response.data.tinNumber);
            setMobile(response.data.mobile);
            setAnonymousClientIdentity(response.data.mobile);
            setAnonymousClientName(response.data.assessName);
            setAnonymousClientAddress(response.data.zoneName);

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
                "serviceType": 'dl',
                "serviceCode": serviceCode,
                "serviceRequestNo": serviceRequestNo,
                "paymentid": helpers.generateUniqueId(),
                "paidamount": paidAmount,
                "id_type": "8",
                // "tin": tin,
                "anonymous_client_identity": anonymousClientIdentity,
                "anonymous_client_name": anonymousClientName,
                "anonymous_client_address": anonymousClientAddress,
                // "nid": nid,
                // "dob": dob,
                "paymenttype": serviceEconomicCode && serviceEconomicCode.economicCode ? serviceEconomicCode.economicCode : '',
                "organizationcode": serviceEconomicCode && serviceEconomicCode.orgCode ? serviceEconomicCode.orgCode : '',
                "mobile": mobile,
                "AddlEconomic": AddlEconomic
            }

            dispatch(setLoading(true));

            let result = await RestApi.post('api/bsp/acs/v1/payment/initiate/online', requestBody, { timeout: 30000 });
            // console.log("result.data.url:" + result.data.url);
            // console.log("result:" + result);
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

    const goBack = () => {
        navigate(-1); // This will navigate to the previous route
    };

    return (
        <div>
            <div>
                <CardHeader>
                    <CardTitle className='mb-2'>{title}</CardTitle>
                </CardHeader>
                <div>

                    <Loading loading={loading} loadingText={t('loading')} />

                    <Card className='mb-3'>
                        <CardBody>
                            <div>
                                <div className="p-0 overflow-auto min-h-[250px]">
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
                                                    <td>{currentLanguage === 'en' ? item.serviceNameEn : item.serviceNameBn} ({item.serviceEconomicCode?.economicCode})</td>
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

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <div className="row mt-[24px] mb-6">
                        <div className="col-md-12 text-right">
                            {backUrl && (
                                <Link to={backUrl} className='btn btn-secondary btn-rounded btn-xs mr-1'>{t('previous')}</Link>
                            )}
                            {!backUrl && (
                                <button onClick={goBack} className='btn btn-secondary btn-rounded btn-xs mr-1'>{t('previous')}</button>
                            )}
                            {/* <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/application-list`)}>{t('previous')}</button> */}
                            <button onClick={() => payNowServiceFee()} disabled={isSubmitting} className='btn btn-danger btn-rounded btn-xs ml-2'>Pay Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default (AcsDrivingLicensePayment)
