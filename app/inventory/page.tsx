'use client';

import React, { useState } from 'react';

// --- TYPESCRIPT INTERFACES ---
interface CostComponent {
  id: string;
  type: string;
  details: string;
  weight: number | null;
  rate: number;
  finalCost: number;
}

interface InventoryItem {
  id: string;
  designCode: string;
  title: string;
  metalPurity: string;
  grossWeight: number;
  pureWeight: number;
  igiCertNumber: string;
  estimatedPrice: number;
  components: CostComponent[];
}

// --- ICONS ---
const IconSearch = () => <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const IconChevronDown = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>;
const IconChevronUp = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>;
const IconFilter = () => <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>;

export default function InventoryDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Your exact JSON payload loaded into state
  const [inventory] = useState<InventoryItem[]>([
    {
      id: "cmqrr19fc0000cyxkfc0p3r1b",
      designCode: "AJ-RNG-2041",
      title: "Diamond Floral Ring",
      metalPurity: "18KT",
      grossWeight: 4.5,
      pureWeight: 3.37,
      igiCertNumber: "IGI-123456789",
      estimatedPrice: 45000,
      components: [
        { id: "cmqrr19fe0001cyxk3uptxomv", type: "Metal", details: "18KT Rose Gold", weight: null, rate: 5362, finalCost: 24129 },
        { id: "cmqrr19fe0002cyxkiowrhmi7", type: "Diamond", details: "VVS-EF (0.25ct)", weight: null, rate: 65000, finalCost: 16250 },
        { id: "cmqrr19fe0003cyxkikdjt11c", type: "Making Charges", details: "Standard Labor", weight: null, rate: 800, finalCost: 3600 }
      ]
    }
  ]);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 p-6 md:p-10 font-sans pb-24">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header & KPIs */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-light tracking-wide text-[#4e080f]">Master Inventory</h1>
            <p className="text-sm text-gray-500 mt-2">Manage stock, view exact cost breakups, and track IGI certifications.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 text-right">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total SKUs</p>
              <p className="text-xl font-mono text-gray-800">{inventory.length}</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 text-right">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Est. Value</p>
              <p className="text-xl font-mono text-[#dfae61]">{formatCurrency(inventory.reduce((acc, item) => acc + item.estimatedPrice, 0))}</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-t-2xl border border-gray-200 border-b-0 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch />
            </div>
            <input 
              type="text" 
              placeholder="Search by Design Code or IGI..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#dfae61]/50 transition-all"
            />
          </div>
          <button className="flex items-center px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-100 transition-colors w-full sm:w-auto">
            <IconFilter /> Filters
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-b-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Design Code</th>
                  <th className="px-6 py-4 font-semibold">Product Title</th>
                  <th className="px-6 py-4 font-semibold">Specs</th>
                  <th className="px-6 py-4 font-semibold">IGI Cert</th>
                  <th className="px-6 py-4 font-semibold text-right">Est. MRP</th>
                  <th className="px-6 py-4 font-semibold text-center">Cost Breakup</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.map((item) => (
                  <React.Fragment key={item.id}>
                    {/* Main Row */}
                    <tr className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-[#4e080f] font-bold">{item.designCode}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{item.title}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded w-max">{item.metalPurity}</span>
                          <span className="text-[11px] text-gray-500">GW: {item.grossWeight}g | NW: {item.pureWeight}g</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{item.igiCertNumber}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-gray-900">{formatCurrency(item.estimatedPrice)}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleRow(item.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-[#dfae61]/10 text-[#c26d11] text-[10px] font-bold uppercase tracking-wider rounded hover:bg-[#dfae61]/20 transition-colors"
                        >
                          View Details {expandedRow === item.id ? <IconChevronUp /> : <IconChevronDown />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Cost Breakup Row */}
                    {expandedRow === item.id && (
                      <tr className="bg-gray-50/80 border-b border-gray-200">
                        <td colSpan={6} className="px-0 py-0">
                          <div className="px-6 py-6 animate-in slide-in-from-top-2 duration-200">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">B2B Cost Breakup Analysis</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {item.components.map((comp) => (
                                <div key={comp.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                                  <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                                      comp.type === 'Metal' ? 'bg-amber-100 text-amber-800' :
                                      comp.type === 'Diamond' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {comp.type}
                                    </span>
                                    <span className="font-mono text-sm font-semibold text-gray-900">{formatCurrency(comp.finalCost)}</span>
                                  </div>
                                  <p className="text-sm font-medium text-gray-800">{comp.details}</p>
                                  <p className="text-[11px] text-gray-500 mt-1">Rate: {formatCurrency(comp.rate)} {comp.type === 'Metal' ? '/g' : comp.type === 'Diamond' ? '/ct' : ''}</p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex justify-end">
                               <p className="text-xs text-gray-500 italic">Data synced via live ERP feed.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}