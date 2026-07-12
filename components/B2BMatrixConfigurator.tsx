'use client';

import React, { useState, useEffect } from 'react';

interface B2BMatrixProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (matrixData: any) => void;
}

export default function B2BMatrixConfigurator({ product, isOpen, onClose, onAddToCart }: B2BMatrixProps) {
  // Configurable axes based on jewelry type
  const purities = ['14K YG', '14K RG', '14K WG', '18K YG', '18K RG', '18K WG'];
  const sizes = ['6', '7', '8', '9', '10', '11', '12'];
  
  // 2D State Matrix to hold quantities
  const [matrix, setMatrix] = useState<{ [key: string]: number }>({});
  const [totalUnits, setTotalUnits] = useState(0);
  const [estimatedTotal, setEstimatedTotal] = useState(0);

  // Reset matrix when product changes
  useEffect(() => {
    setMatrix({});
    setTotalUnits(0);
    setEstimatedTotal(0);
  }, [product]);

  // Handle cell input changes
  const handleQuantityChange = (purity: string, size: string, value: string) => {
    const qty = parseInt(value, 10) || 0;
    const key = `${purity}-${size}`;
    
    const newMatrix = { ...matrix, [key]: qty };
    if (qty === 0) delete newMatrix[key];
    
    setMatrix(newMatrix);
    
    // Calculate Totals (Assuming base price, eventually this hits the live Pricing Engine)
    const newTotalUnits = Object.values(newMatrix).reduce((a, b) => a + b, 0);
    setTotalUnits(newTotalUnits);
    setEstimatedTotal(newTotalUnits * (product?.price || 0));
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="flex justify-between items-start p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-6">
            {product.primaryImage ? (
              <img src={product.primaryImage} alt="Thumbnail" className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shadow-sm">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">No Media</span>
              </div>
            )}
            <div>
              <p className="text-xs font-mono font-bold text-gray-400 mb-1">{product.designCode}</p>
              <h2 className="text-2xl font-light text-gray-900">{product.title}</h2>
              <p className="text-sm font-bold text-[#4e080f] mt-1">Base: ₹{(product.price || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800 transition-colors bg-white rounded-full border border-gray-200 shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* 2D MATRIX GRID */}
        <div className="p-8 overflow-auto bg-white flex-1">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr>
                <th className="p-3 text-[10px] uppercase tracking-widest text-gray-400 font-bold bg-gray-50 rounded-tl-xl border border-white">
                  Purity \ Size
                </th>
                {sizes.map(size => (
                  <th key={size} className="p-3 text-center text-xs font-bold text-gray-700 bg-gray-50 border border-white">
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {purities.map(purity => (
                <tr key={purity}>
                  <td className="p-3 text-xs font-bold text-gray-700 bg-gray-50/30 border border-white whitespace-nowrap">
                    {purity}
                  </td>
                  {sizes.map(size => (
                    <td key={size} className="p-1 border border-gray-50">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={matrix[`${purity}-${size}`] || ''}
                        onChange={(e) => handleQuantityChange(purity, size, e.target.value)}
                        className="w-full text-center py-2 text-sm font-medium bg-gray-50/50 focus:bg-white border-transparent focus:border-[#4e080f] focus:ring-1 focus:ring-[#4e080f] rounded-lg transition-all placeholder:text-gray-300"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL FOOTER & CART ACTIONS */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Units</p>
              <p className="text-xl font-medium text-gray-900">{totalUnits}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Est. Subtotal</p>
              <p className="text-xl font-medium text-gray-900">₹{estimatedTotal.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <button 
            onClick={() => onAddToCart({ product, matrix, totalUnits, estimatedTotal })}
            disabled={totalUnits === 0}
            className="py-3 px-8 bg-[#4e080f] text-white shadow-md shadow-[#4e080f]/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
          >
            Add To PO Pipeline
          </button>
        </div>

      </div>
    </div>
  );
}