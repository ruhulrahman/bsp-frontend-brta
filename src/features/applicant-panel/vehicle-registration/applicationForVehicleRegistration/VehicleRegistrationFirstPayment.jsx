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


const VehicleRegistrationFirstPayment = ({ t }) => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, windowSize, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;
    let { serviceRequestId, isViewable } = useParams();

    const [paymentData, setPaymentData] = useState([
        {
            sl: '1',
            feeName: 'Registration Fee',
            feeAmount: 300,
            vat: 45,
            totalAmount: 345,
        },
        {
            sl: '2',
            feeName: 'Inspection Fee',
            feeAmount: 800,
            vat: 120,
            totalAmount: 920,
        },
    ]);

    const [tin, setTin] = useState('');
    const [mobile, setMobile] = useState('');

    useEffect(() => {
        if (serviceRequestId) {
            // getPaymentDataByServiceRequestId(serviceRequestId);
            getUserTinInfoById();
        } else {
            setPaymentData([]);
        }
    }, [serviceRequestId]);

    function generateGUID() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };

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

    return (
        <div>
            <div>
                <CardHeader>
                    <CardTitle className='mb-2'>Vehicle Registration Related Primary Fees</CardTitle>
                </CardHeader>
                <div>
                    <Formik
                        initialValues={paymentData}
                        enableReinitialize={true}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            // console.log('Form Submitted', values);
                            // You can reset the form here as well after submission
                            // handleReset(resetForm);
                            onSubmit(values, setSubmitting, resetForm);
                        }}
                    >
                        {({ values, resetForm, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                            <FormikForm>
                                <Loading loading={loading} loadingText={t('loading')} />

                                <Card className='mb-3'>
                                    <CardBody>
                                        <div>
                                            <div className="p-0 overflow-scroll relative min-h-[300px]">
                                                <table className="mt-2 text-left table table-responsive min-w-max">
                                                    <thead>
                                                        <tr>
                                                            <th>Serial</th>
                                                            <th>Fees Name</th>
                                                            <th>Fees Amount</th>
                                                            <th>VAT</th>
                                                            <th>Total Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {paymentData && paymentData.map((item, index) => (
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
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="row mt-2 mb-6">
                                    <div className="col-md-12 text-right">
                                        {/* <Link to={`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page4/${initialValues.id}`} className='btn btn-secondary btn-rounded btn-xs'>{t('back')}</Link> */}
                                        <button className='btn btn-secondary btn-rounded btn-xs mr-1' onClick={() => navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page4/${initialValues.id}`)}>{t('previous')}</button>
                                        <button type='submit' disabled={isSubmitting} className='btn btn-success btn-rounded btn-xs ml-2'>Pay Now</button>
                                    </div>
                                </div>
                            </FormikForm>
                        )}
                    </Formik>
                </div>
            </div>
        </div >
    );
}

export default withNamespaces()(VehicleRegistrationFirstPayment)
