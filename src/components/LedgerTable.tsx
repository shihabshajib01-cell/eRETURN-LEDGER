import React, { useMemo, useState } from 'react';
import { MoreHorizontal, Pencil, Search, Trash2 } from 'lucide-react';
import { LedgerColumn, LedgerRecord } from '../data/ledgerRecords';

interface LedgerTableProps {
  columns: LedgerColumn[];
  records: LedgerRecord[];
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: (record: LedgerRecord) => void;
  onDelete?: (record: LedgerRecord) => void;
  searchPlaceholder?: string;
}

const formatValue = (value: string | number, column: LedgerColumn) => {
  if (column.type === 'amount' && typeof value === 'number') return value.toLocaleString('en-IN');
  return String(value ?? '—');
};

export const LedgerTable: React.FC<LedgerTableProps> = ({
  columns,
  records,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  searchPlaceholder = 'Search records...',
}) => {
  const [query, setQuery] = useState('');
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return records;
    return records.filter((record) =>
      columns.some((column) => String(record[column.key] ?? '').toLowerCase().includes(term))
    );
  }, [columns, query, records]);

  const hasActions = Boolean(canEdit || canDelete);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#0B6FA4] focus:ring-2 focus:ring-[#0B6FA4]/15"
          />
        </div>
        <p className="text-xs font-semibold text-slate-500">{filtered.length} of {records.length} records</p>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-[#E8F1F5] text-slate-700">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold">SL.</th>
              {columns.map((column) => (
                <th key={column.key} className={`whitespace-nowrap px-4 py-3 text-xs font-bold ${column.align === 'right' ? 'text-right' : 'text-left'}`}>
                  {column.label}
                </th>
              ))}
              {hasActions && <th className="w-20 px-4 py-3 text-right text-xs font-bold">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((record, index) => (
              <tr key={record.id} className="bg-white transition hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 text-slate-700 ${column.align === 'right' ? 'text-right tabular-nums' : 'text-left'}`}>
                    {column.type === 'status' ? (
                      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {formatValue(record[column.key], column)}
                      </span>
                    ) : (
                      <span className="whitespace-nowrap">{formatValue(record[column.key], column)}</span>
                    )}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        aria-label="Record actions"
                        onClick={() => setMenuFor(menuFor === record.id ? null : record.id)}
                        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {menuFor === record.id && (
                        <div className="absolute right-0 z-20 mt-1 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                          {canEdit && (
                            <button type="button" onClick={() => { setMenuFor(null); onEdit?.(record); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50">
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </button>
                          )}
                          {canDelete && (
                            <button type="button" onClick={() => { setMenuFor(null); onDelete?.(record); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50">
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length + (hasActions ? 2 : 1)} className="px-6 py-12 text-center text-sm text-slate-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {filtered.map((record, index) => (
          <article key={record.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-[#0B6FA4]">Record {index + 1}</span>
              {hasActions && (
                <div className="flex items-center gap-1">
                  {canEdit && (
                    <button type="button" aria-label="Edit record" onClick={() => onEdit?.(record)} className="rounded-md p-2 text-[#0B6FA4] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30">
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button type="button" aria-label="Delete record" onClick={() => onDelete?.(record)} className="rounded-md p-2 text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <dl className="grid grid-cols-1 gap-3">
              {columns.map((column) => (
                <div key={column.key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3">
                  <dt className="text-xs font-semibold text-slate-500">{column.label}</dt>
                  <dd className={`text-sm font-medium text-slate-800 break-words ${column.align === 'right' ? 'text-right tabular-nums' : 'text-right'}`}>
                    {column.type === 'status' ? (
                      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{formatValue(record[column.key], column)}</span>
                    ) : formatValue(record[column.key], column)}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
        {filtered.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">No matching records found.</div>}
      </div>
    </div>
  );
};
