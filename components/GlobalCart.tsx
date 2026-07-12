'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';

export default function GlobalCart() {
  // We use isMounted to prevent Next.js hydration mismatch errors 
  // when reading from local storage on initial load.
  const [isMounted, setIsMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; 

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Don't show the floating cart if it's empty
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom-4">
      <button 
        onClick={() => alert("Cart Drawer Opening Soon!")}
        className="bg-[#4e080f] text-white p-4 rounded-full shadow-[0_8px_30px_rgb(78,8,15,0.3)] hover:bg-[#3a060b] hover:-translate-y-1 transition-all duration-300 relative flex items-center justify-center group"
      >
        {/* Shopping Bag Icon */}
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        
        {/* Badge */}
        <span className="absolute -top-2 -right-2 bg-[#dfae61] text-[#4e080f] text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
          {totalItems}
        </span>
      </button>
    </div>
  );
}