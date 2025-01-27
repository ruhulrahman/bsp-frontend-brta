import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React, { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
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

const MainContent = ({ t, serviceRequestId }) => {

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
            const { data } = await RestApi.get(`api/v1/applicant/vehicle/get-digital-registration-details/${serviceRequestId}`)
            console.log('data', data)
            setVehicleDetail(data);

            setQrCodeValue(`
                Owner Name: ${data?.vehicleOwner?.name}
                Registration No: ${data?.vehicleOwner?.fullRegNumber}
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
            <div className="border rounded-lg shadow-lg p-4 bg-white max-w-md mx-auto">
                <h5 className="text-center font-bold text-lg">Certificate of Registration</h5>
                <h6 className="text-center text-sm text-gray-500 mb-2">Bangladesh Road Transport Authority</h6>

                <div className="text-center mb-2">
                    {/* <div className="bg-gray-300 h-16 w-1/2 mx-auto rounded-md"></div>  */}
                    {/* Placeholder for QR/Barcode */}
                    <div className="mx-auto d-flex align-items-center justify-content-center">
                        <Barcode value={barCodeValue}
                            displayValue={false}
                            width={2} // Customize the barcode width if desired
                            height={50} // Customize the barcode height if desired
                        />
                        {/* <Barcode value="Name: Ruhul Amin"
                            displayValue={false}
                            width={2} // Customize the barcode width if desired
                            height={50} // Customize the barcode height if desired
                        /> */}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <strong>Registration No:</strong> {vehicleDetail?.vehicleRegistration?.fullRegNumber}
                    </div>
                    <div>
                        <strong>Date:</strong> {vehicleDetail?.vehicleRegistration?.createdAt ? helpers.dDate(vehicleDetail?.vehicleRegistration?.createdAt) : ''}
                    </div>
                    <div>
                        <strong>Vehicle Type:</strong> {vehicleDetail?.vehicleInfo?.vehicleType?.nameEn}
                    </div>
                    <div>
                        <strong>Vehicle Class:</strong> {vehicleDetail?.vehicleInfo?.vehicleClass?.nameEn}
                    </div>
                    <div>
                        <strong>Color:</strong> {vehicleDetail?.vehicleInfo?.vehicleColor?.nameEn}
                    </div>
                    <div>
                        <strong>Fuel:</strong> {vehicleDetail?.vehicleInfo?.fuelType?.nameEn}
                    </div>
                    <div>
                        <strong>Engine No:</strong> {vehicleDetail?.vehicleInfo?.engineNumber}
                    </div>
                    <div>
                        <strong>Chassis No:</strong> {vehicleDetail?.vehicleInfo?.chassisNumber}
                    </div>
                    <div>
                        <strong>Seat:</strong> {vehicleDetail?.vehicleInfo?.totalSeat}
                    </div>
                    <div>
                        <strong>Weight (Unladen):</strong> {vehicleDetail?.vehicleInfo?.unladenWeight} kg
                    </div>
                    <div>
                        <strong>Weight (Laden):</strong> {vehicleDetail?.vehicleInfo?.maxLadenWeight} kg
                    </div>
                    <div>
                        <strong>Issuing Authority:</strong> {vehicleDetail?.issuingAuthority?.nameEn}
                    </div>
                </div>

            </div>

            {/* Card 2: Owner's Information */}
            <div className="border rounded-lg shadow-lg p-4 bg-white max-w-md mx-auto">
                <header className="flex justify-between items-center mb-4">
                    <div className="w-1/3">
                        {/* Owner photo Placeholder */}
                        {/* <div className="bg-gray-300 h-16 w-full rounded-md"></div> */}
                        <div className="bg-gray-300 h-16 w-16 rounded-md">
                            <img src={vehicleDetail?.ownerPhotoInfo?.base64Content} alt="" />
                        </div>
                    </div>
                    <div className="text-right">
                        {/* Bangladeshi Flag Placeholder */}
                        {/* <div className="bg-green-600 w-8 h-5 rounded-sm"></div> */}
                        {/* <div className="bg-gray-300 h-16 w-16 rounded-md"></div> */}
                        {/* {qrCodeValue} */}
                        <QRCode className="bg-gray-300 h-16 w-16 rounded-md" value={qrCodeValue} />
                    </div>
                </header>

                <h6 className="text-lg font-bold mb-2">Owner's Name & Address</h6>
                <p className="text-sm mb-1"><strong>Name:</strong> {vehicleDetail?.vehicleOwner?.name}</p>
                <p className="text-sm mb-1"><strong>Address:</strong> {vehicleDetail?.addressInfo?.fullAddressEn}</p>

                <div className="grid grid-cols-2 gap-2 my-4 text-sm">
                    <div>
                        <strong>Owner Type:</strong> {vehicleDetail?.vehicleOwner?.ownerType?.nameEn}
                    </div>
                    <div>
                        <strong>Tyre Size:</strong> {vehicleDetail?.vehicleInfo?.tyreSize}
                    </div>
                    <div>
                        <strong>Manufacturing Year:</strong> {vehicleDetail?.vehicleInfo?.manufacturingYear}
                    </div>
                    <div>
                        <strong>Axle Weight:</strong> Front - {vehicleDetail?.vehicleInfo?.frontAxle1}kg
                    </div>
                </div>

                <footer className="mt-4 text-center text-xs text-gray-500">
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



const DigitalRegistrationCertificate = ({ t, serviceRequestId }) => {
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
                <MainContent t={t} serviceRequestId={serviceRequestId} />
            </div>
        </div>
    )
}

export default withNamespaces()(DigitalRegistrationCertificate)
