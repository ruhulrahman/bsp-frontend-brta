import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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
    width: '75%', // Width for Field Name column
  },
  tableHeaderTotal: {
    backgroundColor: '#f0f0f0',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
    width: '15%', // Width for Total column
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
    width: '75%', // Width for Field Name column
  },
  tableCellTotal: {
    fontSize: 14,
    padding: 5,
    textAlign: 'center',
    width: '15%', // Width for Total column
    borderRightWidth: 0, // Remove right border for the last column
  },
  lastRow: {
    flexDirection: 'row',
    borderBottomWidth: 0, // Remove bottom border for the last row
  },
});

const VehicleRegistrationReportPdf = ({ reportData }) => {
  const pdfContent = [
    { id: 1, fieldName: 'Drafted Applications', total: reportData.draftedApplications },
    { id: 2, fieldName: 'Submitted for Inspection', total: reportData.submittedForInspection },
    { id: 3, fieldName: 'Vehicle Inspection Approved', total: reportData.inspectionApproved },
    { id: 4, fieldName: 'Vehicle Inspection Rejected', total: reportData.inspectionRejected },
    { id: 5, fieldName: 'Application submitted for Registration', total: reportData.applicationForRegistrations },
    { id: 6, fieldName: 'Registered vehicles', total: reportData.registeredVehicles },
    { id: 7, fieldName: 'Registration Application Rejected', total: reportData.vehicleRegistrationRejected },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10 }}>Vehicle Registration Report</Text>
        <Text style={{ textAlign: 'center', fontSize: 14, marginBottom: 10 }}>Generated on: {new Date().toLocaleDateString()}</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Sl.</Text>
            <Text style={styles.tableHeaderField}>Field Name</Text>
            <Text style={styles.tableHeaderTotal}>Total</Text>
          </View>

          {/* Table Rows */}
          {pdfContent.map((item, index) => (
            <View key={item.id} style={index === pdfContent.length - 1 ? styles.lastRow : styles.tableRow}>
              <Text style={styles.tableCell}>{item.id}</Text>
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