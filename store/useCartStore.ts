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
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (designCode: string) => void;
  updateQuantity: (designCode: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const qtyToAdd = item.quantity || 1;
        const existingItem = state.items.find((i) => i.designCode === item.designCode && i.size === item.size);
        if (existingItem) {
          // If it already exists in the PO, just increment the quantity
          return {
            items: state.items.map((i) => 
              (i.designCode === item.designCode && i.size === item.size) ? { ...i, quantity: i.quantity + qtyToAdd } : i
            )
          };
        }
        // Otherwise, add it as a new line item
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

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'ashok-jewels-po-storage', // Saves the cart in local storage so it survives page refreshes
    }
  )
);