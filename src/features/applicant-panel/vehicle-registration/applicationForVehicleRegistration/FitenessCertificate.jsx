import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import govLogo from '@/assets/images/gov-logo.png';
import brtaLogo from '@/assets/images/logo.png';
import { Container, Row, Col, Table } from 'react-bootstrap';
import QRCode from "react-qr-code";

const MainContent = ({ t }) => {

    const [qrCodeValue, setQrCodeValue] = useState(`
        Registration Number: DHAKA METRO-THA-13-3000
        Fitness Period: 08-FEB-2017 :: 08-FEB-2018
        Owner Name: PALLI KARMA SHAHYAK FOUNDATION
    `)

    return (
        <Container className="max-w-[800px] mx-auto p-6 border-2 border-gray-400 bg-white rounded-lg shadow-md english-font bangla-font">

            {/* Header Section */}
            <div className="row border-b-2 pb-4 mb-2">
                <div className="col-md-4 text-right">
                    <img src={govLogo} alt="GOV Logo" className="h-12 border-gray-400 border-1 rounded-full  ml-auto" />
                </div>
                <div className="col-md-4 text-center">
                    <p className="text-sm font-semibold">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
                    <p className="text-sm font-semibold">বাংলাদেশ রোড ট্রান্সপোর্ট অথরিটি</p>
                    <h2 className="text-base font-bold">ফিটনেস সনদ</h2>
                    <p className="text-xs text-red-500 font-bold">Always Keep This In Your Vehicle</p>
                </div>
                <div className="col-md-4">
                    <img src={brtaLogo} alt="BRTA Logo" className="h-12" />
                </div>
            </div>
            {/* Header Section */}



            <div className="row border-b-2 pb-2 mb-2">
                <div className="col-md-12">
                    <p><span className="font-semibold">Fitness Period:</span> 08-FEB-2017 :: 08-FEB-2018</p>
                </div>
            </div>

            {/* Information Section */}
            <Table className="my-4 text-sm" striped bordered>
                <tbody className='[&>tr>td:nth-child(1)]:[font-weight:bold] [&>tr>td:nth-child(3)]:[font-weight:bold] [&>tr>td:nth-child(2)]:w-1/3'>
                    <tr>
                        <td>যানের পরিচিতি</td>
                        <td>2-0216210</td>
                        <td>গ্রাহক পরিচিতি</td>
                        <td>2-000173032</td>
                    </tr>
                    <tr>
                        <td>রেজিস্ট্রেশন নম্বর</td>
                        <td>Dhaka Metro-GHA-11-7939</td>
                        <td>প্রকল্প নাম্বার</td>
                        <td>2-8325485/23</td>
                    </tr>
                    <tr>
                        <td>যানের বর্ণনা</td>
                        <td>HARD JEEP HYUNDAI MOTORS 2005</td>
                    </tr>
                    <tr>
                        <td>ইঞ্জিন নম্বর</td>
                        <td>KMHN81CR5J-170580</td>
                        <td>চেসিস নম্বর</td>
                        <td>G6CU-4050234</td>
                    </tr>
                    <tr>
                        <td>সিসি/এমএইচডি</td>
                        <td>1860</td>
                        <td>কোরবের ওজন</td>
                        <td>3080</td>
                    </tr>
                    <tr>
                        <td>বৈধতার সময়</td>
                        <td>09/01/2023 - 18/01/2025</td>
                    </tr>
                    <tr>
                        <td>নাম</td>
                        <td>PALLI KARMA SHAHYAK FOUNDATION</td>
                    </tr>
                    <tr>
                        <td>ঠিকানা</td>
                        <td>PLOT#-4/B, ASARAGON ADMN AREA, SHER-E-BANGLA NAGAR, DHAKA-1207, BANGLADESH</td>
                    </tr>
                </tbody>
            </Table>

            <div className="row">
                <div className="col-md-6">

                    <div className="w-32 h-32 border d-flex align-items-center justify-content-center mx-auto">
                        <QRCode value={qrCodeValue} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="text-right mt-4">
                        <p>মোটরযান পরিদর্শক কর্তৃক স্বাক্ষরিত</p>
                        <p>ঢাকা মেট্রো-1</p>
                    </div>
                </div>
            </div>

        </Container>
    )
}


const styles = StyleSheet.create({
    page: { backgroundColor: '#ffffff' },
    section: { margin: 10, padding: 10 },
});



const FitenessCertificate = ({ t }) => {
    const handlePrint = () => {
        printJS({
            printable: 'printable-section-fitness-certificate',
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
        <div className='max-w-[800px] m-auto'>
            <div className="row my-3">
                <div className="col-sm-12 text-right">
                    <button onClick={handlePrint} className='btn btn-sm btn-secondary mr-2'>Print</button>
                </div>
            </div>

            <div id="printable-section-fitness-certificate">
                <MainContent t={t} />
            </div>
        </div>
    )
}

export default withNamespaces()(FitenessCertificate)
