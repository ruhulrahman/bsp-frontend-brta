import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import { withTranslation, useTranslation } from 'react-i18next';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TaxTokenPage from './TaxTokenPage.jsx';
import FitnessCertificate from './FitnessCertificate.jsx';
import DigitalRegistrationCertificate from './DigitalRegistrationCertificate.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const VehileRegistrationRelatedReports = () => {
const { t } = useTranslation();

    let { serviceRequestId, isViewable } = useParams()
    // isViewable = isViewable === 'true'? true : false
    const navigate = useNavigate();
    
    

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 ">
                        <Tabs
                            defaultActiveKey="taxToken"
                            id="vehicle-registration-related-reports-tab"
                            className="mb-3 bg-slate-300"
                            fill
                        >
                            <Tab eventKey="taxToken" title="Tax Token">
                                <TaxTokenPage serviceRequestId={serviceRequestId} />
                            </Tab>
                            <Tab eventKey="fitnessCertificate" title="Fitness Certificate">
                                <FitnessCertificate serviceRequestId={serviceRequestId} />
                            </Tab>
                            <Tab eventKey="digitalRegistrationCertificate" title="Digital Registration Certificate">
                                <DigitalRegistrationCertificate serviceRequestId={serviceRequestId} />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    )
}

export default (VehileRegistrationRelatedReports)
