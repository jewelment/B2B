'use client';

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';

interface LuxuryTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function LuxuryTable<TData, TValue>({
  columns,
  data,
}: LuxuryTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Custom high-inertia cubic-bezier for luxury feel
  const premiumEasing = [0.16, 1, 0.3, 1] as const;

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.04, // 40ms stagger
        duration: 0.6,
        ease: premiumEasing,
      },
    }),
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] relative">
      
      {/* Monochromatic Noise Overlay to simulate texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIiAvPgo8L3N2Zz4=')]"></div>

      <table className="w-full text-left border-collapse relative z-10">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="bg-black/10 dark:bg-white/5 border-b border-[var(--border-color)]"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]/50">
          <AnimatePresence>
            {table.getRowModel().rows.map((row, index) => (
              <motion.tr
                key={row.id}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={rowVariants}
                whileHover={{
                  scale: 1.01,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.05)',
                  zIndex: 20,
                  transition: { duration: 0.3, ease: premiumEasing }
                }}
                whileTap={{
                  scale: 0.99,
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)',
                  transition: { duration: 0.1 }
                }}
                className="group relative bg-transparent cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm font-medium text-[var(--text-main)] whitespace-nowrap"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
