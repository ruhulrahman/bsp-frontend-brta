import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React, { useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import govLogo from '@/assets/images/gov-logo.png';
import brtaLogo from '@/assets/images/logo.png';
import manPhoto from '@/assets/images/man.png';
import QRCode from "react-qr-code";
import helpers, { toaster } from '@/utils/helpers.js';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import { AuthContext } from '@/components/common/AuthContext';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'

const PrintSectionWithoutImage = ({ learnerData }) => {
const { t } = useTranslation();

    const { activeStatusList, listData, windowSize, pagination, showFilter, dropdowns, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    const [qrCodeValue, setQrCodeValue] = useState(`
        Name: ${learnerData?.userNidInfo?.nameEn}
        Father's Name: ABDUS SOBUR
        Date of Birth: 26-OCT-1993
        Reference No: DM124214NP040
        Licensing Authority: DHAKA METRO-1, BRTA
        License Type: NON-PROFESSIONA
        icense Class: LIGHT, MOTORCYCLE
        Issue Date: 17-OCT-2024
        Expiry Date: 16-OCT-2034
    `)

    const vehicleCLasses = learnerData?.dlInformation?.dlVehicleClassIds?.map((item) => {
        const foundItem = dropdowns.drivingLicenseClassList.find((v) => v.id === item)
        console.log('foundItem', foundItem)
        return foundItem
    });

    if (vehicleCLasses && vehicleCLasses.length > 0) {
        vehicleCLasses.sort((a, b) => a.priority - b.priority);
    }


    return (
        <div className="container mx-auto my-4 p-4 border bg-white" style={{ width: '210mm', height: '297mm' }}>
            {/* Header */}
            <div className="text-center mb-4">
                <div className="d-flex justify-content-between align-items-center">

                    <div className="flex-1">
                        <img src={govLogo} alt="GOV Logo" className="w-16 h-16 ml-auto mr-4" />
                    </div>
                    {/* <img src={govLogo} alt="GOV Logo" className="h-12 border-gray-400 border-1 rounded-full ml-auto" /> */}
                    <div className=''>
                        <h6 className="font-bold text-lg">Government of the People's Republic of Bangladesh</h6>
                        <h6 className="font-bold text-lg">BANGLADESH ROAD TRANSPORT AUTHORITY (BRTA)</h6>
                        <h5 className="font-bold text-lg my-2 underline">E-Driving License</h5>
                    </div>
                    {/* <img src="brta_logo_right.png" alt="Government Logo" className="w-16 h-16" /> */}
                    <div className="flex-1">
                        <img src={brtaLogo} alt="BRTA Logo" className="w-16 h-16 ml-4" />
                    </div>
                </div>
            </div>

            {/* Photo and QR Code */}
            <div className="d-flex justify-content-between mb-4">
                {/* <img src="applicant_photo.jpg" alt="Applicant" className="border w-32 h-32" /> */}
                <img src={manPhoto} alt="Applicant" className="border w-32 h-32" />
                <div className="w-32 h-32 border d-flex align-items-center justify-content-center">
                    {/* <span>QR Code</span> */}
                    <QRCode value={qrCodeValue} />
                </div>
                {/* <img src="qr_code.png" alt="QR Code" className="w-32 h-32 border" /> */}
            </div>

            {/* License Holder's Information */}
            <div className="mb-4">
                <h6 className="font-bold border-bottom border-black pb-1">Driving License Holder's Information</h6>
                <div className="row text-sm">
                    <div className="col-6">
                        <p><strong>Name:</strong> {learnerData?.userNidInfo?.nameEn}</p>
                        <p><strong>Father's Name:</strong> {learnerData?.userNidInfo?.fatherOrHusbandNameEn}</p>
                        <p><strong>Mother's Name:</strong> {learnerData?.userNidInfo?.motherNameEn}</p>
                        <p><strong>Date of Birth:</strong> {helpers.dDate(learnerData?.userNidInfo?.dob)}</p>
                        <p><strong>{t('permanentAddress')}:</strong> {learnerData?.dlInformation?.permanentAddress?.fullAddressEn}</p>
                    </div>
                    <div className="col-6">
                        <p><strong>নাম:</strong> {learnerData?.userNidInfo?.nameBn}</p>
                        <p><strong>পিতার নাম:</strong> {learnerData?.userNidInfo?.fatherOrHusbandNameBn}</p>
                        <p><strong>মাতার নাম:</strong> {learnerData?.userNidInfo?.motherNameBn}</p>
                        <p><strong>Blood Group:</strong> {helpers.cn(learnerData, 'bloodGroup.nameEn', 'Unknown')}</p>
                        <p><strong>NID Number:</strong> {helpers.masked(helpers.cn(learnerData, 'userNidInfo.nidNumber'))}</p>

                    </div>
                </div>
            </div>

            {/* License Details Information */}
            <div className="mb-4">
                <h6 className="font-bold border-bottom border-black pb-1">License Details Information</h6>
                <div className="row text-sm">
                    <div className="col-6">
                        <p><strong>Reference No.:</strong> {helpers.cn(learnerData, 'dlInformation.dlReferenceNumber', 'Unknown')}</p>
                        <p><strong>License Type:</strong> {helpers.cn(learnerData, 'licenseType.nameEn', 'Unknown')}</p>
                        <p><strong>Issue Date:</strong> {helpers.dDate(learnerData?.dlInformation?.issueDate)}</p>
                    </div>
                    <div className="col-6">
                        <p><strong>Licensing Authority:</strong> {helpers.cn(learnerData, 'dlInformation.issuedOffice.nameEn', 'Unknown')}, BRTA</p>
                        <p>
                            <strong>License Class:</strong>{" "}
                            {vehicleCLasses && vehicleCLasses.length > 0 &&
                                vehicleCLasses.map((item, index) => {
                                    // Determine the current name based on the language
                                    // const name = currentLanguage === 'en' ? item.nameEn : item.nameBn
                                    // const and = currentLanguage === 'en' ? ` and ${name}` : ` এবং ${name}`

                                    const name = item.nameEn
                                    const and = ` and ${name}`

                                    // Handle different cases based on the index and length
                                    if (index === vehicleCLasses.length - 1 && index > 0) {
                                        // Add "and" before the last item if more than one
                                        return and
                                    } else if (index === vehicleCLasses.length - 2) {
                                        // Add a comma for all items except the second last
                                        return `${name}`
                                    } else if (index < vehicleCLasses.length - 2) {
                                        // Add commas for items before the second last
                                        return `${name}, `
                                    } else {
                                        // For single items, return without any separators
                                        return name
                                    }
                                })}
                        </p>
                        <p><strong>Expiry Date:</strong> {helpers.dDate(learnerData?.dlInformation?.expireDate)}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs mt-4">
                <p>For any further assistance, Please visit <a href="https://brta.gov.bd" className="text-blue-500">brta.gov.bd</a> Or <a href="https://bsp.brta.gov.bd" className="text-blue-500">bsp.brta.gov.bd</a> or Email: info@brta.gov.bd</p>
                <p>Print Date: {helpers.dDate(new Date(), 'MMM DD, yyyy hh:mm:ss A')}</p>
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
                <div className="max-w-[800px] mx-auto p-6 border-2 border-gray-400 bg-white rounded-lg shadow-md">
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

const EDrivingLicensePage = ({ learnerData }) => {
const { t } = useTranslation();
    const handlePrint = () => {
        printJS({
            printable: 'printable-edriving-license',
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

                    {/* <PDFDownloadLink document={<MyDocument />} fileName="tax-token-document.pdf" className='btn btn-sm btn-warning'>
                        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                    </PDFDownloadLink> */}
                </div>
            </div>

            <div id="printable-edriving-license">
                <PrintSectionWithoutImage t={t} learnerData={learnerData} />
            </div>
        </div>
    )
}

export default (EDrivingLicensePage)
