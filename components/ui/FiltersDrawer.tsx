'use client';

import React, { useState, useEffect } from 'react';

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterGroup = {
  id: string;
  title: string;
  options?: FilterOption[];
};

interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filtersConfig: FilterGroup[];
  onApply?: (selected: Record<string, string[]>) => void;
}

export const FiltersDrawer: React.FC<FiltersDrawerProps> = ({ isOpen, onClose, filtersConfig, onApply }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Small delay to allow initial render before starting transition
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 400); // Wait for transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const toggleOption = (groupId: string, value: string) => {
    setSelectedFilters(prev => {
      const groupSelections = prev[groupId] || [];
      const isSelected = groupSelections.includes(value);
      
      return {
        ...prev,
        [groupId]: isSelected 
          ? groupSelections.filter(v => v !== value)
          : [...groupSelections, value]
      };
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleDone = () => {
    if (onApply) onApply(selectedFilters);
    onClose();
  };

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-[120] pointer-events-none">
      {/* Drawer Overlay (Invisible backdrop to allow click-outside) */}
      <div 
        className="absolute inset-0 pointer-events-auto"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className={`absolute top-0 right-0 h-full w-[350px] bg-[var(--bg-surface)] border-l border-[var(--border-color)] flex flex-col pointer-events-auto shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_50px_rgba(0,0,0,0.7)] transition-transform duration-400`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isVisible ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
           <h2 className="text-sm font-bold text-[var(--text-main)]">Filters</h2>
           <button onClick={onClose} className="text-[var(--text-muted)] hover:text-red-500 transition-colors">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
           {filtersConfig.map(group => {
              const isExpanded = !!expandedGroups[group.id];
              const selectionsCount = (selectedFilters[group.id] || []).length;

              return (
                <div key={group.id} className="mb-1">
                   <button 
                     onClick={() => toggleGroup(group.id)}
                     className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[var(--text-muted)]/5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                   >
                      <div className="flex items-center gap-2">
                        {group.title}
                        {selectionsCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-[var(--brand-primary)] text-black text-[10px] font-bold flex items-center justify-center">
                            {selectionsCount}
                          </span>
                        )}
                      </div>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[var(--brand-primary)]' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                   </button>

                   {/* Accordion Content */}
                   <div 
                     className={`overflow-hidden transition-all duration-300 ease-in-out px-3`}
                     style={{ 
                       maxHeight: isExpanded ? '500px' : '0px', 
                       opacity: isExpanded ? 1 : 0 
                     }}
                   >
                     <div className="py-2 space-y-3">
                       {group.options && group.options.length > 0 ? (
                         group.options.map(option => {
                           const isChecked = (selectedFilters[group.id] || []).includes(option.value);
                           return (
                             <label 
                               key={option.value} 
                               className="flex items-center gap-3 cursor-pointer group/option"
                             >
                               <div className="relative flex items-center justify-center">
                                 <input 
                                   type="checkbox" 
                                   className="peer sr-only"
                                   checked={isChecked}
                                   onChange={() => toggleOption(group.id, option.value)}
                                 />
                                 <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${isChecked ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)]' : 'border-[var(--border-color)] group-hover/option:border-[var(--brand-primary)] bg-transparent'}`}>
                                   <svg className={`w-3 h-3 text-black transition-opacity duration-200 ${isChecked ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                   </svg>
                                 </div>
                               </div>
                               <span className={`text-sm transition-colors duration-200 ${isChecked ? 'text-[var(--brand-primary)] font-medium' : 'text-[var(--text-main)] group-hover/option:text-[var(--brand-primary)]'}`}>
                                 {option.label}
                               </span>
                             </label>
                           );
                         })
                       ) : (
                         <div className="text-xs text-[var(--text-muted)] italic py-1">No options available</div>
                       )}
                     </div>
                   </div>
                </div>
              );
           })}
        </div>

        <div className="p-5 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface)]">
           <button 
             onClick={handleClearAll}
             className="px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-none text-xs font-bold tracking-wide"
           >
             Clear all Filters
           </button>
           <button 
             onClick={handleDone}
             className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 active:scale-[0.98] transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold tracking-wide"
           >
             Done
           </button>
        </div>
      </div>
    </div>
  );
};
