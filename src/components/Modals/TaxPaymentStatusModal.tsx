import React from 'react';
import { X } from 'lucide-react';
import { Language } from '../../types';
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-0 sm:p-4">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tax-payment-status-modal-title"
        className="flex h-full w-full flex-col overflow-hidden bg-[#F6F8FA] shadow-2xl sm:h-[92vh] sm:max-w-[1480px] sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p
              id="tax-payment-status-modal-title"
              className="truncate text-sm font-bold text-[#172033]"
            >
              {lang === 'bn' ? 'কর পরিশোধের অবস্থা' : 'Tax Payment Status'}
            </p>
            <p className="mt-0.5 hidden text-xs text-[#6B778A] sm:block">
              {lang === 'bn'
                ? 'বর্তমান লেজারের সব কর, AIT এবং সমন্বয় একসাথে পর্যালোচনা করুন।'
                : 'Review all current Ledger tax, AIT and adjustments together.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            className="ml-4 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#5F6B7A] hover:bg-slate-50 hover:text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
            <TaxPaymentStatusPage
              lang={lang}
              onBack={onClose}
              onGoToEReturn={onGoToEReturn}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
