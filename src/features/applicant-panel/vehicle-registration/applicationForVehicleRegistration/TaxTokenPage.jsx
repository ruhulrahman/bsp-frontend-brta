import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import printJS from 'print-js';
import React from 'react';
import { withNamespaces } from 'react-i18next';
import govLogo from '@/assets/images/gov-logo.png';
import brtaLogo from '@/assets/images/logo.png';

const TaxTokenPrintSectionWithoutImage = ({ t }) => {
    return (
        <div className="max-w-[800px] mx-auto p-6 border-2 border-gray-400 bg-white rounded-lg shadow-md english-font bangla-font">
            {/* Header Section */}
            <div className="row border-b-2 pb-4 mb-2">
                <div className="col-md-4 text-right">
                    <img src={govLogo} alt="GOV Logo" className="h-12 border-gray-400 border-1 rounded-full  ml-auto" />
                </div>
                <div className="col-md-4 text-center">
                    <p className="text-sm font-semibold">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
                    <p className="text-sm font-semibold">বাংলাদেশ রোড ট্রান্সপোর্ট অথরিটি</p>
                    <h2 className="text-base font-bold">ট্যাক্স টোকেন</h2>
                    <p className="text-xs text-red-500 font-bold">Always Keep This In Your Vehicle</p>
                </div>
                <div className="col-md-4">
                    <img src={brtaLogo} alt="BRTA Logo" className="h-12" />
                </div>
            </div>
            {/* Header Section */}

            <div className="row border-b-2 pb-2 mb-2">
                <div className="col-md-12">
                    <p><span className="font-semibold">TAX Token Period:</span> 08-FEB-2017 :: 08-FEB-2018</p>
                </div>
            </div>

            {/* Document Content */}
            <div className="grid grid-cols-2 gap-x-6">
                <div>
                    <p className="font-semibold">Registration Number:</p>
                    <p>DHAKA METRO-THA-13-3000</p>

                    <p className="font-semibold mt-2">Registration Date:</p>
                    <p>08-FEB-15</p>

                    <p className="font-semibold mt-2">Tax Token Number:</p>
                    <p>172957695</p>

                    <p className="font-semibold mt-2">Transaction No:</p>
                    <p>1702121214356</p>

                    <p className="font-semibold mt-2">eTracking No:</p>
                    <p>170212124286</p>

                    <p className="font-semibold mt-2">Issuing Bank Name:</p>
                    <p>BRAC BANK LTD</p>
                </div>

                <div>
                    <p className="font-semibold">Issuing Branch/Booth Name:</p>
                    <p>MIRPUR BRTA BOOTH</p>

                    <p className="font-semibold mt-2">Issuing Teller Name:</p>
                    <p>TELLER-17</p>

                    <p className="font-semibold mt-2">Chassis Number:</p>
                    <p>LETEDCD12CHP20080</p>

                    <p className="font-semibold mt-2">Engine Number:</p>
                    <p>JX493Z0C4CA3045566</p>

                    <p className="font-semibold mt-2">Seats / Laden Wt. (Kg):</p>
                    <p>5 / 2495 (Kg)</p>

                    <p className="font-semibold mt-2">Owner Name:</p>
                    <p>CHAIRMAN BRTA</p>
                </div>
            </div>

            <div className="mt-4">
                <div className="grid grid-cols-2 gap-x-6">
                    <div>
                        <p className="font-semibold">Father/Husband Name:</p>
                        <p>UNDEFINED</p>

                        <p className="font-semibold mt-2">Previous Expiry Date:</p>
                        <p>08-FEB-2017</p>

                        <p className="font-semibold mt-2">Issue Date:</p>
                        <p>12-FEB-2017</p>
                    </div>

                    <div>
                        <p className="font-semibold mt-2">Principal Amount (Tk):</p>
                        <p>4,995.00</p>

                        <p className="font-semibold mt-2">Fine / Additional (Tk):</p>
                        <p>27.00</p>

                        <p className="font-semibold mt-2">Total Amount Paid (Tk):</p>
                        <p>5,022.00</p>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="text-center mt-6 border-b-2 pb-4">
                {/* <p className="text-xs italic">FOR OFFICIAL USE ONLY</p> */}
                <div className="mt-4">
                    {/* Barcode and footer logos */}
                    {/* <img src="barcode.png" alt="Barcode" className="h-12 mx-auto" /> */}
                </div>
            </div>

            <div className="text-center mt-4 bg-gray-100 p-3">
                <p className="text-xs font-bold">Operation & Maintenance by: iBAS</p>
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

const TaxTokenPage = ({ t }) => {
    const handlePrint = () => {
        printJS({
            printable: 'printable-section',
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

            <div id="printable-section">
                <TaxTokenPrintSectionWithoutImage t={t} />
            </div>
        </div>
    )
}

export default withNamespaces()(TaxTokenPage)
