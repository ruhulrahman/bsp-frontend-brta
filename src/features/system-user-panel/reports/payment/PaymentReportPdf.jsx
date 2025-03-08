import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { withTranslation, useTranslation } from 'react-i18next';
import helpers from '@/utils/helpers';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  table: {
    width: '100%',
    display: 'table',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
    width: '10%', // Width for Sl. column
  },
  tableHeaderField: {
    backgroundColor: '#f0f0f0',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
    width: '45%', // Width for Field Name column
  },
  tableHeaderTotal: {
    backgroundColor: '#f0f0f0',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
    width: '45%', // Width for Total column
    borderRightWidth: 0, // Remove right border for the last column
  },
  tableCell: {
    fontSize: 14,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
    width: '10%', // Width for Sl. column
  },
  tableCellField: {
    fontSize: 14,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'left',
    width: '45%', // Width for Field Name column
  },
  tableCellTotal: {
    fontSize: 14,
    padding: 5,
    textAlign: 'left',
    width: '45%', // Width for Total column
    borderRightWidth: 0, // Remove right border for the last column
  },
  lastRow: {
    flexDirection: 'row',
    borderBottomWidth: 0, // Remove bottom border for the last row
  },
});

const VehicleRegistrationReportPdf = ({ viewData }) => {

  const { t } = useTranslation();
  const pdfContent = [
    { fieldName: 'Bank Name', total: viewData.bank_name },
    { fieldName: 'Routing No', total: viewData.routing_no },
    { fieldName: 'Challan No', total: viewData.challan_no },
    { fieldName: 'Service Name', total: viewData.serviceNameEn },
    { fieldName: 'Paid Amount', total: viewData.paidamount },
    { fieldName: 'Entry Date', total: helpers.dDate(viewData.entry_date) },
    { fieldName: 'Payment Date', total: helpers.dDate(viewData.payment_date) },
    { fieldName: 'Payment Id', total: viewData.payment_id },
    { fieldName: 'Client Name', total: viewData.client_name },
    { fieldName: 'Mobile No', total: viewData.mobile_no },
    { fieldName: 'Address', total: viewData.address },
    { fieldName: 'Email', total: viewData.email },
    { fieldName: 'TIN', total: viewData.tin },
    { fieldName: 'BIN', total: viewData.bin },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10 }}>Payment Report</Text>
        <Text style={{ textAlign: 'center', fontSize: 14, marginBottom: 10 }}>Generated on: {new Date().toLocaleDateString()}</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Sl.</Text>
            <Text style={styles.tableHeaderField}>Field Name</Text>
            <Text style={styles.tableHeaderTotal}>Value</Text>
          </View>

          {/* Table Rows */}
          {pdfContent.map((item, index) => (
            <View key={index} style={index === pdfContent.length - 1 ? styles.lastRow : styles.tableRow}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCellField}>{item.fieldName}</Text>
              <Text style={styles.tableCellTotal}>{item.total}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default VehicleRegistrationReportPdf;