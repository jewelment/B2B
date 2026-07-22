# ROADMAP_LASER

## Technical Specifications & Pseudo-Code

This document serves as the detailed technical documentation and pseudo-code roadmap for the B2B CRM Architecture (Phase 2), specifically focusing on the Orders Module algorithms and system integrations.

### 1. Unified Master Orders Algorithm
**Objective**: Combine varying streams of order data (E-Com, Store POS, B2B wholesale) into a single master loop.
```typescript
function aggregateMasterOrders(ecomOrders, storeOrders, wholesalePOs):
    let masterList = []
    
    // Inject source tag
    for order in ecomOrders:
        order.fulfillmentSource = 'ECOM'
        masterList.push(order)
        
    for order in storeOrders:
        order.fulfillmentSource = 'STORE'
        masterList.push(order)

    // Apply global sorting (Newest first)
    masterList.sort((a, b) => b.timestamp - a.timestamp)
    return masterList

function renderMasterTable(data, activeTab):
    if activeTab != 'All':
        data = filterBySourceOrStatus(data, activeTab)
    
    return TableUI(data)
```

### 2. PO Ledger Multi-Parameter Filtering Engine
**Objective**: Enable real-time cascading filters across amounts, strings, and enum states for the Wholesale PO Ledger.
```typescript
function applyCascadingFilters(pos, criteria):
    return pos.filter(po => {
        // 1. Array inclusion (Status)
        if (criteria.status && po.status !== criteria.status) return false
        
        // 2. Fuzzy text searching (Reference / Client)
        if (criteria.searchQuery):
            let matchRef = fuzzyMatch(po.poNumber, criteria.searchQuery)
            let matchClient = fuzzyMatch(po.client, criteria.searchQuery)
            if (!matchRef && !matchClient) return false
            
        // 3. Enum Matching (Client Tier)
        if (criteria.clientTier && po.clientType !== criteria.clientTier) return false
        
        // 4. Threshold Calculus (Amounts)
        if (criteria.minAmount && po.totalAmount <= criteria.minAmount) return false
        
        // 5. Temporal Matching
        if (criteria.dateLimit):
            if (!isWithinRange(po.date, criteria.dateLimit)) return false
            
        return true
    }).sort((a, b) => executeSort(a, b, criteria.sortMode))

function executeSort(a, b, mode):
    match mode:
        case 'Amount_DESC': return b.amount - a.amount
        case 'Amount_ASC': return a.amount - b.amount
        case 'Date_ASC': return a.dateTimestamp - b.dateTimestamp
        default: return b.dateTimestamp - a.dateTimestamp // Date_DESC
```

### 3. Payment Link Conditional Render State
**Objective**: Dynamically guard payment processing functions based on order mutation phases.
```typescript
function renderPaymentActions(order):
    if order.paymentStatus === 'Processing':
        return Button(label="Send Payment Link", action=triggerRazorpayLink)
    else:
        return null // Action hidden for completed or cancelled orders
```

### 4. Layout Architecture (Sticky Pagination)
**Objective**: Ensure the grid fills 100% viewport height and anchors the pagination interface dynamically.
```css
/* Container Logic */
.page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
.table-container {
    display: flex;
    flex-direction: column;
    flex: 1; 
    min-height: 500px;
}
.table-overflow {
    flex: 1;
    overflow: auto;
}
.pagination-footer {
    position: sticky;
    bottom: 0;
    z-index: 10;
    background-color: var(--bg-surface);
}
```

### 5. Architectural Next Steps (Node.js & Prisma)
- **Database Interfacing**: Transition the mocked `mockPOs` array to `prisma.purchaseOrder.findMany()`.
- **API Construction**: Expose `GET /api/orders/pos` with query parameters mapped to the `applyCascadingFilters` pseudo-code logic.
- **Client Cache**: Implement SWR/React Query for real-time order updates without triggering hard reloads.
