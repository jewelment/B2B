import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image as PdfImage } from '@react-pdf/renderer';
import path from 'path';
import fs from 'fs';

// --- LUXURY MODERN AESTHETICS ---
const styles = StyleSheet.create({
  page: { backgroundColor: '#fafafa', padding: 30, fontFamily: 'Helvetica' },
  coverPage: { backgroundColor: '#111111', padding: 0 },
  coverImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', objectFit: 'cover' },
  coverOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', padding: 40
  },
  coverTitle: { fontSize: 28, color: '#ffffff', letterSpacing: 6, textTransform: 'uppercase', textAlign: 'center' },
  coverSubtitle: { fontSize: 10, color: '#ffffff', letterSpacing: 4, textTransform: 'uppercase', marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#ffffff', paddingBottom: 6 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#dddddd', paddingBottom: 10 },
  brandBox: { flexDirection: 'column' },
  brandName: { fontSize: 20, color: '#111111', letterSpacing: 4, fontWeight: 'bold', marginBottom: 4 },
  catalogName: { fontSize: 10, color: '#888888', letterSpacing: 2, textTransform: 'uppercase' },
  confidentialBadge: { backgroundColor: '#4e080f', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 2 },
  confidentialText: { color: '#ffffff', fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 'bold' },

  // Bento Box Flex System
  gridWrapper: { flex: 1, display: 'flex', flexDirection: 'column', gap: 10 },
  flexRow: { display: 'flex', flexDirection: 'row', gap: 10, flex: 1 },
  flexRowAuto: { display: 'flex', flexDirection: 'row', gap: 10 },

  itemCard: { 
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eaeaea', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column'
  },
  itemImageWrapper: { width: '100%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  itemImageWrapperLarge: { height: 480 }, // For 1 item per page
  itemImageWrapperSmall: { height: 240 }, // For 4 items per page
  itemImage: { width: '100%', height: '100%', objectFit: 'contain' },
  itemDetails: { padding: 10, flexDirection: 'column', backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f0f0f0', height: 80 },
  itemCode: { fontSize: 7, color: '#999999', letterSpacing: 1, marginBottom: 2 },
  itemTitle: { fontSize: 10, color: '#222222', fontWeight: 'bold', marginBottom: 6, lineHeight: 1.3, height: 26 },
  
  itemPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  itemPurity: { fontSize: 6, backgroundColor: '#4e080f15', color: '#4e080f', paddingHorizontal: 5, paddingVertical: 3, letterSpacing: 1, borderRadius: 2 },
  itemPriceCol: { alignItems: 'flex-end' },
  itemPriceLabel: { fontSize: 5, color: '#aaaaaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 1 },
  itemPrice: { fontSize: 10, color: '#111111', fontWeight: 'bold' },
  
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eeeeee', paddingTop: 12 },
  footerText: { color: '#aaaaaa', fontSize: 8, letterSpacing: 1 },
  pageNumber: { fontSize: 8, color: '#aaaaaa', letterSpacing: 1 }
});

export const PdfTemplate = ({ catalog, products, config, baseUrl }: { catalog: any, products: any[], config: any, baseUrl: string }) => {
  const rawDesktop = config.desktopItemsPerPage !== undefined ? config.desktopItemsPerPage : 4;
  const itemsPerPage = Number(rawDesktop);
  const hidePricing = config.hidePricing || false;

  const resolvePdfImage = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${baseUrl}${url}`;
  };

  const formatPrice = (amount: number) => {
    if (!amount || amount === 0) return 'Price on Request';
    return `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;
  };

  const prefImgIdx = Number(config.preferredImageIndex || 0);
  const getProductImage = (p: any) => {
    if (!p.media || p.media.length === 0) {
      if (p.description && (p.description.startsWith('http') || p.description.startsWith('data:image'))) return resolvePdfImage(p.description);
      return '';
    }
    
    const targetSeq = prefImgIdx + 1;
    
    // 1. Exact match by sequence
    const exact = p.media.find((m: any) => m.sequence === targetSeq);
    if (exact && exact.url) return resolvePdfImage(exact.url);
    
    // 2. Fallbacks
    if (targetSeq === 2) {
      const fallback3 = p.media.find((m: any) => m.sequence === 3);
      if (fallback3 && fallback3.url) return resolvePdfImage(fallback3.url);
      const fallback1 = p.media.find((m: any) => m.sequence === 1);
      if (fallback1 && fallback1.url) return resolvePdfImage(fallback1.url);
    } else if (targetSeq === 3) {
      const fallback2 = p.media.find((m: any) => m.sequence === 2);
      if (fallback2 && fallback2.url) return resolvePdfImage(fallback2.url);
      const fallback1 = p.media.find((m: any) => m.sequence === 1);
      if (fallback1 && fallback1.url) return resolvePdfImage(fallback1.url);
    }
    
    return resolvePdfImage(p.media[0].url);
  };

  // --- CHUNKING ENGINE (Sync with Flipbook) ---
  const productItems = catalog.items || [];
  const pages: Array<{ type: 'PRODUCTS', items: any[] } | { type: 'INSERT', image: string }> = [];

  let i = 0;
  let patternIndex = 0;
  const pattern = [1, 4, 4]; // Only 1 and 4 allowed!

  while (i < productItems.length) {
    const remaining = productItems.length - i;
    let take = itemsPerPage;

    if (itemsPerPage === 0) { // Smart Auto-Align
      take = pattern[patternIndex % pattern.length];
      patternIndex++;
    }

    // Force fallback to 1 if we need 4 but don't have enough to form a complete grid
    if (take > 1 && remaining < take) {
      take = 1;
    }

    pages.push({ type: 'PRODUCTS', items: productItems.slice(i, i + take) });
    i += take;
  }

  // Inject Inserts
  if (config.lifestyleInserts && Array.isArray(config.lifestyleInserts)) {
    const inserts = [...config.lifestyleInserts].sort((a: any, b: any) => {
      const posA = typeof a === 'object' ? a.position : 0;
      const posB = typeof b === 'object' ? b.position : 0;
      return posB - posA;
    });
    inserts.forEach((insert: any) => {
      const pos = typeof insert === 'object' ? insert.position : 0;
      const img = typeof insert === 'object' ? insert.image : insert;
      pages.splice(pos, 0, { type: 'INSERT', image: resolvePdfImage(img) });
    });
  }

  // --- RENDER COMPONENT ---
  const renderItemCard = (catItem: any, flexStyle: any, isLarge: boolean = false) => {
    const p = products.find(prod => prod.designCode === catItem.designCode);
    if (!p) return <View style={[styles.itemCard, flexStyle]} wrap={false} />;
    const imgSrc = getProductImage(p);

    return (
      <View style={[styles.itemCard, flexStyle]} wrap={false}>
        <View style={[styles.itemImageWrapper, isLarge ? styles.itemImageWrapperLarge : styles.itemImageWrapperSmall]}>
          {imgSrc ? <PdfImage src={imgSrc} style={styles.itemImage} /> : null}
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
  };

  const renderBentoGrid = (items: any[]) => {
    const count = items.length;
    
    if (count === 1) {
      return (
        <View style={styles.gridWrapper} wrap={false}>
          {renderItemCard(items[0], { flex: 1 }, true)}
        </View>
      );
    }
    
    if (count === 2) {
      return (
        <View style={styles.gridWrapper} wrap={false}>
          {renderItemCard(items[0], { flex: 1 })}
          {renderItemCard(items[1], { flex: 1 })}
        </View>
      );
    }

    if (count === 3) {
      return (
        <View style={styles.gridWrapper} wrap={false}>
          <View style={styles.flexRow} wrap={false}>{renderItemCard(items[0], { flex: 1 })}</View>
          <View style={styles.flexRow} wrap={false}>
            {renderItemCard(items[1], { flex: 1 })}
            {renderItemCard(items[2], { flex: 1 })}
          </View>
        </View>
      );
    }

    if (count === 4) {
      return (
        <View style={styles.gridWrapper} wrap={false}>
          <View style={styles.flexRow} wrap={false}>
            {renderItemCard(items[0], { flex: 1 })}
            {renderItemCard(items[1], { flex: 1 })}
          </View>
          <View style={styles.flexRow} wrap={false}>
            {renderItemCard(items[2], { flex: 1 })}
            {renderItemCard(items[3], { flex: 1 })}
          </View>
        </View>
      );
    }

    if (count === 5) {
      return (
        <View style={styles.gridWrapper}>
          <View style={styles.flexRow}>{renderItemCard(items[0], { flex: 1 })}</View>
          <View style={styles.flexRow}>
            {renderItemCard(items[1], { flex: 1 })}
            {renderItemCard(items[2], { flex: 1 })}
          </View>
          <View style={styles.flexRow}>
            {renderItemCard(items[3], { flex: 1 })}
            {renderItemCard(items[4], { flex: 1 })}
          </View>
        </View>
      );
    }
    
    if (count === 6) {
      return (
        <View style={styles.gridWrapper}>
          <View style={styles.flexRow}>{renderItemCard(items[0], { flex: 1 })}{renderItemCard(items[1], { flex: 1 })}</View>
          <View style={styles.flexRow}>{renderItemCard(items[2], { flex: 1 })}{renderItemCard(items[3], { flex: 1 })}</View>
          <View style={styles.flexRow}>{renderItemCard(items[4], { flex: 1 })}{renderItemCard(items[5], { flex: 1 })}</View>
        </View>
      );
    }

    if (count === 7) {
      return (
        <View style={styles.gridWrapper}>
          <View style={styles.flexRow}>{renderItemCard(items[0], { flex: 1 })}</View>
          <View style={styles.flexRow}>{renderItemCard(items[1], { flex: 1 })}{renderItemCard(items[2], { flex: 1 })}</View>
          <View style={styles.flexRow}>{renderItemCard(items[3], { flex: 1 })}{renderItemCard(items[4], { flex: 1 })}</View>
          <View style={styles.flexRow}>{renderItemCard(items[5], { flex: 1 })}{renderItemCard(items[6], { flex: 1 })}</View>
        </View>
      );
    }

    // Default 8+ items (just dump them in rows of 2)
    const rows = [];
    for (let i = 0; i < count; i += 2) {
      rows.push(
        <View key={i} style={styles.flexRow}>
          {renderItemCard(items[i], { flex: 1 })}
          {i + 1 < count ? renderItemCard(items[i + 1], { flex: 1 }) : <View style={{ flex: 1 }} />}
        </View>
      );
    }
    return <View style={styles.gridWrapper}>{rows}</View>;
  };

  return (
    <Document>
      {/* Front Cover */}
      {config.frontCover && (
        <Page size="A4" style={styles.coverPage}>
          <PdfImage src={resolvePdfImage(config.frontCover)} style={styles.coverImage} />
          <View style={styles.coverOverlay}>
            <Text style={styles.coverTitle}>{catalog.name || 'Catalog'}</Text>
            <Text style={styles.coverSubtitle}>Confidential Line Sheet</Text>
          </View>
        </Page>
      )}

      {/* Interleaved Products and Inserts */}
      {pages.map((page, pageIdx) => {
        if (page.type === 'INSERT') {
          return (
            <Page key={`page-${pageIdx}`} size="A4" style={styles.coverPage}>
              <PdfImage src={page.image} style={styles.coverImage} />
            </Page>
          );
        }

        return (
          <Page key={`page-${pageIdx}`} size="A4" style={styles.page}>
            <View style={styles.header} fixed>
              <View style={styles.brandBox}>
                <Text style={styles.brandName}>ASHOK JEWELS</Text>
                <Text style={styles.catalogName}>{catalog.name || 'Catalog'}</Text>
              </View>
              <View style={styles.confidentialBadge}>
                 <Text style={styles.confidentialText}>Confidential / B2B</Text>
              </View>
            </View>

            {renderBentoGrid(page.items)}
            
            <View style={styles.footer} fixed>
              <Text style={styles.footerText}>Ashok Jewels Wholesale Partner Portal</Text>
              <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `PAGE ${pageNumber} / ${totalPages}`} />
            </View>
          </Page>
        );
      })}

      {/* Back Cover */}
      {config.backCover && (
        <Page size="A4" style={styles.coverPage}>
          <PdfImage src={resolvePdfImage(config.backCover)} style={styles.coverImage} />
        </Page>
      )}
    </Document>
  );
};
