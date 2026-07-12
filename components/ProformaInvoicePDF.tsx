import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1 solid #eaeaea', paddingBottom: 20, marginBottom: 30 },
  brandTitle: { fontSize: 24, fontWeight: 'bold', color: '#0a0a0a', letterSpacing: 2 },
  brandSub: { fontSize: 9, color: '#666666', marginTop: 4, letterSpacing: 1 },
  invoiceLabel: { fontSize: 10, color: '#999999', textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'right' },
  invoiceDate: { fontSize: 10, color: '#0a0a0a', marginTop: 4, textAlign: 'right' },
  clientSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 9, color: '#999999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  clientName: { fontSize: 14, color: '#0a0a0a', fontWeight: 'bold' },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #eaeaea', paddingBottom: 8, marginBottom: 12 },
  colCode: { width: '20%', fontSize: 9, color: '#999999', textTransform: 'uppercase' },
  colItem: { width: '40%', fontSize: 9, color: '#999999', textTransform: 'uppercase' },
  colPurity: { width: '15%', fontSize: 9, color: '#999999', textTransform: 'uppercase', textAlign: 'center' },
  colPrice: { width: '25%', fontSize: 9, color: '#999999', textTransform: 'uppercase', textAlign: 'right' },
  row: { flexDirection: 'row', borderBottom: '1 solid #f5f5f5', paddingVertical: 12, alignItems: 'center' },
  textCode: { width: '20%', fontSize: 10, color: '#666666' },
  textItem: { width: '40%', fontSize: 11, color: '#0a0a0a' },
  textPurity: { width: '15%', fontSize: 10, color: '#666666', textAlign: 'center' },
  textPrice: { width: '25%', fontSize: 11, color: '#0a0a0a', textAlign: 'right' },
  totalSection: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, paddingTop: 20, borderTop: '1 solid #eaeaea' },
  totalLabel: { fontSize: 12, color: '#666666', marginRight: 20, textTransform: 'uppercase', letterSpacing: 1 },
  totalValue: { fontSize: 16, color: '#0a0a0a', fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, borderTop: '1 solid #eaeaea', paddingTop: 20 },
  footerText: { fontSize: 8, color: '#999999', textAlign: 'center', lineHeight: 1.5 }
});

export const ProformaInvoicePDF = ({ clientName, items, totalValue }: any) => {
  const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>ASHOK JEWELS</Text>
            <Text style={styles.brandSub}>FINE WHOLESALE BULLION & DIAMONDS</Text>
          </View>
          <View>
            <Text style={styles.invoiceLabel}>Proforma Invoice</Text>
            <Text style={styles.invoiceDate}>Generated: {currentDate}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>Prepared For</Text>
          <Text style={styles.clientName}>{clientName || 'Guest Wholesale Client'}</Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.colCode}>Design Code</Text>
          <Text style={styles.colItem}>Description</Text>
          <Text style={styles.colPurity}>Purity</Text>
          <Text style={styles.colPrice}>Est. Value (INR)</Text>
        </View>

        {/* Line Items */}
        {items.map((item: any, i: number) => (
          <View key={i} style={styles.row}>
            <Text style={styles.textCode}>{item.designCode}</Text>
            <Text style={styles.textItem}>{item.title}</Text>
            <Text style={styles.textPurity}>{item.metalPurity || '18KT'}</Text>
            <Text style={styles.textPrice}>{item.estimatedPrice.toLocaleString('en-IN')}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Proforma Value:</Text>
          <Text style={styles.totalValue}>₹ {totalValue.toLocaleString('en-IN')}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is a computer-generated proforma estimate based on live market spot rates at the time of generation. 
            Final transaction values may fluctuate based on exact dispatch weights and MCX execution locks.
          </Text>
        </View>

      </Page>
    </Document>
  );
};

export default ProformaInvoicePDF;