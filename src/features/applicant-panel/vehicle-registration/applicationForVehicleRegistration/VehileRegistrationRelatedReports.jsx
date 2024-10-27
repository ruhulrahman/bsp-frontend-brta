import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React from 'react';
import { withNamespaces } from 'react-i18next';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TaxTokenPage from './TaxTokenPage.jsx';
import FitenessCertificate from './FitenessCertificate.jsx';
import DigitalRegistrationCertificate from './DigitalRegistrationCertificate.jsx';


const VehileRegistrationRelatedReports = ({ t }) => {

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
                                <TaxTokenPage />
                            </Tab>
                            <Tab eventKey="fitenessCertificate" title="Fitness Certificate">
                                <FitenessCertificate />
                            </Tab>
                            <Tab eventKey="digitalRegistrationCertificate" title="Digital Registration Certificate">
                                <DigitalRegistrationCertificate/>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withNamespaces()(VehileRegistrationRelatedReports)
