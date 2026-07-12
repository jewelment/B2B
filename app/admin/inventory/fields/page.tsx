'use client';

import React, { useEffect, useState } from 'react';

// --- SVGs ---
const IconPlus = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const IconTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

// --- Types ---
interface CustomField {
  id: string;
  name: string;
  dataType: string;
  isMandatory: boolean;
}

export default function ProductFieldsManager() {
  // Component State
  const [fields, setFields] = useState<CustomField[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [dataType, setDataType] = useState('TEXT');
  const [isMandatory, setIsMandatory] = useState(false);

  // 1. Fetch live data on mount
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await fetch('/api/admin/products/fields');
        const data = await res.json();
        if (data.success) {
          setFields(data.fields);
        }
      } catch (error) {
        console.error('Failed to load fields:', error);
      }
    };
    fetchFields();
  }, []);

  // 2. Handle POST request
  const handleSaveField = async () => {
    if (!fieldName) return;
    
    try {
      const res = await fetch('/api/admin/products/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fieldName, dataType, isMandatory })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setFields([...fields, data.field]);
        setIsAdding(false);
        setFieldName('');
        setDataType('TEXT');
        setIsMandatory(false);
      } else {
        alert(data.error || 'Failed to save field');
      }
    } catch (error) {
      alert('Network error saving field.');
    }
  };

  // 3. Handle DELETE request
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom attribute?')) return;

    try {
      const res = await fetch(`/api/admin/products/fields/${id}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      
      if (data.success) {
        setFields(fields.filter(f => f.id !== id));
      } else {
        alert(data.error || 'Failed to delete field');
      }
    } catch (error) {
      alert('Network error deleting field.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-8">
      <div className="max-w-[1000px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-normal tracking-tight text-[var(--text-main)]">Custom Attributes</h1>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1 font-bold">Dynamic Schema Engine</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--text-main)] text-[var(--bg-base)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <IconPlus /> Add New Field
          </button>
        </div>

        {/* Add Field Form (Toggleable) */}
        {isAdding && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] mb-4">Create Attribute</h3>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1 uppercase tracking-wide">Field Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Diamond Clarity" 
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="w-full md:w-48">
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1 uppercase tracking-wide">Data Type</label>
                <select 
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  <option value="TEXT">Text / String</option>
                  <option value="NUMBER">Number / Float</option>
                  <option value="BOOLEAN">Yes / No (Boolean)</option>
                </select>
              </div>
              <div className="w-full md:w-32 flex items-center h-10 mb-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-main)]">
                  <input 
                    type="checkbox" 
                    checked={isMandatory}
                    onChange={(e) => setIsMandatory(e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--border-color)] text-emerald-500 cursor-pointer"
                  />
                  Required
                </label>
              </div>
              <button 
                onClick={handleSaveField}
                disabled={!fieldName}
                className="w-full md:w-auto px-6 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Field
              </button>
            </div>
          </div>
        )}

        {/* Data Grid */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                <th className="py-4 px-6 text-xs font-bold tracking-wider uppercase text-[var(--text-main)] w-1/3">Field Name</th>
                <th className="py-4 px-6 text-xs font-bold tracking-wider uppercase text-[var(--text-main)] w-1/4">Data Type</th>
                <th className="py-4 px-6 text-xs font-bold tracking-wider uppercase text-[var(--text-main)] w-1/4 text-center">Required</th>
                <th className="py-4 px-6 text-xs font-bold tracking-wider uppercase text-[var(--text-main)] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {fields.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-[var(--text-muted)]">No custom attributes defined yet.</td>
                </tr>
              ) : (
                fields.map((field) => (
                  <tr key={field.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-[var(--text-main)]">{field.name}</td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md text-[var(--text-muted)]">
                        {field.dataType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {field.isMandatory ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-600 dark:text-amber-400">Yes</span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-slate-500/10 border border-slate-500/20 rounded-md text-[var(--text-muted)]">No</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleDelete(field.id)}
                        className="p-2 inline-flex rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete Field"
                      >
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}