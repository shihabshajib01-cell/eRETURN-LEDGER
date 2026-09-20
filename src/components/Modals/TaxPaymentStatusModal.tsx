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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-[1px] sm:p-5">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tax-payment-status-modal-title"
        className="flex h-full w-full flex-col overflow-hidden bg-white shadow-[0_28px_80px_rgba(15,23,42,0.34)] sm:h-[88vh] sm:max-w-[930px] sm:rounded-[20px] sm:border sm:border-white/70"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="tax-payment-status-modal-title"
              className="truncate text-lg font-bold tracking-tight text-[#172033] sm:text-xl"
            >
              {isBn ? 'কর পরিশোধের অবস্থা' : 'Tax Payment Status'}
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#6B778A] sm:text-sm">
              {isBn
                ? 'বর্তমান লেজারের সব কর, AIT এবং সমন্বয় একসাথে পর্যালোচনা করুন।'
                : 'Review all current Ledger tax, AIT and adjustments together.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
            className="ml-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D9E2EA] bg-[#F8FAFC] text-[#5F6B7A] transition-colors hover:bg-white hover:text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="mx-auto w-full p-4 sm:p-5">
            <TaxPaymentStatusPage
              lang={lang}
              onBack={onClose}
              onGoToEReturn={onGoToEReturn}
              showHeader={false}
              showTotalRow={false}
              showSidebar={false}
            />
          </div>
        </div>

        <footer className="shrink-0 border-t border-[#DCE5EC] bg-white px-5 py-3.5 shadow-[0_-8px_24px_rgba(15,23,42,0.04)] sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#172033]">
                {isBn ? 'মোট' : 'Total'}
              </p>
              <p className="mt-0.5 truncate text-xs text-[#6B778A]">
                {isBn ? 'বর্তমান লেজারের সব পরিমাণ' : 'All amounts currently recorded in this Ledger'}
              </p>
            </div>

            <strong className="whitespace-nowrap text-xl font-bold tabular-nums text-[#0B6FA4] sm:text-2xl">
              {formatLedgerNumber(runtime.total)}
            </strong>
          </div>
        </footer>
      </div>
    </div>
  );
};
