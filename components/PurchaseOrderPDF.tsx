import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// --- STRICT SANS-SERIF LUXURY STYLING ---
const styles = StyleSheet.create({
  page: { 
    paddingHorizontal: 48, 
    paddingVertical: 48, 
    backgroundColor: '#ffffff', 
    fontFamily: 'Helvetica' 
  },
  
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0', 
    paddingBottom: 24, 
    marginBottom: 32 
  },
  logoBox: { 
    flex: 1, 
    flexDirection: 'column' 
  },
  logoImage: { 
    width: 160, 
    height: 45, 
    objectFit: 'contain', 
    marginBottom: 8 
  }, 
  subtitle: { 
    fontSize: 8, 
    color: '#888888', 
    letterSpacing: 2, 
    textTransform: 'uppercase', 
    fontFamily: 'Helvetica-Bold' 
  },
  
  headerRight: { 
    alignItems: 'flex-end' 
  },
  poBadge: { 
    backgroundColor: '#4e080f', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 4, 
    marginBottom: 8 
  },
  poBadgeText: { 
    color: '#ffffff', 
    fontSize: 10, 
    letterSpacing: 1.5, 
    fontFamily: 'Helvetica-Bold' 
  },
  poNumber: { 
    fontSize: 11, 
    color: '#555555', 
    letterSpacing: 1 
  },

  infoBox: { 
    flexDirection: 'row', 
    backgroundColor: '#f8f9fa', 
    padding: 24, 
    borderRadius: 8, 
    marginBottom: 36 
  },
  col: { flex: 1 },
  label: { 
    fontSize: 8, 
    color: '#999999', 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold'
  },
  value: { 
    fontSize: 11, 
    color: '#222222', 
    fontFamily: 'Helvetica-Bold' 
  },
  mt16: { marginTop: 16 },

  tableHeader: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e0e0e0', 
    paddingBottom: 12, 
    marginBottom: 8 
  },
  th: { 
    fontSize: 8, 
    color: '#4e080f', 
    fontFamily: 'Helvetica-Bold', 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f8f9fa', 
    paddingVertical: 16, 
    alignItems: 'center' 
  },
  
  colImage: { flex: 0.8 },
  colDesign: { flex: 2.2, paddingRight: 12 },
  colMatrix: { flex: 1.5 },
  colQty: { flex: 0.8, textAlign: 'center' },
  colSubtotal: { flex: 1.7, textAlign: 'right' },

  thumbnail: { width: 40, height: 40, borderRadius: 4, objectFit: 'cover' },
  placeholderThumb: { width: 40, height: 40, borderRadius: 4, backgroundColor: '#eeeeee', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 6, color: '#aaaaaa', fontFamily: 'Helvetica-Bold' },

  tdTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#222222', marginBottom: 4 },
  tdSubtitle: { fontSize: 8, color: '#888888', lineHeight: 1.4 },
  tdMatrixText: { fontSize: 9, color: '#555555' },
  tdQtyText: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#222222' },
  tdSubtotalText: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#4e080f' },
  
  footerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 48 
  },
  noticeBox: { 
    flex: 1.2, 
    paddingRight: 48 
  },
  noticeTitle: { 
    fontSize: 9, 
    color: '#4e080f', 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 8 
  },
  noticeText: { 
    fontSize: 8, 
    color: '#777777', 
    lineHeight: 1.6 
  },
  
  summaryBox: { 
    width: 260, 
    backgroundColor: '#f8f9fa', 
    padding: 24, 
    borderRadius: 8 
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  summaryText: { 
    fontSize: 9, 
    color: '#555555' 
  },
  summaryDivider: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#dddddd', 
    paddingBottom: 12, 
    marginBottom: 12 
  },
  summaryTotalText: { 
    fontSize: 10, 
    fontFamily: 'Helvetica-Bold', 
    color: '#4e080f' 
  },
  summaryTotalValue: { 
    fontSize: 14, 
    fontFamily: 'Helvetica-Bold', 
    color: '#4e080f' 
  },
});

export const PurchaseOrderPDF = ({ orderData }: { orderData: any }) => {
  const formatPrice = (amount: number) => `INR ${amount.toLocaleString('en-IN')}`;
  const getPrice = (item: any) => Number(item.estimatedPrice || item.unitPrice || item.basePrice || item.price || 0);

  // THE FIX: Dynamically grabbing the absolute URL so @react-pdf can actually "see" the image
  const logoUrl = typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : 'http://localhost:3000/logo.png';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* --- HEADER --- */}
        <View style={styles.headerContainer}>
          <View style={styles.logoBox}>
            <Image 
              src={logoUrl} 
              style={styles.logoImage} 
            />
            <Text style={styles.subtitle}>Global B2B Wholesale Portal</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.poBadge}>
              <Text style={styles.poBadgeText}>PURCHASE ORDER</Text>
            </View>
            <Text style={styles.poNumber}>{orderData.poNumber}</Text>
          </View>
        </View>

        {/* --- METADATA GRID --- */}
        <View style={styles.infoBox}>
          <View style={styles.col}>
            <Text style={styles.label}>Billed To</Text>
            <Text style={styles.value}>Approved Partner (Tier A)</Text>
            <View style={styles.mt16}>
              <Text style={styles.label}>Order Date</Text>
              <Text style={styles.value}>
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
            </View>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Total Matrix Units</Text>
            <Text style={styles.value}>{orderData.totalUnits} Pieces</Text>
            <View style={styles.mt16}>
              <Text style={styles.label}>Order Status</Text>
              <Text style={styles.value}>Draft / Pending Authorization</Text>
            </View>
          </View>
        </View>

        {/* --- LINE ITEMS TABLE --- */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colImage]}></Text>
            <Text style={[styles.th, styles.colDesign]}>Design Code</Text>
            <Text style={[styles.th, styles.colMatrix]}>Component Matrix</Text>
            <Text style={[styles.th, styles.colQty]}>Qty</Text>
            <Text style={[styles.th, styles.colSubtotal]}>Tentative Subtotal</Text>
          </View>

          {orderData.items.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              
              {/* Product Thumbnail / Fallback */}
              <View style={styles.colImage}>
                {item.imageUrl ? (
                  <Image src={item.imageUrl} style={styles.thumbnail} />
                ) : (
                  <View style={styles.placeholderThumb}>
                    <Text style={styles.placeholderText}>NO IMG</Text>
                  </View>
                )}
              </View>

              <View style={styles.colDesign}>
                <Text style={styles.tdTitle}>{item.designCode}</Text>
                <Text style={styles.tdSubtitle}>{item.title}</Text>
              </View>

              <View style={styles.colMatrix}>
                <Text style={styles.tdMatrixText}>
                  {item.purity || item.size || 'STD'} | {item.metal || item.color || 'METAL'}
                </Text>
              </View>
              
              <View style={styles.colQty}>
                <Text style={styles.tdQtyText}>{item.quantity}</Text>
              </View>
              
              <View style={styles.colSubtotal}>
                <Text style={styles.tdSubtotalText}>
                  {formatPrice(getPrice(item) * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* --- FOOTER: NOTICE & SUMMARY --- */}
        <View style={styles.footerContainer}>
          
          <View style={styles.noticeBox}>
            <Text style={styles.noticeTitle}>IMPORTANT MARKET NOTICE</Text>
            <Text style={styles.noticeText}>
              This document is a Draft Purchase Order to initiate production or lock inventory. 
              The total value shown is an ESTIMATE based on today's base gold rate. Final metal 
              invoicing will be dynamically calculated based on the live MCX/International 
              Gold Rate on the exact day funds are transferred and authorized.
            </Text>
          </View>

          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Component Matrix Total</Text>
              <Text style={styles.summaryText}>{formatPrice(orderData.totalValue)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryDivider]}>
              <Text style={styles.summaryText}>Partner Discount</Text>
              <Text style={styles.summaryText}>- TBD -</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalText}>Tentative Value</Text>
              <Text style={styles.summaryTotalValue}>{formatPrice(orderData.totalValue)}</Text>
            </View>
          </View>

        </View>

      </Page>
    </Document>
  );
};