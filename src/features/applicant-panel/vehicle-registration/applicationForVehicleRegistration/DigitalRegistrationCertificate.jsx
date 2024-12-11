import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React from 'react';
import { withNamespaces } from 'react-i18next';
import govLogo from '@/assets/images/gov-logo.png';
import brtaLogo from '@/assets/images/logo.png';
import { Container, Row, Col, Table } from 'react-bootstrap';
import Barcode from 'react-barcode'

const MainContent = ({ t }) => {

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
                        <Barcode value="Name: Ruhul Amin"
                            displayValue={false}
                            width={2} // Customize the barcode width if desired
                            height={50} // Customize the barcode height if desired
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <strong>Registration No:</strong> DHAKA METRO-G-47-7369
                    </div>
                    <div>
                        <strong>Date:</strong> 16/05/2022
                    </div>
                    <div>
                        <strong>Vehicle Description:</strong> Car (Saloon)
                    </div>
                    <div>
                        <strong>Vehicle Class:</strong> Motor Car (Large)
                    </div>
                    <div>
                        <strong>Color:</strong> Silver
                    </div>
                    <div>
                        <strong>Fuel:</strong> Petrol
                    </div>
                    <div>
                        <strong>Engine No:</strong> 1NZ-R443113
                    </div>
                    <div>
                        <strong>Chassis No:</strong> NKE165-7138709
                    </div>
                    <div>
                        <strong>Seat:</strong> 5
                    </div>
                    <div>
                        <strong>Weight (Unladen):</strong> 1140 kg
                    </div>
                    <div>
                        <strong>Weight (Laden):</strong> 1415 kg
                    </div>
                    <div>
                        <strong>Issuing Authority:</strong> Mirpur
                    </div>
                </div>

            </div>

            {/* Card 2: Owner's Information */}
            <div className="border rounded-lg shadow-lg p-4 bg-white max-w-md mx-auto">
                <header className="flex justify-between items-center mb-4">
                    <div className="w-1/3">
                        {/* Owner photo Placeholder */}
                        <div className="bg-gray-300 h-16 w-full rounded-md"></div>
                    </div>
                    <div className="text-right">
                        {/* Bangladeshi Flag Placeholder */}
                        <div className="bg-green-600 w-8 h-5 rounded-sm"></div>
                    </div>
                </header>

                <h6 className="text-lg font-bold mb-2">Owner's Name & Address</h6>
                <p className="text-sm mb-1"><strong>Name:</strong> MD. MOSTOFAZAMAN</p>
                <p className="text-sm mb-1"><strong>Address:</strong> HEAD OFFICE, CITY BANK CENTER, 136 GULSHAN AVENUE, GULSHAN-2, DHAKA-1212</p>

                <div className="grid grid-cols-2 gap-2 my-4 text-sm">
                    <div>
                        <strong>Owner Type:</strong> Private
                    </div>
                    <div>
                        <strong>Tyre Size:</strong> 175/65R15
                    </div>
                    <div>
                        <strong>Manufacturing Year:</strong> 2016
                    </div>
                    <div>
                        <strong>Axle Weight:</strong> Front - 800kg
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



const DigitalRegistrationCertificate = ({ t }) => {
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

            <div id="printable-section-digital-registration-certificate">
                <MainContent t={t} />
            </div>
        </div>
    )
}

export default withNamespaces()(DigitalRegistrationCertificate)
