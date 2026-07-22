'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [activeNote, setActiveNote] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Processing');
  const [activePaymentTab, setActivePaymentTab] = useState('All transactions');
  const paymentTabs = ['All transactions', 'Markets', 'Paid'];

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 min-h-screen">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders/all" className="p-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] hover:bg-[var(--brand-primary)]/10 hover:text-[var(--brand-primary)] transition-colors text-[var(--text-muted)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-main)] uppercase tracking-wider">Order {params.id}</h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
             <input type="text" placeholder="Search / Add Tags" className="w-[200px] bg-black/5 dark:bg-black/20 border border-[var(--border-color)] rounded-full px-4 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Main Content (Left Column) */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
          
          {/* Order Item Card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap gap-8">
              {/* Product Info Block */}
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <span className="text-amber-500 font-bold text-xs uppercase tracking-widest text-center">Gold<br/>24KT</span>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">Gold 24KT Yellow</h3>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Bag Number: <span className="text-[var(--text-main)] font-mono">26GGGCN0000082</span></p>
                  <p className="text-xs text-[var(--text-muted)] mb-1">SKU: <span className="text-[var(--text-main)] font-mono">GCN002300043</span></p>
                  <p className="text-xs text-[var(--text-muted)] mb-2">Brand: PC Jeweller</p>
                  <p className="text-[10px] text-[var(--brand-primary)] font-medium">Item available for Return & Exchange: 7 days</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="flex-1 min-w-[200px] border-l border-[var(--border-color)] pl-8">
                <div className="grid grid-cols-3 gap-y-2 text-xs">
                  <div className="font-semibold text-[var(--text-muted)]">Name</div>
                  <div className="font-semibold text-[var(--text-muted)] text-right">Price</div>
                  <div className="font-semibold text-[var(--text-muted)] text-right">Discount Price</div>
                  
                  <div className="text-[var(--text-main)]">Gold Price</div>
                  <div className="text-[var(--text-main)] text-right">₹1,42,200.00</div>
                  <div className="text-[var(--text-main)] text-right">₹1,42,200.00</div>
                  
                  <div className="text-[var(--text-main)]">Labour Price</div>
                  <div className="text-[var(--text-main)] text-right">₹5,688.00</div>
                  <div className="text-[var(--text-main)] text-right">₹5,119.00</div>

                  <div className="text-[var(--text-main)]">GST (3%)</div>
                  <div className="text-[var(--text-main)] text-right">₹4,436.64</div>
                  <div className="text-[var(--text-main)] text-right">₹4,419.58</div>

                  <div className="font-bold text-[var(--text-main)] pt-2 border-t border-[var(--border-color)] mt-1">Total Price</div>
                  <div className="font-bold text-[var(--text-main)] text-right pt-2 border-t border-[var(--border-color)] mt-1">₹1,52,324.64</div>
                  <div className="font-bold text-[var(--text-main)] text-right pt-2 border-t border-[var(--border-color)] mt-1">₹1,51,738.78</div>
                </div>
              </div>
            </div>

            {/* Meta Tags */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--border-color)]">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Delivery Date</p>
                <p className="text-sm font-semibold text-[var(--text-main)]">24th July, 2026</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Order Source</p>
                <p className="text-sm font-semibold text-[var(--text-main)]">ECOM</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Item Fulfilled</p>
                <p className="text-sm font-semibold text-[var(--text-main)]">01042</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Item Status</p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500">Label Created</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Payment Status</p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-500">Success</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button className="px-6 py-2 rounded-lg border border-[var(--border-color)] text-sm font-medium text-[var(--text-main)] hover:bg-[var(--text-muted)]/10 transition-colors">Action</button>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm flex flex-col items-end">
            <div className="w-[300px] space-y-3 text-sm">
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Subtotal</span>
                <span className="text-[var(--text-main)]">₹2,95,776.00</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>GST (3%)</span>
                <span className="text-[var(--text-main)]">₹8,839.00</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Shipping</span>
                <span className="text-[var(--text-main)]">Free</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Total Discount (10% off on Labour)</span>
                <span className="text-red-500">-₹1,138.00</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)] border-b border-[var(--border-color)] pb-3">
                <span>Vouchers</span>
                <span className="text-[var(--text-main)]">None</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-1">
                <span className="text-[var(--text-main)]">Total</span>
                <span className="text-[var(--text-main)]">₹3,03,478.00</span>
              </div>
            </div>
          </div>

          {/* Payment Block */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                <h3 className="text-lg font-bold text-[var(--text-main)]">Payment</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${paymentStatus === 'Success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'}`}>{paymentStatus}</span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-xs font-bold uppercase tracking-wider text-[var(--text-main)] hover:bg-[var(--text-muted)]/10 transition-colors">Add Transaction</button>
                {paymentStatus === 'Processing' && (
                  <button className="px-4 py-2 rounded-lg border border-[var(--brand-primary)] text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10 transition-colors shadow-sm shimmer-hover">Send Payment Link</button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-[var(--border-color)] mb-6">
              {paymentTabs.map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActivePaymentTab(tab)}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors relative ${activePaymentTab === tab ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                  {tab}
                  {activePaymentTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--brand-primary)] rounded-t-full shadow-[0_0_8px_var(--brand-primary)] animate-in fade-in zoom-in duration-300" />
                  )}
                </button>
              ))}
            </div>

            <span className="inline-block px-3 py-1 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">Transaction 1 of 1</span>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Payment Detail</p>
                <p className="font-bold text-[var(--text-main)]">₹3,03,478.00 <span className="font-normal text-[var(--text-muted)]">Paid via CC</span></p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Payment Timestamp</p>
                <p className="font-medium text-[var(--text-main)]">08 Jul, 2026 at 05:23 PM</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Payment ID</p>
                <p className="font-medium text-[var(--text-main)] font-mono">29456784545</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Payment Description</p>
                <p className="font-medium text-[var(--text-muted)]">N/A</p>
              </div>
            </div>
          </div>

          {/* Timelines */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[var(--border-color)] flex items-center gap-3">
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-lg font-bold text-[var(--text-main)]">Timelines</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Date</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Team Member</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-medium">08/07/2026 at 05:23 pm</td>
                  <td className="px-6 py-4 text-xs text-[var(--text-main)] font-medium">Automated</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[var(--text-main)]">Invoice Sent</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 italic">2 items with linked transaction number 3 has Invoice 5520-001,5520-002 numbers been sent to sanjay bisht</p>
                    <p className="text-[10px] text-[var(--brand-primary)] mt-1 font-medium">Customer Notified</p>
                  </td>
                </tr>
                <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-medium">08/07/2026 at 05:23 pm</td>
                  <td className="px-6 py-4 text-xs text-[var(--text-main)] font-medium">Automated</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[var(--text-main)]">Order Confirmation</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 italic">Order PCJ-0005520 confirmation mail has been sent to sanjay bisht</p>
                    <p className="text-[10px] text-[var(--brand-primary)] mt-1 font-medium">Customer Notified</p>
                  </td>
                </tr>
                <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-medium">08/07/2026 at 05:23 pm</td>
                  <td className="px-6 py-4 text-xs text-[var(--text-main)] font-medium">Automated</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[var(--text-main)]">Payment Success</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 italic">sanjay bisht has been made payment success</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Sidebar (Right Column) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
          
          {/* Notes Input */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[var(--text-main)] mb-4">Notes</h3>
            <textarea 
              value={activeNote}
              onChange={(e) => setActiveNote(e.target.value)}
              placeholder="Write your message here..."
              className="w-full h-24 bg-black/5 dark:bg-black/20 border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors resize-none mb-3 custom-scrollbar"
            />
            <div className="flex justify-end">
               <button className="px-6 py-2 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">Post</button>
            </div>
          </div>

          {/* Notes History */}
          <div className="flex flex-col gap-4 pl-2 border-l-2 border-[var(--border-color)] relative ml-4">
             {/* Note 1 */}
             <div className="relative pl-6">
               <div className="absolute left-[-21px] top-1 w-3 h-3 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--brand-primary)] z-10"></div>
               <p className="text-[10px] text-[var(--text-muted)] mb-1">10/07/2026 at 3:53 pm</p>
               <p className="text-xs font-bold text-[var(--text-main)] mb-1">Vishwa Deepak Tiwari</p>
               <p className="text-sm text-[var(--brand-primary)] font-medium bg-[var(--brand-primary)]/10 p-3 rounded-xl border border-[var(--brand-primary)]/20">Order has been Shipped !!</p>
             </div>
             {/* Note 2 */}
             <div className="relative pl-6">
               <div className="absolute left-[-21px] top-1 w-3 h-3 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border-color)] z-10"></div>
               <p className="text-[10px] text-[var(--text-muted)] mb-1">10/07/2026 at 3:46 pm</p>
               <p className="text-xs font-bold text-[var(--text-main)] mb-1">Vishwa Deepak Tiwari</p>
               <p className="text-xs text-[var(--brand-primary)] font-medium">New Bag Number 26GGGCN0000082 created for the order PCJ-0005520 on item No: GCN002300043</p>
             </div>
             {/* Note 3 */}
             <div className="relative pl-6">
               <div className="absolute left-[-21px] top-1 w-3 h-3 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border-color)] z-10"></div>
               <p className="text-[10px] text-[var(--text-muted)] mb-1">10/07/2026 at 3:46 pm</p>
               <p className="text-xs font-bold text-[var(--text-main)] mb-1">Vishwa Deepak Tiwari</p>
               <p className="text-xs text-[var(--brand-primary)] font-medium">Rs.14220.00 was the Gold Rate while ordering item ID: 5520-2</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
