import React from 'react';

const join = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(' ');

export const LedgerTableFrame: React.FC<React.HTMLAttributes<HTMLElement>> = ({ className, children, ...props }) => (
  <section {...props} className={join('overflow-hidden rounded-xl border border-[#E2E8F0] bg-white', className)}>
    {children}
  </section>
);

export const LedgerTableViewport: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div {...props} className={join('overflow-x-auto', className)}>{children}</div>
);

export const LedgerTable = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, children, ...props }, ref) => (
    <table ref={ref} {...props} className={join('ledger-responsive-table ledger-table-system w-full text-sm', className)}>
      {children}
    </table>
  )
);
LedgerTable.displayName = 'LedgerTable';

export const LedgerTableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => (
  <thead {...props} className={join('ledger-table-head', className)}>{children}</thead>
);

export const LedgerTableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => (
  <tbody {...props} className={join('ledger-table-body', className)}>{children}</tbody>
);

export const LedgerTableHeaderCell: React.FC<React.ThHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'center' | 'right' }> = ({
  className, align = 'left', children, ...props
}) => (
  <th {...props} className={join(align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left', className)}>
    {children}
  </th>
);

export const LedgerTableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement> & {
  label?: string;
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
  strong?: boolean;
}> = ({ className, label, align = 'left', numeric = false, strong = false, children, ...props }) => (
  <td
    {...props}
    data-label={label}
    className={join(
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
      numeric && 'tabular-nums',
      strong && 'font-semibold text-[#172033]',
      className
    )}
  >
    {children}
  </td>
);

export const LedgerTableToolbar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div {...props} className={join(
    'flex flex-col gap-4 border-b border-[#E2E8F0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5',
    className
  )}>
    {children}
  </div>
);

export const LedgerTableSummaryGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div {...props} className={join('flex items-center gap-5', className)}>{children}</div>
);

export const LedgerTableSummaryItem: React.FC<{ label: React.ReactNode; value: React.ReactNode; accent?: boolean }> = ({
  label, value, accent = false
}) => (
  <div>
    <p className="text-xs font-medium text-[#6B778A]">{label}</p>
    <p className={join('mt-0.5 text-xl font-bold tabular-nums', accent ? 'text-[#0B6FA4]' : 'text-[#172033]')}>{value}</p>
  </div>
);
