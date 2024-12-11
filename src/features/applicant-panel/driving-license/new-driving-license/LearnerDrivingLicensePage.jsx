import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React, { useContext, useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import govLogo from '@/assets/images/gov-logo.png';
import brtaLogo from '@/assets/images/logo.png';
import manPhoto from '@/assets/images/man.png';
import { Container, Row, Col, Table } from 'react-bootstrap';
import QRCode from "react-qr-code";
import helper, { toaster } from '@/utils/helpers.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@/i18n';
import { AuthContext } from '@/components/common/AuthContext';
import { toBengaliNumber, toBengaliWord } from 'bengali-number'

const LearnerPrintSectionWithoutImage = ({ t, learnerData }) => {
    const [qrCodeValue, setQrCodeValue] = useState(``)

    // const navigate = useNavigate()

    // const dispatch = useDispatch();
    const { activeStatusList, listData, windowSize, pagination, showFilter, dropdowns, permissionTypeList } = useSelector((state) => state.common)
    const currentLanguage = i18n.language;

    useEffect(() => {
        if (learnerData) {
            setQrCodeValue(`
                Learner No. : ${learnerData.learnerNumber}
                Applicant Name : ${learnerData?.userNidInfo?.nameEn}
                Father's Name : ${learnerData?.userNidInfo?.fatherOrHusbandNameEn}
                Mother's Name : ${learnerData?.userNidInfo?.motherNameEn}
                Phone No. : ${learnerData?.userNidInfo?.mobile}
                NID No. : ${learnerData?.userNidInfo?.nidNumber}
            `)
        }
        console.log('learnerData', learnerData)
    }, [learnerData])

    console.log('dropdowns.drivingTestNameList', dropdowns.drivingTestNameList)


    // const drivingTestList = dropdowns.drivingTestNameList.map((item, index) => {
    //     // Use a ternary operator to conditionally add 'time'
    //     const updatedItem = index === 0
    //         ? { ...item, time: '08:30 AM' }
    //         : index === 1
    //         ? { ...item, time: '09:00 AM' }
    //         : index === 2
    //         ? { ...item, time: '10:00 AM' }
    //         : index === 3
    //         ? { ...item, time: '11:00 AM' }
    //         : { ...item }; // Keep unchanged for other indices

    //     return updatedItem;
    // });

    const times = ['08:30 AM', '09:00 AM', '10:00 AM', '11:00 AM'];

    const drivingTestList = dropdowns.drivingTestNameList.map((item, index) => {
        return index < times.length
            ? { ...item, time: times[index] }
            : { ...item }; // No 'time' if index exceeds the times array
    });

    const vehicleCLasses = learnerData?.dlInformation?.dlVehicleClassIds?.map((item) => {
        const foundItem = dropdowns.drivingLicenseClassList.find((v) => v.id === item)
        console.log('foundItem', foundItem)
        return foundItem
    });

    if (vehicleCLasses && vehicleCLasses.length > 0) {
        vehicleCLasses.sort((a, b) => a.priority - b.priority);
    }

    const pageSize = (size = 'a4') => {
        if (size == 'a4') {
            return { width: '210mm', height: '297mm' }
        } else if (size == 'legal') {
            return { width: '216mm', height: '365mm' }
        }
    }

    const legalSize = pageSize('legal')

    // console.log('drivingTestList', drivingTestList)

    return (
        <div className="container mx-auto my-4 p-4 border bg-white" style={legalSize}>
            {/* Header */}
            <div className="text-center mb-2">
                <div className="d-flex justify-content-between align-items-center">

                    <div className="flex-1">
                        <img src={govLogo} alt="GOV Logo" className="w-16 h-16 ml-auto mr-4" />
                    </div>
                    <div className=''>
                        <p className="font-bold text-lg bangla-font">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
                        <p className="font-bold text-lg bangla-font">বাংলাদেশ রোড ট্রান্সপোর্ট অথরিটি</p>
                        <h2 className="font-bold text-lg bangla-font"><strong>Circle: </strong>{helper.cn(learnerData, 'issuedOffice.nameEn', 'Unknown')}</h2>
                        <h2 className="font-bold text-xl bangla-font my-2 underline">Learner Driving License</h2>
                    </div>
                    <div className="flex-1">
                        <img src={brtaLogo} alt="BRTA Logo" className="w-16 h-16 ml-4" />
                    </div>
                </div>
            </div>

            {/* Header Section */}

            {/* Photo and QR Code */}
            <div className="d-flex justify-content-between align-items-center">
                {/* <span>QR Code</span> */}
                <QRCode value={qrCodeValue} className="w-20 h-20 border mx-auto" />
            </div>
            {/* License Details and Photo */}
            <p className='text-sm font-bold mt-2'>The following Learner Driving License has been issued under the Road transport rules, 2022 rule 6</p>
            

            <div className="flex justify-between mt-2">
                <div className="text-sm space-y-1 flex-1">
                    <p><strong>Roll No. :</strong> {currentLanguage === 'en' ? learnerData?.rollNo : toBengaliNumber(learnerData?.rollNo)}</p>
                    <p><strong>Issue Date :</strong> {currentLanguage === 'en' ? helper.dDate(learnerData?.issueDate) : toBengaliNumber(helper.dDate(learnerData?.issueDate))}</p>
                    <p><strong>Expiry Date :</strong> {currentLanguage === 'en' ? helper.dDate(learnerData?.expireDate) : toBengaliNumber(helper.dDate(learnerData?.expireDate))}</p>
                    {/* <p><strong>License Type :</strong> NON-PROFESSIONAL</p> */}
                    <p><strong>License Type :</strong> {currentLanguage === 'en' ? helper.cn(learnerData, 'licenseType.nameEn', 'Unknown') : helper.cn(learnerData, 'licenseType.nameBn', 'Unknown')}</p>
                    <p><strong>Application Type :</strong> {currentLanguage === 'en' ? helper.cn(learnerData, 'applicationType.nameEn', 'Unknown') : helper.cn(learnerData, 'applicationType.nameBn', 'Unknown')}</p>
                    {/* <p><strong>Vehicle Description :</strong> LIGHT and MOTORCYCLE</p> */}
                    {/* <p><strong>Vehicle Description :</strong> {vehicleCLasses && vehicleCLasses.length > 0 && vehicleCLasses.map((item) => item.nameBn).join(', ')}</p> */}

                    <p>
                        <strong>Vehicle Description :</strong>{" "}
                        {vehicleCLasses && vehicleCLasses.length > 0 &&
                            vehicleCLasses.map((item, index) => {
                                // Determine the current name based on the language
                                const name = currentLanguage === 'en' ? item.nameEn : item.nameBn
                                const and = currentLanguage === 'en' ? ` and ${name}` : ` এবং ${name}`

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
                </div>
                <div className="text-center flex-none">
                    {/* <img src={manPhoto} alt="Applicant" className="w-24 h-24 border mx-auto" /> */}
                    <img src={learnerData?.userNidInfo?.photo} alt="Applicant" className="w-24 h-24 border rounded-full mx-auto" />
                    {/* <p className="text-xs">Photo</p> */}
                </div>
            </div>

            {/* {t('personalInformation')} */}
            <div className="mt-4 text-sm space-y-1 border-b border-black pb-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p><strong>Learner No. :</strong> {currentLanguage === 'en' ? learnerData?.learnerNumber : toBengaliNumber(learnerData?.learnerNumber)}</p>
                        {/* <p><strong>Applicant Id :</strong> 2-014103011</p> */}
                        <p><strong>Applicant Name :</strong> {currentLanguage === 'en' ? learnerData?.userNidInfo?.nameEn : learnerData?.userNidInfo?.nameBn}</p>
                        <p><strong>Father's Name :</strong> {currentLanguage === 'en' ? learnerData?.userNidInfo?.fatherOrHusbandNameEn : learnerData?.userNidInfo?.fatherOrHusbandNameBn}</p>
                        <p><strong>Mother's Name :</strong> {currentLanguage === 'en' ? learnerData?.userNidInfo?.motherNameEn : learnerData?.userNidInfo?.motherNameBn}</p>
                        <p><strong>Phone No. :</strong> {currentLanguage === 'en' ? learnerData?.userNidInfo?.mobile : toBengaliNumber(learnerData?.userNidInfo?.mobile)}</p>
                        <p><strong>NID No. :</strong> {currentLanguage === 'en' ? learnerData?.userNidInfo?.nidNumber : toBengaliNumber(learnerData?.userNidInfo?.nidNumber)}</p>
                    </div>
                    <div>
                        {/* <p><strong>{t('presentAddress')} :</strong> 275, ELIPHENT ROAD, NEW MARKET, DHAKA-1205</p> */}
                        <p><strong>{t('presentAddress')} :</strong> {currentLanguage === 'en' ? learnerData?.dlInformation?.presentAddress?.fullAddressEn : learnerData?.dlInformation?.presentAddress?.fullAddressBn}</p>
                        {/* <p><strong>{t('permanentAddress')} :</strong> FARAZI BARI, KOLAKOPA, DOUALTKHAN, BHOLA-8301</p> */}
                        <p><strong>{t('permanentAddress')} :</strong> {currentLanguage === 'en' ? learnerData?.dlInformation?.permanentAddress?.fullAddressEn : learnerData?.dlInformation?.permanentAddress?.fullAddressBn}</p>
                        <p><strong>Date of Birth :</strong> {currentLanguage === 'en' ? helper.dDate(learnerData?.userNidInfo?.dob) : toBengaliNumber(helper.dDate(learnerData?.userNidInfo?.dob))}</p>
                        <p><strong>Blood Group :</strong> {currentLanguage === 'en' ? helper.cn(learnerData, 'bloodGroup.nameEn', 'Unknown') : helper.cn(learnerData, 'bloodGroup.nameBn', 'Unknown')}</p>
                    </div>
                </div>
                <p className='text-sm font-bold mt-4'>This document is automatically generated from system, No signature required</p>
            </div>

            {/* Test Schedule Table */}
            <div className="mt-2">
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
                        {drivingTestList && drivingTestList.length > 0 && drivingTestList.map((item, index) => (
                            <tr>
                                <td className="border px-2 py-1">{currentLanguage === 'en' ? item.nameEn : item.nameBn}</td>
                                <td className="border px-2 py-1">{currentLanguage === 'en' ? helper.dDate(learnerData?.examDate) : toBengaliNumber(helper.dDate(learnerData?.examDate))}</td>
                                <td className="border px-2 py-1">{currentLanguage === 'en' ? item.time : item.time}</td>
                                <td className="border px-2 py-1 text-uppercase">{currentLanguage === 'en' ? learnerData?.examVenueNameEn : learnerData?.examVenueNameBn}</td>
                                <td className="border px-2 py-1"></td>
                                <td className="border px-2 py-1"></td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            <div className="row">
                <p className='bangla-font'>পরীক্ষার উপরিউক্ত ফলাফল সম্পর্কে কোন অভিযোগ থাকলে কার্যালয়ে নির্দিষ্ট কার্যদিবসে লিখিতভাবে অভিযোগ করতে পারবেন।</p>
        
                <table>
                    <tr className='hover:bg-white'>
                        <td className='border-1 border-dark text-dark'>
                            <ul className='list-none space-y-2'>
                                <li>
                                    <i className="fa-regular fa-square mr-[10px]"></i> a) Learner Driving License
                                </li>
                                <li>
                                    <i className="fa-regular fa-square mr-[10px]"></i> b) National ID Card (Original Copy)
                                </li>
                                <li>
                                    <i className="fa-regular fa-square mr-[10px]"></i> c) Medical Certificate (Original Copy)
                                </li>
                                <li>
                                    <i className="fa-regular fa-square mr-[10px]"></i> d) Educational Qualification Certificate (Original Copy)
                                </li>
                                <li>
                                    <i className="fa-regular fa-square mr-[10px]"></i> e) Utility Bill [(Electricity/Gas/Telephone) (Attested/Original Copy)]
                                </li>
                                <li>
                                    <p><i className="fa-regular fa-square mr-[10px]"></i> f) Current Driving License (Original Copy)</p>
                                    <p className='pl-[25px] mt-2'>[Applicable for Driving License Renew/Class Change/Class Addition/License Type Change]</p>
                                </li>
                            </ul>
                        </td>

                        <td className='border-1 border-dark text-dark text-center'>
                            <p>পরীক্ষার পূর্বে বামে বর্ণিত প্রযোজ্য ডকুমেন্ট দেখিলাম</p>
                            <p className='mt-[90px]'>স্বাক্ষর</p>
                            <p>সহকারি পরিচালক(ইঞ্জঃ)<br/>মোটরযান পরিদর্শক</p>
                        </td>
                    </tr>
                </table>
            </div>

            
            {/* Footer Note */}
            <div className="mt-4 text-center text-xs">
                <p>
                    <strong>For possible questions and answers regarding driving licenses please visit :</strong> www.brta.gov.bd
                    <p>Print Date: {helper.dDate(new Date(), 'MMM DD, yyyy hh:mm:ss A')}</p>
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

const LearnerDrivingLicensePage = ({ t, learnerData }) => {
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
        <div className='max-w-[800px] m-auto'>
            <div className="row my-3">
                <div className="col-sm-12 text-right">
                    <button onClick={handlePrint} className='btn btn-sm btn-secondary mr-2'>Print</button>

                    {/* <PDFDownloadLink document={<MyDocument />} fileName="tax-token-document.pdf" className='btn btn-sm btn-warning'>
                        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                    </PDFDownloadLink> */}
                </div>
            </div>

            <div id="printable-learner-license">
                <LearnerPrintSectionWithoutImage t={t} learnerData={learnerData} />
            </div>
        </div>
    )
}

export default withNamespaces()(LearnerDrivingLicensePage)
