import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import helper, { toaster } from '@/utils/helpers.js';
import { setLoading, setListData, setCurrentPage, setPaginationData, setResetPagination, toggleShowFilter } from '@/store/commonSlice';
import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import Loading from '@/components/common/Loading';

const PaymentSuccessPage = ({ t }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { activeStatusList, loading, listData, windowSize, pagination, showFilter, dropdowns, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [searchParams] = useSearchParams();

    // Combine all parameters into a single object
    const paymentDetails = {
        transactionId: searchParams.get('transaction_id'),
        challanNo: searchParams.get('challan_no'),
        clientName: searchParams.get('clientname'),
        paidAmount: searchParams.get('paidamount'),
        paymentId: searchParams.get('paymentid'),
    }

    const paymentParams = {
        transaction_id: searchParams.get('transaction_id'),
        challan_no: searchParams.get('challan_no'),
        clientname: searchParams.get('clientname'),
        paidamount: searchParams.get('paidamount'),
        paymentid: searchParams.get('paymentid'),
    }

    useEffect(() => {
        getPaymentInfo();
        console.log('Payment')
    }, [paymentParams.paymentid])

    const [paymentInfo, setPaymentInfo] = useState()

    const getPaymentInfo = async () => {

        try {

            dispatch(setLoading(true));
            const params = Object.assign({}, paymentParams)

            let { data } = await RestApi.get('api/bsp/acs/v1/payment/info', { params });
            console.log("data", data);
            setPaymentInfo(data);

        } catch (error) {
            console.log('error', error)
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className='card p-[60px]'>
            <div className="row my-3">
                <div className="col-sm-12 text-center">
                    <p className='text-success text-[40px]'>Payment has been completed successfully<i className='fa fa-check ml-5'></i></p>

                    <Loading loading={loading} />
                    <div className="p-0 overflow-auto mt-[20px] mb-[40px]">
                        <table className="table-auto min-w-full text-left border border-gray-200">
                            <tbody>
                                <tr className="text-slate-500 text-sm">
                                    <th>Transaction Id</th>
                                    <td>{paymentDetails.transactionId}</td>
                                </tr>
                                <tr className="text-slate-500 text-sm">
                                    <th>Challan No</th>
                                    <td>{paymentDetails.challanNo}</td>
                                </tr>
                                <tr className="text-slate-500 text-sm">
                                    <th>Client Name</th>
                                    <td>{paymentDetails.clientName}</td>
                                </tr>
                                <tr className="text-slate-500 text-sm">
                                    <th>Paid Amount</th>
                                    <td>{paymentDetails.paidAmount}</td>
                                </tr>
                                <tr className="text-slate-500 text-sm">
                                    <th>Payment Id</th>
                                    <td>{paymentDetails.paymentId}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {paymentInfo && (paymentInfo.serviceCode === "before_driving_skills_test_fees" || paymentInfo.serviceCode === "after_driving_skills_test_fees") && (
                        <button className='btn btn-primary btn-lg' onClick={() => navigate('/applicant-panel/driving-license/new-driving-license/application-for-driving-license')}>Back to Application List</button>
                    )}
                    {/* {paymentInfo && paymentInfo.serviceCode === "after_driving_skills_test_fees" && (
                        <button className='btn btn-primary btn-lg' onClick={() => navigate('/applicant-panel/vehicle-registration/application-for-vehicle-registration/application-list')}>Back to List</button>
                    )} */}
                </div>
            </div>
        </div>
    )
}

export default withNamespaces()(PaymentSuccessPage)
