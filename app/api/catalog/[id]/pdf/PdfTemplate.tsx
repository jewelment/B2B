import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image as PdfImage } from '@react-pdf/renderer';

// --- LUXURY MODERN AESTHETICS ---
const styles = StyleSheet.create({
  page: { 
    backgroundColor: '#fafafa', 
    padding: 40, 
    fontFamily: 'Helvetica' 
  },
  coverPage: { 
    backgroundColor: '#111111', 
    padding: 0 
  },
  coverImage: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' 
  },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginBottom: 40, 
    borderBottomWidth: 1, 
    borderBottomColor: '#dddddd', 
    paddingBottom: 16 
  },
  brandBox: { flexDirection: 'column' },
  brandName: { 
    fontSize: 20, 
    color: '#111111', 
    letterSpacing: 4, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  catalogName: { 
    fontSize: 10, 
    color: '#888888', 
    letterSpacing: 2, 
    textTransform: 'uppercase' 
  },
  confidentialBadge: {
    backgroundColor: '#4e080f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2
  },
  confidentialText: {
    color: '#ffffff',
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },

  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 20 
  },
  itemCard: { 
    width: '47.5%', 
    marginBottom: 24, 
    backgroundColor: '#ffffff',
    borderWidth: 1, 
    borderColor: '#eaeaea',
    borderRadius: 4,
    overflow: 'hidden'
  },
  itemImageWrapper: {
    width: '100%',
    height: 220,
    backgroundColor: '#f5f5f5',
    padding: 10
  },
  itemImage: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'contain' 
  },
  itemDetails: { 
    padding: 16,
    flexDirection: 'column' 
  },
  itemCode: { 
    fontSize: 8, 
    color: '#999999', 
    letterSpacing: 1,
    marginBottom: 4 
  },
  itemTitle: { 
    fontSize: 12, 
    color: '#222222',
    fontWeight: 'bold', 
    marginBottom: 12, 
    lineHeight: 1.4,
    maxLines: 2 
  },
  
  itemPriceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0', 
    paddingTop: 12 
  },
  itemPurity: { 
    fontSize: 7, 
    backgroundColor: '#4e080f15',
    color: '#4e080f',
    paddingHorizontal: 6,
    paddingVertical: 3,
    letterSpacing: 1,
    fontWeight: 'bold',
    borderRadius: 2
  },
  itemPriceCol: {
    alignItems: 'flex-end'
  },
  itemPriceLabel: {
    fontSize: 6,
    color: '#aaaaaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2
  },
  itemPrice: { 
    fontSize: 12, 
    color: '#111111', 
    fontWeight: 'bold' 
  },
  
  footer: { 
    position: 'absolute', 
    bottom: 40, 
    left: 40, 
    right: 40, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1, 
    borderTopColor: '#eeeeee', 
    paddingTop: 12 
  },
  footerText: {
    color: '#aaaaaa', 
    fontSize: 8,
    letterSpacing: 1
  },
  pageNumber: { 
    fontSize: 8, 
    color: '#aaaaaa',
    letterSpacing: 1
  }
});

export const CatalogDocument = ({ catalog, products, config }: { catalog: any, products: any[], config: any }) => {
  const hidePricing = config.hidePricing || false;
  const formatPrice = (amount: number) => `INR ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;

  return (
    <Document>
      {/* Front Cover */}
      {config.frontCover && (
        <Page size="A4" style={styles.coverPage}>
          <PdfImage src={config.frontCover} style={styles.coverImage} />
        </Page>
      )}

      {/* Internal Product Grid */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandBox}>
            <Text style={styles.brandName}>ASHOK JEWELS</Text>
            <Text style={styles.catalogName}>{catalog.name || 'Catalog'}</Text>
          </View>
          <View style={styles.confidentialBadge}>
             <Text style={styles.confidentialText}>Confidential / B2B</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {catalog.items.map((catItem: any, idx: number) => {
            const p = products.find(prod => prod.designCode === catItem.designCode);
            if (!p) return null;

            let imgSrc = '';
            if (p.media && p.media.length > 0 && p.media[0].url) {
               imgSrc = p.media[0].url;
            } else if (p.description && (p.description.startsWith('http') || p.description.startsWith('data:image'))) {
               imgSrc = p.description;
            }

            return (
              <View key={idx} style={styles.itemCard} wrap={false}>
                <View style={styles.itemImageWrapper}>
                  {imgSrc ? (
                    <PdfImage src={imgSrc} style={styles.itemImage} />
                  ) : (
                    <View style={styles.itemImage} />
                  )}
                </View>
                
                <View style={styles.itemDetails}>
                  <Text style={styles.itemCode}>{p.designCode || ''}</Text>
                  <Text style={styles.itemTitle}>{p.title || ''}</Text>
                  
                  <View style={styles.itemPriceRow}>
                    <Text style={styles.itemPurity}>{p.metalPurity || '18KT'}</Text>
                    {!hidePricing && (
                      <View style={styles.itemPriceCol}>
                        <Text style={styles.itemPriceLabel}>Est. Value</Text>
                        <Text style={styles.itemPrice}>{formatPrice(p.price || p.estimatedPrice || 0)}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Ashok Jewels Wholesale Partner Portal</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `PAGE ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
      
      {/* Back Cover */}
      {config.backCover && (
        <Page size="A4" style={styles.coverPage}>
          <PdfImage src={config.backCover} style={styles.coverImage} />
        </Page>
      )}
    </Document>
  );
};
