import React, { useState } from 'react';
import { Check, Edit2, Plus, Trash2, X } from 'lucide-react';
import { Language } from '../types';

type SalaryRow = {
  id: number;
  authority: string;
  documentType: string;
  reference: string;
  date: string;
  amount: string;
  claimed: string;
};

const initialRows: SalaryRow[] = [
  { id: 1, authority: 'test', documentType: 'Certificate', reference: '123456', date: '04-09-2026', amount: '10,000', claimed: '1,000' },
  { id: 2, authority: 'test 2', documentType: 'Challan', reference: '2526-0003286477', date: '07-08-2025', amount: '32,73,823', claimed: '32,73,823' },
  { id: 3, authority: 'test 3', documentType: 'Challan', reference: '2526-0003264262', date: '06-08-2025', amount: '1,37,700', claimed: '1,37,700' },
  { id: 4, authority: 'test 4', documentType: 'Challan', reference: '2526-0003336839', date: '06-08-2025', amount: '3,529', claimed: '3,529' },
  { id: 5, authority: 'test 5', documentType: 'Certificate', reference: '11223344', date: '04-09-2026', amount: '2,20,022', claimed: '2,20,022' },
];

const emptyForm = {
  authority: '',
  documentType: '',
  reference: '',
  date: '',
  amount: '',
  claimed: '',
};

type FormState = typeof emptyForm;

type Column = {
  key: keyof FormState;
  label: string;
  numeric?: boolean;
};

const columns: Column[] = [
  { key: 'authority', label: 'Depositing Authority' },
  { key: 'documentType', label: 'Payment Document Type' },
  { key: 'reference', label: 'Challan/ Certificate Reference No.' },
  { key: 'date', label: 'Challan/ Certificate Date' },
  { key: 'amount', label: 'Challan/ Certificate Amount', numeric: true },
  { key: 'claimed', label: 'Claimed Amount', numeric: true },
];

export const SalaryOtherLeanPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [rows, setRows] = useState<SalaryRow[]>(initialRows);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<SalaryRow | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setAdding(true);
  };

  const cancelAdd = () => {
    setAdding(false);
    setForm(emptyForm);
  };

  const saveAdd = () => {
    setRows((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((row) => row.id)) + 1,
        ...form,
      },
    ]);
    setAdding(false);
    setForm(emptyForm);
  };

  const openEdit = (row: SalaryRow) => {
    setAdding(false);
    setEditing(row);
    setForm({
      authority: row.authority,
      documentType: row.documentType,
      reference: row.reference,
      date: row.date,
      amount: row.amount,
      claimed: row.claimed,
    });
  };

  const saveEdit = () => {
    if (!editing) return;
    setRows((current) => current.map((row) => (row.id === editing.id ? { ...row, ...form } : row)));
    setEditing(null);
    setForm(emptyForm);
  };

  const removeRow = (id: number) => {
    const confirmed = window.confirm(isBn ? 'এই রেকর্ডটি মুছে ফেলবেন?' : 'Delete this record?');
    if (confirmed) setRows((current) => current.filter((row) => row.id !== id));
  };

  return (
    <section className="w-full space-y-4" aria-labelledby="salary-other-title">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 id="salary-other-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
            {isBn ? 'বেতন (অন্যান্য)' : 'Salary (Others)'}
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-[#5F6B7A]">
            {isBn ? 'বেতন [ ধারা-৮৬ ]' : 'Salary [ Section-86 ]'}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-5">
          <div className="text-left sm:text-right">
            <p className="text-xs font-medium text-[#5F6B7A]">{isBn ? 'মোট দাবিকৃত পরিমাণ' : 'Total Claimed Amount'}</p>
            <p className="mt-0.5 text-xl font-bold text-[#0B6FA4]">৳ 36,36,074</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-medium text-[#5F6B7A]">Count</p>
            <p className="mt-0.5 text-xl font-bold text-[#172033]">{rows.length}</p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            disabled={adding}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-semibold">SL</th>
                {columns.map((column) => (
                  <th
                    scope="col"
                    key={column.key}
                    className={`px-4 py-3 font-semibold ${column.numeric ? 'text-right' : 'text-left'}`}
                  >
                    {column.label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                  <td className="px-4 py-3">{row.authority}</td>
                  <td className="px-4 py-3">{row.documentType}</td>
                  <td className="px-4 py-3">{row.reference}</td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3 text-right font-medium">{row.amount}</td>
                  <td className="px-4 py-3 text-right font-medium">{row.claimed}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        aria-label="Edit"
                        title="Edit"
                        className="rounded-md p-2 text-[#0B6FA4] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        aria-label="Delete"
                        title="Delete"
                        className="rounded-md p-2 text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {adding && (
                <tr className="bg-[#F5FAFD] align-top">
                  <td className="px-4 py-3 font-semibold text-[#0B6FA4]">New</td>
                  {columns.map((column, index) => (
                    <td key={column.key} className="px-2 py-2.5">
                      <input
                        autoFocus={index === 0}
                        value={form[column.key]}
                        onChange={(event) => setForm((current) => ({ ...current, [column.key]: event.target.value }))}
                        onKeyDown={(event) => {
                          if (event.key === 'Escape') cancelAdd();
                          if (event.key === 'Enter') saveAdd();
                        }}
                        aria-label={column.label}
                        placeholder={column.label}
                        className={`w-full min-w-[140px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm text-[#172033] shadow-sm focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20 ${column.numeric ? 'text-right' : 'text-left'}`}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={saveAdd} aria-label="Save" title="Save" className="rounded-md bg-emerald-600 p-2 text-white hover:bg-emerald-700">
                        <Check className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={cancelAdd} aria-label="Cancel" title="Cancel" className="rounded-md border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-50">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="salary-edit-title" className="flex max-h-[88vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 id="salary-edit-title" className="font-bold text-[#172033]">Edit</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto p-5 md:grid-cols-2">
              {columns.map((column) => (
                <div key={column.key}>
                  <label className="mb-1.5 block text-sm font-semibold text-[#172033]">{column.label}</label>
                  <input
                    value={form[column.key]}
                    onChange={(event) => setForm((current) => ({ ...current, [column.key]: event.target.value }))}
                    className={`w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20 ${column.numeric ? 'text-right' : ''}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
              <button type="button" onClick={saveEdit} className="rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
