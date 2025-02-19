import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React, { useState, useEffect } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import govLogo from '@/assets/images/gov-logo.png';
import brtaLogo from '@/assets/images/logo.png';
import { Container, Row, Col, Table } from 'react-bootstrap';
import QRCode from "react-qr-code";
import Loading from '@/components/common/Loading';
import helpers from '@/utils/helpers.js';
import { useNavigate } from 'react-router-dom';
import i18n from '@/i18n';
import RestApi from '@/utils/RestApi';
import { useDispatch, useSelector } from 'react-redux';

const MainContent = ({ serviceRequestId }) => {
    const { t } = useTranslation();

    // const [qrCodeValue, setQrCodeValue] = useState(`
    //     Registration Number: DHAKA METRO-THA-13-3000
    //     Fitness Period: 08-FEB-2017 :: 08-FEB-2018
    //     Owner Name: PALLI KARMA SHAHYAK FOUNDATION
    // `)

    const navigate = useNavigate();
    const currentLanguage = i18n.language;
    const [vehicleDetail, setVehicleDetail] = useState({});
    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)

    useEffect(() => {
        if (serviceRequestId) {
            getVehicleInfoById(serviceRequestId);
        } else {
            navigate(`/applicant-panel/vehicle-registration/application-for-vehicle-registration/vehicle-registration-page1`)
        }
    }, [serviceRequestId]);

    const [barCodeValue, setBarCodeValue] = useState('')
    const [qrCodeValue, setQrCodeValue] = useState('')

    const getVehicleInfoById = async (serviceRequestId) => {

        try {
            const { data } = await RestApi.get(`api/v1/applicant/vehicle/get-fitness-certificate-details/${serviceRequestId}`)
            console.log('data', data)
            setVehicleDetail(data);

            setQrCodeValue(`
                Registration Number: ${data?.vehicleRegistration?.fullRegNumber}
                Fitness Period: ${helpers.dDate(data?.fitnessValidStartDate)} :: ${helpers.dDate(data?.fitnessValidEndDate)}
                Owner Name: ${data?.vehicleOwner?.name}
            `)

        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <>
            {/* <div class="max-w-[800px] mx-auto bg-white p-6 shadow-lg rounded-md border border-gray-300">
                <div class="text-center border-b border-gray-400 pb-2 mb-4">
                    <h2 class="text-xl font-bold text-red-600">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h2>
                    <h3 class="text-lg font-semibold text-green-600">বাংলাদেশ রোড ট্রান্সপোর্ট অথরিটি</h3>
                    <h4 class="text-md font-medium">ফিটনেস সনদ</h4>
                </div>
                <div class="mb-4">
                    <p class="font-semibold">FC: <span class="text-red-600 font-bold">8738673</span></p>
                </div>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    <p><strong>যানের পরিচিতি:</strong> 2-0216210</p>
                    <p><strong>প্রাপ্ত পরিচিতি:</strong> 2-000173032</p>
                    <p><strong>রেজিস্ট্রেশন নম্বর:</strong> DHAKA METRO-GHA-11-7939</p>
                    <p><strong>প্রধান নম্বর:</strong> 2-8325485/23</p>
                    <p><strong>যানের বর্ণনা:</strong> HARD JEEP HYUNDAI MOTORS 2005</p>
                    <p><strong>চ্যাসিস নম্বর:</strong> KMHMN81CR5U-170580</p>
                    <p><strong>ইঞ্জিন নম্বর:</strong> G6CU-4050234</p>
                    <p><strong>আসন সংখ্যা:</strong> 7</p>
                    <p><strong>যানবাহন ওজন:</strong> 1860</p>
                    <p><strong>কেবিন বোঝাই ওজন:</strong> 3080</p>
                    <p><strong>টায়ারের সংখ্যা:</strong> 4</p>
                    <p><strong>টায়ারের সাইজ:</strong> 255/65R16</p>
                </div>
                <div class="border-t border-gray-400 mt-4 pt-4 text-sm">
                    <p><strong>নাম:</strong> PALLI KARMA SHAHYAK FOUNDATION</p>
                    <p><strong>ঠিকানা:</strong> PLOT#E-4/B, ASARAGOAN ADMN AREA, SHER-E-BANGLA NAGAR, DHAKA-1207, BANGLADESH</p>
                </div>
                <div class="border-t border-gray-400 mt-4 pt-4 text-sm">
                    <p><strong>বৈধতার সময়:</strong></p>
                    <p>হস্তান্তর: 09/01/2023</p>
                    <p>Approval Date: 09/01/2023 12:28</p>
                    <p>পরিদর্শকের স্বাক্ষর: ______</p>
                </div>
            </div> */}
            <Container className="max-w-[800px] mt-5 mx-auto p-6 border-1  bg-white rounded-lg english-font bangla-font">

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
                        {/* <p><span className="font-semibold">Fitness Period:</span> 08-FEB-2017 :: 08-FEB-2018</p> */}
                        <p><span className="font-semibold">Fitness Period:</span> {helpers.dDate(vehicleDetail?.fitnessValidStartDate)} :: {helpers.dDate(vehicleDetail?.fitnessValidEndDate)}</p>
                    </div>
                </div>

                {/* Information Section */}
                <Table className="my-4" striped bordered>
                    <tbody className='[&>tr>td:nth-child(1)]:[font-weight:bold] [&>tr>td:nth-child(1)]:text-nowrap [&>tr>td:nth-child(3)]:text-nowrap [&>tr>td:nth-child(3)]:[font-weight:bold] [&>tr>td:nth-child(2)]:w-1/3 [&>tr>td]:text-[12px]'>
                        {/* <tr>
                            <td>যানের পরিচিতি</td>
                            <td>2-0216210</td>
                            <td>গ্রাহক পরিচিতি</td>
                            <td>2-000173032</td>
                        </tr> */}
                        <tr>
                            <td>রেজিস্ট্রেশন নম্বর</td>
                            <td>{vehicleDetail?.vehicleRegistration?.fullRegNumber}</td>
                            <td>ফিটনেস সনদ নম্বর</td>
                            <td>{vehicleDetail?.vehicleRegistration?.fitnessCertificateNumber}</td>
                        </tr>
                        <tr>
                            {/* <td>যানের বর্ণনা</td>
                            <td>HARD JEEP HYUNDAI MOTORS 2005</td> */}
                            <td>গাড়ির রং</td>
                            <td>{vehicleDetail?.vehicleInfo?.vehicleColor?.nameEn}</td>
                            <td>প্রস্তুতের সাল</td>
                            <td>{vehicleDetail?.vehicleInfo?.manufacturingYear}</td>
                        </tr>
                        <tr>
                            <td>যানের ধরণ</td>
                            <td>{vehicleDetail?.vehicleInfo?.vehicleType?.nameEn}</td>
                            <td>যানেরে শ্রেণী</td>
                            <td>{vehicleDetail?.vehicleInfo?.vehicleClass?.nameEn}</td>
                        </tr>
                        <tr>
                            <td>ইঞ্জিন নম্বর</td>
                            <td>{vehicleDetail?.vehicleInfo?.engineNumber}</td>
                            <td>চেসিস নম্বর</td>
                            <td>{vehicleDetail?.vehicleInfo?.chassisNumber}</td>
                        </tr>
                        <tr>
                            <td>ভাড়াকৃত</td>
                            <td>{vehicleDetail?.vehicleInfo?.isHire ? 'Yes' : 'No'}</td>
                            <td>আসন</td>
                            <td>{vehicleDetail?.vehicleInfo?.totalSeat}</td>
                        </tr>
                        <tr>
                            <td>খালি গাড়ির ওজন</td>
                            <td>{vehicleDetail?.vehicleInfo?.unladenWeight} কেজি</td>
                            <td>বোঝাই গাড়ির ওজন</td>
                            <td>{vehicleDetail?.vehicleInfo?.maxLadenWeight} কেজি</td>
                        </tr>
                        <tr>
                            <td>সিসি/এমপি</td>
                            <td>{vehicleDetail?.vehicleInfo?.ccOrKw}</td>
                            <td>সিলিন্ডার/মোটর</td>
                            <td>{vehicleDetail?.vehicleInfo?.cylinder}</td>
                        </tr>
                        <tr>
                            <td>টায়ারের সংখ্যা</td>
                            <td>{vehicleDetail?.vehicleInfo?.tyreNumber}</td>
                            <td>টায়ারের সাইজ</td>
                            <td>{vehicleDetail?.vehicleInfo?.tyreSize}</td>
                        </tr>
                        <tr>
                            <td>পরিমাপ</td>
                            <td colSpan={3}>দৈর্ঘ্য {vehicleDetail?.vehicleInfo?.overallLength} মিমি, প্রস্থ {vehicleDetail?.vehicleInfo?.overallWidth} মিমি, উচ্চতা {vehicleDetail?.vehicleInfo?.overallHeight} মিমি</td>
                        </tr>
                        <tr>
                            <td>ওভারহ্যাং</td>
                            <td>সামনে {vehicleDetail?.vehicleInfo?.overhangsFront} (%), পিছনে {vehicleDetail?.vehicleInfo?.overhangsRear} (%)</td>
                            <td>জ্বালানি</td>
                            <td colSpan={3}>{vehicleDetail?.vehicleInfo?.fuelType?.nameEn}</td>
                        </tr>
                        <tr>
                            <td>নাম</td>
                            <td colSpan={3}>{vehicleDetail?.vehicleOwner?.name}</td>
                        </tr>
                        <tr>
                            <td>মালিকের ধরণ</td>
                            {/* <td>{vehicleDetail?.vehicleOwner?.ownerType?.nameEn}</td> */}
                            <td>{vehicleDetail?.vehicleOwner?.ownerType?.nameEn}</td>
                        </tr>
                        <tr>
                            <td>পিতা/স্বামীর নাম</td>
                            <td colSpan={3}>{vehicleDetail?.vehicleOwner?.fatherOrHusbandName}</td>
                        </tr>
                        <tr>
                            <td>ঠিকানা</td>
                            {/* <td colSpan={3}>{vehicleDetail?.addressInfo?.fullAddressBn}</td> */}
                            <td colSpan={3}>{vehicleDetail?.vehicleOwner?.addressInfo?.fullAddressBn}</td>
                        </tr>
                        <tr>
                        </tr>
                        {/* <tr>
                            <td>বৈধতার সময়</td>
                            <td>09/01/2023 - 18/01/2025</td>
                        </tr> */}
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
                            <p>{vehicleDetail?.inspectorNameBn}</p>
                            <p>{vehicleDetail?.inspectorDesignationBn}</p>
                            <p>ফিটনেস প্রদানকারী কর্মকর্তা</p>
                            <p>{vehicleDetail?.issuingAuthority?.nameBn}</p>
                        </div>
                    </div>
                </div>

            </Container>
        </>
    )
}


const styles = StyleSheet.create({
    page: { backgroundColor: '#ffffff' },
    section: { margin: 10, padding: 10 },
});



const FitenessCertificate = ({ serviceRequestId }) => {
    const { t } = useTranslation();
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
                <MainContent t={t} serviceRequestId={serviceRequestId} />
            </div>
        </div>
    )
}

export default (FitenessCertificate)
