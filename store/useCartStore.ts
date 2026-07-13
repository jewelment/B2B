import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  designCode: string;
  title: string;
  metal: string;
  purity: string;
  estimatedPrice: number;
  quantity: number;
  size?: string;
  imageUrl?: string;
}

interface CartStore {
  // Linear item cart for legacy checkout
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (designCode: string) => void;
  updateQuantity: (designCode: string, quantity: number) => void;
  
  // 2D Matrix Store for B2B Wholesale Allocation
  selectedItems: string[]; // SKUs queued for allocation
  matrixQuantities: Record<string, Record<string, number>>; // { "AJ-001": { "18K_6": 5 } }
  
  toggleSelection: (sku: string) => void;
  addSelection: (sku: string) => void;
  removeSelection: (sku: string) => void;
  updateMatrixQty: (sku: string, variantKey: string, qty: number) => void;
  
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      selectedItems: [],
      matrixQuantities: {},
      
      // Linear Cart Operations
      addItem: (item) => set((state) => {
        const qtyToAdd = item.quantity || 1;
        const existingItem = state.items.find((i) => i.designCode === item.designCode && i.size === item.size);
        if (existingItem) {
          return {
            items: state.items.map((i) => 
              (i.designCode === item.designCode && i.size === item.size) ? { ...i, quantity: i.quantity + qtyToAdd } : i
            )
          };
        }
        return { items: [...state.items, { ...item, quantity: qtyToAdd }] };
      }),

      removeItem: (designCode) => set((state) => ({ 
        items: state.items.filter((i) => i.designCode !== designCode) 
      })),

      updateQuantity: (designCode, quantity) => set((state) => ({
        items: state.items.map((i) => 
          i.designCode === designCode ? { ...i, quantity: Math.max(1, quantity) } : i
        )
      })),

      // Global Matrix Operations
      toggleSelection: (sku) => set((state) => {
        if (state.selectedItems.includes(sku)) {
          // Remove it and its matrix data
          const newSelected = state.selectedItems.filter(s => s !== sku);
          const newMatrix = { ...state.matrixQuantities };
          delete newMatrix[sku];
          return { selectedItems: newSelected, matrixQuantities: newMatrix };
        } else {
          // Add it
          return { selectedItems: [...state.selectedItems, sku] };
        }
      }),

      addSelection: (sku) => set((state) => {
        if (!state.selectedItems.includes(sku)) {
          return { selectedItems: [...state.selectedItems, sku] };
        }
        return state;
      }),

      removeSelection: (sku) => set((state) => {
        const newSelected = state.selectedItems.filter(s => s !== sku);
        const newMatrix = { ...state.matrixQuantities };
        delete newMatrix[sku];
        return { selectedItems: newSelected, matrixQuantities: newMatrix };
      }),

      updateMatrixQty: (sku, variantKey, qty) => set((state) => {
        const currentVariants = state.matrixQuantities[sku] || {};
        return {
          matrixQuantities: {
            ...state.matrixQuantities,
            [sku]: {
              ...currentVariants,
              [variantKey]: Math.max(0, qty)
            }
          }
        };
      }),

      // Clear all
      clearCart: () => set({ items: [], selectedItems: [], matrixQuantities: {} }),
    }),
    {
      name: 'ashok-jewels-po-storage', // Saves the cart in local storage so it survives page refreshes
    }
  )
);