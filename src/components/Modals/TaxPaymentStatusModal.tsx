import React from 'react';
import { X } from 'lucide-react';
import { Language } from '../../types';
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap';
import { useLedgerRuntime } from '../../state/LedgerRuntimeContext';
import { formatLedgerNumber } from '../../utils/money';
import { TaxPaymentStatusPage } from '../TaxPaymentStatusPage';

interface TaxPaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onGoToEReturn: () => void;
}

export const TaxPaymentStatusModal: React.FC<TaxPaymentStatusModalProps> = ({
  isOpen,
  onClose,
  lang,
  onGoToEReturn,
}) => {
  const dialogRef = useDialogFocusTrap(isOpen, onClose);
  const runtime = useLedgerRuntime();
  const isBn = lang === 'bn';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-0 sm:p-5">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tax-payment-status-modal-title"
        className="flex h-full w-full flex-col overflow-hidden bg-white shadow-xl sm:h-auto sm:max-h-[86vh] sm:max-w-[780px] sm:rounded-xl sm:border sm:border-slate-200"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-slate-50/80 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="tax-payment-status-modal-title"
              className="truncate text-base font-bold text-[#172033] sm:text-lg"
            >
              {isBn ? 'কর পরিশোধের অবস্থা' : 'Tax Payment Status'}
            </h2>
            <p className="mt-0.5 text-xs leading-5 text-[#5F6B7A]">
              {isBn
                ? 'বর্তমান লেজারের সব কর, AIT এবং সমন্বয় একসাথে পর্যালোচনা করুন।'
                : 'Review all current Ledger tax, AIT and adjustments together.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-white">
          <TaxPaymentStatusPage
            lang={lang}
            onBack={onClose}
            onGoToEReturn={onGoToEReturn}
            showHeader={false}
            showTotalRow={false}
            showSidebar={false}
            embedded
          />
        </div>

        <footer className="shrink-0 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-baseline justify-between gap-4 sm:justify-start sm:gap-5">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#172033]">
                {isBn ? 'মোট' : 'Total'}
              </p>
              <p className="mt-0.5 text-xs text-[#6B778A]">
                {isBn ? 'বর্তমান লেজারের সব পরিমাণ' : 'All amounts currently recorded in this Ledger'}
              </p>
            </div>
            <strong className="shrink-0 whitespace-nowrap text-xl font-bold tabular-nums text-[#0B6FA4]">
              {formatLedgerNumber(runtime.total)}
            </strong>
          </div>
        </footer>
      </div>
    </div>
  );
};
