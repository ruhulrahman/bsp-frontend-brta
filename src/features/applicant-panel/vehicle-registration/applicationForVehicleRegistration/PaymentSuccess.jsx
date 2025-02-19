import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


const PaymentSuccess = () => {
const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className='card p-[60px]'>
            <div className="row my-3">
                <div className="col-sm-12 text-center">
                    <p className='text-success text-[50px]'>Payment has been successfully completed <i className='fa fa-check'></i></p>
                    <button className='btn btn-primary btn-lg' onClick={() => navigate('/applicant-panel/vehicle-registration/application-for-vehicle-registration/application-list')}>Back to List</button>
                </div>
            </div>
        </div>
    )
}

export default (PaymentSuccess)
