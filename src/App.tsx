import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Language, AssessmentYear, PendingActionItem } from './types';
import { TRANSLATIONS } from './data/translations';
import { ALL_TAX_CATEGORIES } from './data/mockTaxData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { CategoryProgress } from './components/CategoryProgress';
import { PendingActions } from './components/PendingActions';
import { RecentActivities } from './components/RecentActivities';
import { QuickActions } from './components/QuickActions';
import { InfoBanner } from './components/InfoBanner';
import { Footer } from './components/Footer';
import { CategoryWorkspace } from './components/CategoryWorkspace';
import { SalaryIbasLeanPage } from './components/SalaryIbasLeanPage';
import { SalaryOtherLeanPage } from './components/SalaryOtherLeanPage';
import { BankFiLeanPage } from './components/BankFiLeanPage';
import { TaxPaymentStatusPage } from './components/TaxPaymentStatusPage';
import { AllCategoriesModal } from './components/Modals/AllCategoriesModal';
import { HowItWorksModal } from './components/Modals/HowItWorksModal';
import { GoToEReturnModal } from './components/Modals/GoToEReturnModal';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [assessmentYear, setAssessmentYear] = useState<AssessmentYear>('2026-2027');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [allCategoriesModalOpen, setAllCategoriesModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [goToEReturnModalOpen, setGoToEReturnModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];
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

  const handlePendingAction = (_action: PendingActionItem) => {
    showToast(
      lang === 'bn'
        ? 'বাস্তব ব্যাকএন্ড অ্যাকশন সংযুক্ত না হওয়া পর্যন্ত কোনো কর কার্যক্রম সিমুলেট করা হচ্ছে না।'
        : 'No tax action is simulated until the real backend action is connected.'
    );
  };

  const renderDashboard = () => (
    <>
      <section id="dashboard-header" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0B6FA4] mb-0.5">{t.welcomeTo}</div>
          <h1 className="text-2xl lg:text-[28px] font-bold text-[#172033] tracking-tight">{t.eReturnLedger}</h1>
          <p className="text-sm text-[#5F6B7A] mt-1 max-w-2xl leading-relaxed">
            {lang === 'bn'
              ? `কর বর্ষ ${assessmentYear} এর জন্য আপনার কর পরিশোধ এবং ক্রেডিটসমূহ পর্যালোচনা, দাবি ও সমন্বয় করুন।`
              : `Review, claim and reconcile your tax payments and credits for Assessment Year ${assessmentYear}.`}
          </p>
        </div>
        <div className="px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#5F6B7A] self-start sm:self-auto">
          <span className="font-semibold text-[#172033]">{t.assessmentYear}: </span>{assessmentYear}
        </div>
      </section>

      <section aria-label="Tax summary cards">
        <SummaryCards
          lang={lang}
          onCardClick={(cardId) => {
            if (cardId === 'total-credit') setCurrentTab('payment-status');
            else setAllCategoriesModalOpen(true);
          }}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <CategoryProgress lang={lang} onViewAllCategories={() => setAllCategoriesModalOpen(true)} />
        </div>
        <div className="xl:col-span-7">
          <PendingActions lang={lang} onActionClick={handlePendingAction} onViewAllPending={() => setAllCategoriesModalOpen(true)} />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <RecentActivities lang={lang} onViewAllActivities={() => setAllCategoriesModalOpen(true)} />
        </div>
        <div className="xl:col-span-5">
          <QuickActions
            lang={lang}
            onSyncIncome={() => setCurrentTab('bank-fi')}
            onAddPayment={() => setCurrentTab('tax-paid-return')}
            onViewStatus={() => setCurrentTab('payment-status')}
            onGoToEReturn={() => setGoToEReturnModalOpen(true)}
          />
        </div>
      </section>

      <section>
        <InfoBanner lang={lang} onOpenHowItWorks={() => setHowItWorksModalOpen(true)} />
      </section>

      <Footer
        lang={lang}
        onOpenPrivacy={() => showToast(lang === 'bn' ? 'গোপনীয়তা নীতি এখনো সংযুক্ত নয়।' : 'Privacy Policy is not connected yet.')}
        onOpenTerms={() => showToast(lang === 'bn' ? 'ব্যবহারের শর্তাবলী এখনো সংযুক্ত নয়।' : 'Terms of Use are not connected yet.')}
        onOpenContact={() => showToast(lang === 'bn' ? 'ট্যাক্স হেল্পলাইন: ১৬৫৫৫' : 'Taxes Helpline: 16555')}
      />
    </>
  );

  return (
    <div className={`min-h-screen flex bg-[#F6F8FA] text-[#172033] ${lang === 'bn' ? "font-['Noto_Sans_Bengali',sans-serif]" : "font-['Noto_Sans',sans-serif]"}`}>
      <Sidebar currentTab={currentTab} onSelectTab={handleSelectTab} lang={lang} isOpen={navigationOpen} onClose={() => setNavigationOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          lang={lang}
          onToggleLang={setLang}
          assessmentYear={assessmentYear}
          onChangeAssessmentYear={(year) => setAssessmentYear(year)}
          onOpenNavigation={() => setNavigationOpen(true)}
        />

        <main id="main-content" className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-7 max-w-[1600px] w-full mx-auto space-y-6">
          {currentTab === 'dashboard' && renderDashboard()}

          {currentCategory?.id === 'salary-ibas' && <SalaryIbasLeanPage lang={lang} />}
          {currentCategory?.id === 'salary-other' && <SalaryOtherLeanPage lang={lang} />}
          {currentCategory?.id === 'bank-fi' && <BankFiLeanPage lang={lang} onUnavailableAction={showToast} />}

          {currentCategory && !['salary-ibas', 'salary-other', 'bank-fi'].includes(currentCategory.id) && (
            <CategoryWorkspace
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

      <AllCategoriesModal isOpen={allCategoriesModalOpen} onClose={() => setAllCategoriesModalOpen(false)} lang={lang} />
      <HowItWorksModal isOpen={howItWorksModalOpen} onClose={() => setHowItWorksModalOpen(false)} lang={lang} />
      <GoToEReturnModal isOpen={goToEReturnModalOpen} onClose={() => setGoToEReturnModalOpen(false)} lang={lang} />

      {toastMessage && (
        <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-[60] bg-[#172033] text-white px-4 py-3 rounded-lg shadow-xl text-xs flex items-start gap-2.5 max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
