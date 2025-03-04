import React from 'react';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16, // Simulate the gap between cards
  },
  card: {
    width: '30%', // Adjust width to fit 3 cards per row
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'semibold',
    color: '#3b82f6', // Tailwind's text-info color
  },
  value: {
    fontSize: 32,
    fontWeight: 'semibold',
    color: '#1e293b', // Tailwind's text-slate-700 color
    marginTop: 8,
  },
});

// PDF Document Component
const DashboardStylePdf = ({ reportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Drafted Applications */}
      <View style={styles.card}>
        <Text style={[styles.title, { color: '#3b82f6' }]}>Drafted Applications</Text>
        <Text style={styles.value}>{reportData.draftedApplications}</Text>
      </View>

      {/* Submitted for Inspection */}
      <View style={styles.card}>
        <Text style={[styles.title, { color: '#f59e0b' }]}>Submitted for Inspection</Text>
        <Text style={styles.value}>{reportData.submittedForInspection}</Text>
      </View>

      {/* Vehicle Inspection Approved */}
      <View style={styles.card}>
        <Text style={[styles.title, { color: '#10b981' }]}>Vehicle Inspection Approved</Text>
        <Text style={styles.value}>{reportData.inspectionApproved}</Text>
      </View>

      {/* Vehicle Inspection Rejected */}
      <View style={styles.card}>
        <Text style={[styles.title, { color: '#ef4444' }]}>Vehicle Inspection Rejected</Text>
        <Text style={styles.value}>{reportData.inspectionRejected}</Text>
      </View>

      {/* Application submitted for Registration */}
      <View style={styles.card}>
        <Text style={[styles.title, { color: '#3b82f6' }]}>Application submitted for Registration</Text>
        <Text style={styles.value}>{reportData.applicationForRegistrations}</Text>
      </View>

      {/* Registered vehicles */}
      <View style={styles.card}>
        <Text style={[styles.title, { color: '#10b981' }]}>Registered vehicles</Text>
        <Text style={styles.value}>{reportData.registeredVehicles}</Text>
      </View>

      {/* Registration Application Rejected */}
      <View style={styles.card}>
        <Text style={[styles.title, { color: '#ef4444' }]}>Registration Application Rejected</Text>
        <Text style={styles.value}>{reportData.vehicleRegistrationRejected}</Text>
      </View>
    </Page>
  </Document>
);