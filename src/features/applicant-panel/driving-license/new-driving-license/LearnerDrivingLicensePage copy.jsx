import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React from 'react';
import { withNamespaces } from 'react-i18next';
import govLogo from '@/assets/images/gov-logo.png';
import brtaLogo from '@/assets/images/logo.png';
import manPhoto from '@/assets/images/man.png';
import { Container, Row, Col, Table } from 'react-bootstrap';

const LearnerPrintSectionWithoutImage = ({ t }) => {
    return (
        // <div className="mx-auto my-4 p-4 border bg-white" style={{ width: '210mm', height: '297mm' }}>
        <div style={{ width: '210mm', height: '297mm' }} className="my-4 p-4 border-2 border-gray-400 bg-white rounded-lg shadow-md english-font bangla-font">
            {/* Header Section */}
            {/* <div className="row border-b-2 pb-4 mb-2">
                <div className="col-md-4 text-right">
                    <img src={govLogo} alt="GOV Logo" className="h-12 border-gray-400 border-1 rounded-full ml-auto" />
                </div>
                <div className="col-md-4 text-center">
                    <p className="text-sm font-semibold  bangla-font">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
                    <p className="text-sm font-semibold  bangla-font">বাংলাদেশ রোড ট্রান্সপোর্ট অথরিটি</p>
                    <h2 className="text-base font-bold bangla-font">ট্যাক্স টোকেন</h2>
                    <p className="text-base">Circle : DHAKA METRO-1</p>
                    <h5 className="text-base font-bold">LEARNER DRIVING LICENSE</h5>
                </div>
                <div className="col-md-4">
                    <img src={brtaLogo} alt="BRTA Logo" className="h-12" />
                </div>
            </div> */}

            <div className="text-center mb-4">
                <div className="d-flex justify-content-between align-items-center">

                    <div className="flex-1">
                        <img src={govLogo} alt="GOV Logo" className="h-12 border-gray-400 border-1 rounded-full ml-auto mr-4" />
                    </div>
                    {/* <img src={govLogo} alt="GOV Logo" className="h-12 border-gray-400 border-1 rounded-full ml-auto" /> */}
                    <div className=''>
                        <p className="text-sm font-semibold bangla-font">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
                        <p className="text-sm font-semibold bangla-font">বাংলাদেশ রোড ট্রান্সপোর্ট অথরিটি</p>
                        <h2 className="text-base font-bold bangla-font">ট্যাক্স টোকেন</h2>
                        <p className="text-base">Circle : DHAKA METRO-1</p>
                        <h5 className="text-base font-bold">LEARNER DRIVING LICENSE</h5>
                    </div>
                    {/* <img src="brta_logo_right.png" alt="Government Logo" className="w-16 h-16" /> */}
                    <div className="flex-1">
                        <img src={brtaLogo} alt="BRTA Logo" className="h-12 ml-4" />
                    </div>
                </div>
            </div>
            {/* Header Section */}

            {/* License Details and Photo */}
            <p className='text-sm font-bold'>The following Learner Driving License has been issued under the Road transport rules, 2022 rule 6</p>
            <div className="flex justify-between mt-4">
                <div className="text-sm space-y-1 flex-1">
                    <p><strong>Roll No. :</strong> 114</p>
                    <p><strong>Issue Date :</strong> 23/04/2024</p>
                    <p><strong>Expiry Date :</strong> 23/10/2024</p>
                    <p><strong>License Type :</strong> NON-PROFESSIONAL</p>
                    <p><strong>Application Type :</strong> LEARNER WITH SMART DRIVING LICENCE</p>
                    <p><strong>Vehicle Description :</strong> LIGHT and MOTORCYCLE</p>
                </div>
                <div className="text-center flex-none">
                    <img src={manPhoto} alt="Applicant" className="w-24 h-24 border mx-auto" />
                    {/* <p className="text-xs">Photo</p> */}
                </div>
            </div>

            {/* {t('personalInformation')} */}
            <div className="mt-4 text-sm space-y-1 border-b border-black pb-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p><strong>Learner No. :</strong> 2-1686969</p>
                        <p><strong>Applicant Id :</strong> 2-014103011</p>
                        <p><strong>Applicant Name :</strong> MD. ZOBAYER AHAMED</p>
                        <p><strong>Father's Name :</strong> ABDUS SOBUR</p>
                        <p><strong>Mother's Name :</strong> HIRON AKTER</p>
                        <p><strong>Phone No. :</strong> 01711268050</p>
                        <p><strong>NID No. :</strong> 01711268050</p>
                    </div>
                    <div>
                        <p><strong>{t('presentAddress')} :</strong> 275, ELIPHENT ROAD, NEW MARKET, DHAKA-1205</p>
                        <p><strong>{t('permanentAddress')} :</strong> FARAZI BARI, KOLAKOPA, DOUALTKHAN, BHOLA-8301</p>
                        <p><strong>Date of Birth :</strong> 26/10/1993</p>
                        <p><strong>Blood Group :</strong> AB+VE</p>
                    </div>
                </div>
                <p className='text-sm font-bold mt-4'>This document is automatically generated from system, No signature required</p>
            </div>

            {/* Test Schedule Table */}
            <div className="mt-4">
                <h6 className="font-bold text-center underline">Test Schedule</h6>
                <p className='text-sm font-bold text-red-500 mt-2'>* Signature of AD/MVI is required regarding test result</p>
                <table className="w-full text-sm text-center border border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-2 py-1">Test Name</th>
                            <th className="border px-2 py-1">Test Date</th>
                            <th className="border px-2 py-1">Test Time</th>
                            <th className="border px-2 py-1">Test Venue</th>
                            <th className="border px-2 py-1">Pass</th>
                            <th className="border px-2 py-1">Fail</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-2 py-1">BIOMETRIC</td>
                            <td className="border px-2 py-1">26/06/2024</td>
                            <td className="border px-2 py-1">08:30 AM</td>
                            <td className="border px-2 py-1">JOARSHAHARA</td>
                            <td className="border px-2 py-1"></td>
                            <td className="border px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border px-2 py-1">WRITTEN</td>
                            <td className="border px-2 py-1">26/06/2024</td>
                            <td className="border px-2 py-1">09:00 AM</td>
                            <td className="border px-2 py-1">JOARSHAHARA</td>
                            <td className="border px-2 py-1"></td>
                            <td className="border px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border px-2 py-1">ORAL</td>
                            <td className="border px-2 py-1">26/06/2024</td>
                            <td className="border px-2 py-1">10:00 AM</td>
                            <td className="border px-2 py-1">JOARSHAHARA</td>
                            <td className="border px-2 py-1"></td>
                            <td className="border px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border px-2 py-1">PRACTICAL</td>
                            <td className="border px-2 py-1">26/06/2024</td>
                            <td className="border px-2 py-1">11:00 AM</td>
                            <td className="border px-2 py-1">JOARSHAHARA</td>
                            <td className="border px-2 py-1"></td>
                            <td className="border px-2 py-1"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Footer Note */}
            <div className="mt-4 text-center text-xs">
                <p>
                    <strong>For possible questions and answers regarding driving licenses please visit :</strong> www.brta.gov.bd
                </p>
            </div>
        </div>
    )
}


const styles = StyleSheet.create({
    page: { backgroundColor: '#ffffff' },
    section: { margin: 10, padding: 10 },
});

const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Here is the content of the tax token.</Text>
                <div className="max-w-[1123px] mx-auto p-6 border-2 border-gray-400 bg-white rounded-lg shadow-md">
                    {/* Header Section */}
                    <div className="row border-b-2 pb-4 mb-2">
                        <div className="col-md-12 text-center">
                            <p className="text-sm font-semibold">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
                            <p className="text-sm font-semibold">বাংলাদেশ রোড ট্রান্সপোর্ট অথরিটি</p>
                            <h2 className="text-base font-bold">Tax Token</h2>
                            <p className="text-xs text-red-500 font-bold">Always Keep This In Your Vehicle</p>
                        </div>
                    </div>
                </div>
            </View>
        </Page>
    </Document>
);

const LearnerDrivingLicensePage = ({ t }) => {
    const handlePrint = () => {
        printJS({
            printable: 'printable-learner-license',
            type: 'html',
            targetStyles: ['*'], // To print styles as well
            style: `
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap');
      .bangla-font { font-family: 'Noto Sans Bengali', sans-serif; }

      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
      .english-font { font-family: 'Roboto', sans-serif; }
    `,
        });
    };

    return (
        <div className='max-w-[1123px] m-auto'>
            <div className="row my-3">
                <div className="col-sm-12 text-right">
                    <button onClick={handlePrint} className='btn btn-sm btn-secondary mr-2'>Print</button>

                    {/* <PDFDownloadLink document={<MyDocument />} fileName="tax-token-document.pdf" className='btn btn-sm btn-warning'>
                        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                    </PDFDownloadLink> */}
                </div>
            </div>

            <div id="printable-learner-license">
                <LearnerPrintSectionWithoutImage t={t} />
            </div>
        </div>
    )
}

export default withNamespaces()(LearnerDrivingLicensePage)
