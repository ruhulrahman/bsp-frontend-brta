import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React, { useEffect } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import govLogo from '@/assets/images/gov-logo.png';
import brtaLogo from '@/assets/images/logo.png';
import { Container, Row, Col, Table } from 'react-bootstrap';
import Barcode from 'react-barcode'
import { useNavigate } from 'react-router-dom';
import RestApi from '@/utils/RestApi';
import { useState } from 'react';
import i18n from '@/i18n';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '@/components/common/Loading';
import helpers from '@/utils/helpers.js';
import QRCode from "react-qr-code";

const MainContent = ({ serviceRequestId }) => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const currentLanguage = i18n.language;
    const [vehicleDetail, setVehicleDetail] = useState({});
    const { activeStatusList, loading, listData, dropdowns, yesNoList } = useSelector((state) => state.common)
    const { authUser, userImage } = useSelector((state) => state.auth) || {};

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
            const { data } = await RestApi.get(`api/v1/applicant/vehicle/get-digital-registration-details/${serviceRequestId}`)
            console.log('data', data)
            setVehicleDetail(data);

            setQrCodeValue(`
                Owner Name: ${data?.vehicleOwner?.name}
                Registration No: ${data?.vehicleRegistration?.fullRegNumber}
                Vehicle Type: ${data?.vehicleInfo?.vehicleType?.nameEn}
            `)

            setBarCodeValue(`
                Owner Name: ${data?.vehicleOwner?.name}
            `)

        } catch (error) {
            console.log('error', error)
        }
    }

    // const [qrCodeValue, setQrCodeValue] = useState(`
    //         Owner Name: ${vehicleDetail?.vehicleOwner?.name}
    //         Registration No: ${vehicleDetail?.vehicleOwner?.fullRegNumber}
    //         Vehicle Type: ${vehicleDetail?.vehicleType?.nameEn}
    //     `)

    // const [qrCodeValue, setQrCodeValue] = useState(`
    //         Owner Name: ${vehicleDetail?.vehicleOwner?.name}
    //         Address: ${vehicleDetail?.addressInfo?.fullAddressEn}
    //         Registration No: ${vehicleDetail?.vehicleOwner?.fullRegNumber}
    //         Registration Date: ${vehicleDetail?.vehicleOwner?.createdAt ? helpers.dDate(vehicleDetail?.vehicleOwner?.createdAt) : ''}
    //         Chassis No: ${vehicleDetail?.vehicleOwner?.chassisNo}
    //         Engine No: ${vehicleDetail?.vehicleOwner?.engineNo}
    //         Issuing Authority: ${vehicleDetail?.issuingAuthority?.nameEn}
    //         Vehicle Type: ${vehicleDetail?.vehicleInfo?.vehicleType?.nameEn}
    //         Vehicle Class: ${vehicleDetail?.vehicleClass?.nameEn}
    //     `)


    return (
        <div className="container mx-auto p-4 space-y-6">

            {/* Card 1: Vehicle Details */}
            <div className="border rounded-lg shadow-sm p-2 bg-white max-w-md mx-auto">
                {/* <h5 className="text-center font-bold text-sm">Certificate of Registration</h5> */}
                <h5 className="text-center font-bold text-sm">Digital Registration Certificate</h5>
                <h6 className="text-center text-sm text-gray-500">Bangladesh Road Transport Authority</h6>

                <div className="text-center mb-1">
                    {/* <div className="bg-gray-300 h-16 w-1/2 mx-auto rounded-md"></div>  */}
                    {/* Placeholder for QR/Barcode */}
                    <div className="mx-auto d-flex align-items-center justify-content-center">
                        {/* {barCodeValue && <Barcode value={barCodeValue}
                            displayValue={false}
                            width={2} // Customize the barcode width if desired
                            height={50} // Customize the barcode height if desired
                        />} */}
                        {/* <Barcode value="Name: Ruhul Amin"
                            displayValue={false}
                            width={2} // Customize the barcode width if desired
                            height={50} // Customize the barcode height if desired
                        /> */}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <div className='col-span-2'>
                        <strong>Registration No:</strong> {vehicleDetail?.vehicleRegistration?.fullRegNumber}
                    </div>
                    <div className='col-span-2'>
                        <strong>Issuing Authority:</strong> {vehicleDetail?.issuingAuthority?.nameEn}
                    </div>
                    <div className='col-span-2'>
                        <strong>Vehicle Class:</strong> {vehicleDetail?.vehicleInfo?.vehicleClass?.nameEn}
                    </div>
                    <div className=''>
                        <strong>Registration Date:</strong> {vehicleDetail?.vehicleRegistration?.createdAt ? helpers.dDate(vehicleDetail?.vehicleRegistration?.createdAt) : ''}
                    </div>
                    <div>
                        <strong>Vehicle Type:</strong> {vehicleDetail?.vehicleInfo?.vehicleType?.nameEn}
                    </div>
                    <div>
                        <strong>Engine No:</strong> {vehicleDetail?.vehicleInfo?.engineNumber}
                    </div>
                    <div>
                        <strong>Chassis No:</strong> {vehicleDetail?.vehicleInfo?.chassisNumber}
                    </div>
                    <div>
                        <strong>Color:</strong> {vehicleDetail?.vehicleInfo?.vehicleColor?.nameEn}
                    </div>
                    <div>
                        <strong>Fuel:</strong> {vehicleDetail?.vehicleInfo?.fuelType?.nameEn}
                    </div>
                    <div>
                        <strong>Weight (Unladen):</strong> {vehicleDetail?.vehicleInfo?.unladenWeight} kg
                    </div>
                    <div>
                        <strong>Weight (Laden):</strong> {vehicleDetail?.vehicleInfo?.maxLadenWeight} kg
                    </div>
                </div>

            </div>

            {/* Card 2: Owner's Information */}
            <div className="border rounded-lg shadow-sm p-2 bg-white max-w-md mx-auto text-[12px]">
                <header className="flex justify-between items-center mb-4">
                    <div className="w-1/3">
                        {/* Owner photo Placeholder */}
                        {/* <div className="bg-gray-300 h-16 w-full rounded-md"></div> */}
                        <div className="bg-gray-300 h-16 w-16 rounded-md">
                            {/* <img src={vehicleDetail?.ownerPhotoInfo?.base64Content} alt="" /> */}
                            {userImage && (
                                <img src={userImage} alt="" className="h-16 w-16 rounded-md" />
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        {/* Bangladeshi Flag Placeholder */}
                        {/* <div className="bg-green-600 w-8 h-5 rounded-sm"></div> */}
                        {/* <div className="bg-gray-300 h-16 w-16 rounded-md"></div> */}
                        {/* {qrCodeValue} */}
                        {qrCodeValue && <QRCode className="bg-gray-300 h-16 w-16 rounded-md" value={qrCodeValue} />}
                    </div>
                </header>

                <h6 className="text-sm font-bold mb-2">Owner's Name & Address</h6>
                <div className="grid grid-cols-2 gap-2 my-2">
                    <p className="mb-1"><strong>Name:</strong> {vehicleDetail?.vehicleOwner?.name}</p>
                    <div>
                        <strong>Owner Type:</strong> {vehicleDetail?.vehicleOwner?.ownerType?.nameEn}
                    </div>
                </div>
                {/* <p className="mb-1"><strong>Address:</strong> {vehicleDetail?.addressInfo?.fullAddressEn}</p> */}
                <p className="mb-1"><strong>Address:</strong> {vehicleDetail?.vehicleOwner?.addressInfo?.fullAddressEn}</p>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <strong>Seat:</strong> {vehicleDetail?.vehicleInfo?.totalSeat}
                    </div>
                    <div>
                        <strong>Tyre Size:</strong> {vehicleDetail?.vehicleInfo?.tyreSize}
                    </div>
                    <div>
                        <strong>Manufacturing Year:</strong> {vehicleDetail?.vehicleInfo?.manufacturingYear}
                    </div>
                    <div>
                        <strong>Axle Weight:</strong>
                        {vehicleDetail?.vehicleInfo?.frontAxle1 && (
                            <span className='ml-1'>Front - {vehicleDetail?.vehicleInfo?.frontAxle1}kg</span>
                        )}
                    </div>
                </div>

                <footer className="mt-2 text-center text-xs text-gray-500">
                    If lost or found, please inform the nearest police station.
                </footer>
            </div>



        </div>
    )
}


const styles = StyleSheet.create({
    page: { backgroundColor: '#ffffff' },
    section: { margin: 10, padding: 10 },
});


const DigitalRegistrationCertificate = ({ serviceRequestId }) => {
    const { t } = useTranslation();
    const handlePrint = () => {
        printJS({
            printable: 'printable-section-digital-registration-certificate',
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

            <div id={`printable-section-digital-registration-certificate`}>
                <MainContent serviceRequestId={serviceRequestId} />
            </div>
        </div>
    )
}

export default (DigitalRegistrationCertificate)
