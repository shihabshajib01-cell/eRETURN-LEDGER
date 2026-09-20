import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Language, AssessmentYear } from './types';
import { ALL_TAX_CATEGORIES } from './data/mockTaxData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CategoryWorkspace } from './components/CategoryWorkspace';
import { SalaryIbasLeanPage } from './components/SalaryIbasLeanPage';
import { SalaryOtherLeanPage } from './components/SalaryOtherLeanPage';
import { BankFiLeanPage } from './components/BankFiLeanPage';
import { DividendLeanPage } from './components/DividendLeanPage';
import { TaxPaymentStatusPage } from './components/TaxPaymentStatusPage';
import { HowItWorksModal } from './components/Modals/HowItWorksModal';
import { GoToEReturnModal } from './components/Modals/GoToEReturnModal';
import { LedgerHomePage } from './components/LedgerHomePage';
import { ServicePaymentLeanPage } from './components/ServicePaymentLeanPage';
import { EnvironmentalSurchargeLeanPage } from './components/EnvironmentalSurchargeLeanPage';
import { SanchayapatraPage } from './components/SanchayapatraPage';
import { LedgerRuntimeProvider } from './state/LedgerRuntimeContext';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const assessmentYear: AssessmentYear = '2026-2027';
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [goToEReturnModalOpen, setGoToEReturnModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentCategory = ALL_TAX_CATEGORIES.find((category) => category.id === currentTab);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectTab = (tab: string) => {
    if (tab === 'goto-ereturn') {
      setGoToEReturnModalOpen(true);
      return;
    }
    if (tab === 'user-guide' || tab === 'faqs') {
      setHowItWorksModalOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  return (
    <LedgerRuntimeProvider>
    <div className={`min-h-screen flex bg-[#F6F8FA] text-[#172033] ${lang === 'bn' ? "font-['Noto_Sans_Bengali',sans-serif]" : "font-['Noto_Sans',sans-serif]"}`}>
      <Sidebar currentTab={currentTab} onSelectTab={handleSelectTab} lang={lang} isOpen={navigationOpen} onClose={() => setNavigationOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          lang={lang}
          onToggleLang={setLang}
          assessmentYear={assessmentYear}
          onOpenNavigation={() => setNavigationOpen(true)}
        />

        <main id="main-content" className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-7 max-w-[1600px] w-full mx-auto space-y-6">
          {currentTab === 'dashboard' && <LedgerHomePage lang={lang} />}

          {currentCategory?.id === 'salary-ibas' && <SalaryIbasLeanPage lang={lang} onUnavailableAction={showToast} />}
          {currentCategory?.id === 'salary-other' && <SalaryOtherLeanPage lang={lang} />}
          {currentCategory?.id === 'bank-fi' && <BankFiLeanPage lang={lang} onUnavailableAction={showToast} />}
          {currentCategory?.id === 'dividend' && <DividendLeanPage lang={lang} onUnavailableAction={showToast} />}
          {currentCategory?.id === 'service-payment' && <ServicePaymentLeanPage lang={lang} onUnavailableAction={showToast} />}
          {currentCategory?.id === 'environmental-surcharge' && <EnvironmentalSurchargeLeanPage lang={lang} onUnavailableAction={showToast} />}
          {currentCategory?.id === 'sanchayapatra' && <SanchayapatraPage lang={lang} onUnavailableAction={showToast} />}

          {currentCategory && !['salary-ibas', 'salary-other', 'bank-fi', 'dividend', 'service-payment', 'environmental-surcharge', 'sanchayapatra'].includes(currentCategory.id) && (
            <CategoryWorkspace
              key={currentCategory.id}
              categoryId={currentCategory.id}
              lang={lang}
              onBack={() => setCurrentTab('dashboard')}
              onUnavailableAction={showToast}
            />
          )}

          {currentTab === 'payment-status' && (
            <TaxPaymentStatusPage
              lang={lang}
              onBack={() => setCurrentTab('dashboard')}
              onGoToEReturn={() => setGoToEReturnModalOpen(true)}
            />
          )}
        </main>
      </div>

      <HowItWorksModal isOpen={howItWorksModalOpen} onClose={() => setHowItWorksModalOpen(false)} lang={lang} />
      <GoToEReturnModal isOpen={goToEReturnModalOpen} onClose={() => setGoToEReturnModalOpen(false)} lang={lang} />

      {toastMessage && (
        <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-[60] bg-[#172033] text-white px-4 py-3 rounded-lg shadow-xl text-xs flex items-start gap-2.5 max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{toastMessage}</span>
        </div>
      )}
    </div>
    </LedgerRuntimeProvider>
  );
}
