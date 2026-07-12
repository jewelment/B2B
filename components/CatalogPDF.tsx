import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// --- STYLES FOR THE PDF ---
const styles = StyleSheet.create({
  page: { 
    backgroundColor: '#ffffff', 
    padding: 40, 
    fontFamily: 'Helvetica' 
  },
  coverPage: { 
    backgroundColor: '#4e080f', 
    padding: 40, 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  coverTitle: { 
    color: '#dfae61', 
    fontSize: 36, 
    letterSpacing: 4, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  coverSubtitle: { 
    color: '#ffffff', 
    fontSize: 14, 
    letterSpacing: 2, 
    textTransform: 'uppercase', 
    opacity: 0.8 
  },
  coverDate: { 
    color: '#ffffff', 
    fontSize: 10, 
    marginTop: 40, 
    opacity: 0.5 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eeeeee', 
    paddingBottom: 10, 
    marginBottom: 30 
  },
  brandText: { 
    color: '#4e080f', 
    fontSize: 16, 
    letterSpacing: 2, 
    fontWeight: 'bold' 
  },
  catalogName: { 
    color: '#888888', 
    fontSize: 10, 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  productGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 20 
  },
  productCard: { 
    width: '47%', 
    marginBottom: 30 
  },
  productImagePlaceholder: { 
    width: '100%', 
    height: 250, 
    backgroundColor: '#f8f9fa', 
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eeeeee'
  },
  placeholderText: {
    fontSize: 10,
    color: '#aaaaaa',
    letterSpacing: 1
  },
  productCategory: { 
    fontSize: 8, 
    color: '#dfae61', 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    marginBottom: 4 
  },
  productTitle: { 
    fontSize: 14, 
    color: '#222222', 
    marginBottom: 4 
  },
  productSku: { 
    fontSize: 10, 
    color: '#888888', 
    marginBottom: 8 
  },
  priceContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderTopWidth: 1, 
    borderTopColor: '#eeeeee', 
    paddingTop: 8, 
    marginTop: 8 
  },
  priceLabel: { 
    fontSize: 8, 
    color: '#888888', 
    textTransform: 'uppercase' 
  },
  priceValue: { 
    fontSize: 12, 
    color: '#4e080f', 
    fontWeight: 'bold' 
  },
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    textAlign: 'center', 
    color: '#aaaaaa', 
    fontSize: 8, 
    borderTopWidth: 1, 
    borderTopColor: '#eeeeee', 
    paddingTop: 10 
  }
});

// --- MOCK PRODUCT DATA (Until Master Inventory API wiring) ---
const mockProducts = [
  { id: 'AJ-RG-001', title: 'Diamond Floral Leaf Ring', category: 'Rings', basePrice: '₹45,000' },
  { id: 'AJ-ER-042', title: 'Yellow Gold Open Leaf Studs', category: 'Earrings', basePrice: '₹32,000' },
  { id: 'AJ-PT-088', title: 'Emerald Cut Tanzanite Halo', category: 'Pendants', basePrice: '₹85,000' }
];

// --- THE PDF COMPONENT ---
export default function CatalogPDF({ catalog }: { catalog: any }) {
  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverTitle}>ASHOK JEWELS</Text>
        <Text style={styles.coverSubtitle}>{catalog?.name || 'CUSTOM LINE SHEET'}</Text>
        <Text style={styles.coverDate}>Generated on {new Date().toLocaleDateString('en-IN')}</Text>
      </Page>

      {/* Products Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brandText}>ASHOK JEWELS</Text>
          <Text style={styles.catalogName}>{catalog?.name || 'CUSTOM LINE SHEET'}</Text>
        </View>

        <View style={styles.productGrid}>
          {mockProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              
              {/* Clean Image Placeholder Container */}
              <View style={styles.productImagePlaceholder}>
                <Text style={styles.placeholderText}>IMAGE PENDING</Text>
              </View>
              
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productSku}>{product.id}</Text>
              
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Wholesale Est.</Text>
                <Text style={styles.priceValue}>{product.basePrice}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footer} fixed>
          Prices are estimated and subject to live bullion rates. Contact your account manager for finalized POs.
        </Text>
      </Page>
    </Document>
  );
}