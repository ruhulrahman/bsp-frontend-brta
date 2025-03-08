import React, { useEffect, useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toBengaliNumber } from 'bengali-number';
import helpers from '@/utils/helpers';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import PaymentReportPdf from './PaymentReportPdf';

const ViewDetails = ({ show, onHide, onSave, viewData }) => {
    const { t } = useTranslation();

    const { activeStatusList, loading, listData, dropdowns } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;
    console.log('viewData', viewData)

    return (
        <>
            {viewData &&
                <Modal show={show} onHide={onHide} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('details')}</Modal.Title>
                        {/* <Modal.Title>{t('name')}: {currentLanguage === 'en' ? viewData.nameEn : viewData.nameBn}</Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mt-3'>
                            <div className='card-body'>
                                <div className="row">
                                    <div className="col-md-12 text-right">
                                        <PDFDownloadLink
                                            className="btn btn-warning"
                                            document={<PaymentReportPdf viewData={viewData} />}
                                            fileName="payemnt-report.pdf"
                                        >
                                            {({ blob, url, loading, error }) =>
                                                <>
                                                    <i className="bi bi-download mr-[10px]"></i>
                                                    {loading ? 'Generating PDF...' : 'Download Report'}
                                                </>
                                            }
                                        </PDFDownloadLink>
                                    </div>
                                </div>

                                <h1 className='font-semibold mb-3 text-center mt-[24px]'>{t('paymentDetails')}:</h1>

                                <table className="mt-2 text-left table table-normal w-auto min-w-[300px] max-w-[600px] mx-auto">
                                    <tbody>
                                        <tr>
                                            <th className='text-right'>{t('bank_name')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.bank_name}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('routing_no')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.routing_no}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('challan_no')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.challan_no}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('serviceFeesName')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.serviceNameEn}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('paidamount')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.paidamount}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('entry_date')}</th>
                                            <td className='min-w-[100px] w-auto'>{helpers.dDate(viewData.entry_date)}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('payment_date')}</th>
                                            <td className='min-w-[100px] w-auto'>{helpers.dDate(viewData.payment_date)}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('payment_id')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.payment_id}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('client_name')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.client_name}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('mobile_no')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.mobile_no}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('address')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.address}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('email')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.email}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('tin')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.tin}</td>
                                        </tr>
                                        <tr>
                                            <th className='text-right'>{t('bin')}</th>
                                            <td className='min-w-[100px] w-auto'>{viewData.bin}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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

export default (ViewDetails);