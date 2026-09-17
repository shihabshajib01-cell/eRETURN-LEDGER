import React, { useState } from 'react';
import { 
  FileCheck, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { Language, AssessmentYear, PendingActionItem, ActivityItem } from './types';
import { TRANSLATIONS } from './data/translations';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { CategoryProgress } from './components/CategoryProgress';
import { PendingActions } from './components/PendingActions';
import { RecentActivities } from './components/RecentActivities';
import { QuickActions } from './components/QuickActions';
import { InfoBanner } from './components/InfoBanner';
import { Footer } from './components/Footer';

// Modals & Drawers
import { SyncIncomeModal } from './components/Modals/SyncIncomeModal';
import { AddTaxPaymentDrawer } from './components/Modals/AddTaxPaymentDrawer';
import { ClaimChallanDrawer } from './components/Modals/ClaimChallanDrawer';
import { ReviewSurchargeDrawer } from './components/Modals/ReviewSurchargeDrawer';
import { AllCategoriesModal } from './components/Modals/AllCategoriesModal';
import { TaxPaymentStatusModal } from './components/Modals/TaxPaymentStatusModal';
import { HowItWorksModal } from './components/Modals/HowItWorksModal';
import { GoToEReturnModal } from './components/Modals/GoToEReturnModal';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [assessmentYear, setAssessmentYear] = useState<AssessmentYear>('2026-2027');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Modal & Drawer states
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [addPaymentDrawerOpen, setAddPaymentDrawerOpen] = useState(false);
  const [claimChallanDrawerOpen, setClaimChallanDrawerOpen] = useState(false);
  const [reviewSurchargeDrawerOpen, setReviewSurchargeDrawerOpen] = useState(false);
  const [allCategoriesModalOpen, setAllCategoriesModalOpen] = useState(false);
  const [paymentStatusModalOpen, setPaymentStatusModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [goToEReturnModalOpen, setGoToEReturnModalOpen] = useState(false);

  // Success notifications toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handlePendingAction = (action: PendingActionItem) => {
    if (action.actionType === 'sync') {
      setSyncModalOpen(true);
    } else if (action.actionType === 'claim') {
      setClaimChallanDrawerOpen(true);
    } else if (action.actionType === 'review') {
      setReviewSurchargeDrawerOpen(true);
    }
  };

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'payment-status') {
      setPaymentStatusModalOpen(true);
    } else if (tab === 'goto-ereturn') {
      setGoToEReturnModalOpen(true);
    } else if (tab === 'user-guide' || tab === 'faqs') {
      setHowItWorksModalOpen(true);
    } else if (tab.startsWith('source-') || tab.startsWith('ait-') || tab.startsWith('other-')) {
      setAllCategoriesModalOpen(true);
    }
  };

  return (
    <div className={`min-h-screen flex bg-[#F6F8FA] text-[#172033] ${lang === 'bn' ? "font-['Noto_Sans_Bengali',sans-serif]" : "font-['Noto_Sans',sans-serif]"}`}>
      {/* A. Global Left Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={handleSelectTab} 
        lang={lang} 
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* B. Top Header */}
        <Header
          lang={lang}
          onToggleLang={(newLang) => setLang(newLang)}
          assessmentYear={assessmentYear}
          onChangeAssessmentYear={(yr) => {
            setAssessmentYear(yr);
            showToast(`Assessment Year changed to ${yr}`);
          }}
        />

        {/* C. Main Content Area */}
        <main 
          id="main-content-dashboard"
          className="flex-1 px-6 lg:px-8 py-7 max-w-[1600px] w-full mx-auto space-y-6"
        >
          {/* Dashboard Title Header (Data-First, Calm & Institutional) */}
          <section id="dashboard-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#0B6FA4] mb-0.5">
                {t.welcomeTo}
              </div>
              <h1 className="text-2xl lg:text-[28px] font-bold text-[#172033] tracking-tight">
                {t.eReturnLedger}
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6B7A] mt-1 max-w-2xl leading-relaxed">
                {lang === 'bn' 
                  ? `কর বর্ষ ${assessmentYear} এর জন্য আপনার কর পরিশোধ এবং ক্রেডিটসমূহ পর্যালোচনা, দাবি ও সমন্বয় করুন।`
                  : `Review, claim and reconcile your tax payments and credits for Assessment Year ${assessmentYear}.`}
              </p>
            </div>

            {/* Reconciliation State Badge */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs self-start sm:self-auto">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="text-xs">
                <span className="font-semibold text-slate-800">Ledger Status: </span>
                <span className="text-emerald-700 font-bold">Synchronized</span>
              </div>
            </div>
          </section>

          {/* 6. PRIMARY SUMMARY CARDS (4 in one row) */}
          <section id="section-summary-cards" aria-label="Tax summary cards">
            <SummaryCards 
              lang={lang} 
              onCardClick={(cardId) => {
                if (cardId === 'total-credit') {
                  setPaymentStatusModalOpen(true);
                } else {
                  setAllCategoriesModalOpen(true);
                }
              }} 
            />
          </section>

          {/* 7 & 8. MIDDLE ROW: Category Progress & Pending Actions */}
          <section id="section-progress-and-actions" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Progress (5 cols) */}
            <div className="lg:col-span-5">
              <CategoryProgress 
                lang={lang} 
                onViewAllCategories={() => setAllCategoriesModalOpen(true)} 
              />
            </div>

            {/* Pending Actions (7 cols) */}
            <div className="lg:col-span-7">
              <PendingActions 
                lang={lang} 
                onActionClick={handlePendingAction}
                onViewAllPending={() => setAllCategoriesModalOpen(true)}
              />
            </div>
          </section>

          {/* 9 & 10. BOTTOM ROW: Recent Activities & Quick Actions */}
          <section id="section-activities-and-quick-actions" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Activities Table (7 cols) */}
            <div className="lg:col-span-7">
              <RecentActivities 
                lang={lang} 
                onViewAllActivities={() => setAllCategoriesModalOpen(true)}
              />
            </div>

            {/* Quick Actions (5 cols) */}
            <div className="lg:col-span-5">
              <QuickActions
                lang={lang}
                onSyncIncome={() => setSyncModalOpen(true)}
                onAddPayment={() => setAddPaymentDrawerOpen(true)}
                onViewStatus={() => setPaymentStatusModalOpen(true)}
                onGoToEReturn={() => setGoToEReturnModalOpen(true)}
              />
            </div>
          </section>

          {/* 11. IMPORTANT INFORMATION BANNER */}
          <section id="section-info-banner">
            <InfoBanner 
              lang={lang} 
              onOpenHowItWorks={() => setHowItWorksModalOpen(true)} 
            />
          </section>

          {/* 12. D. FOOTER */}
          <Footer 
            lang={lang}
            onOpenPrivacy={() => showToast('Privacy Policy: NBR eReturn data is protected under National Data Governance')}
            onOpenTerms={() => showToast('Terms of Use: Compliant with Bangladesh Income Tax Act 2023')}
            onOpenContact={() => showToast('Helpline 16555 / support@incometax.gov.bd')}
          />
        </main>
      </div>

      {/* Interactive Modals & Drawers */}
      <SyncIncomeModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        onSyncComplete={() => showToast('Dividend Income TDS records successfully synced into Ledger')}
        lang={lang}
      />

      <AddTaxPaymentDrawer
        isOpen={addPaymentDrawerOpen}
        onClose={() => setAddPaymentDrawerOpen(false)}
        onSavePayment={(record) => showToast(`Payment Challan ${record.challanNo} (৳ ${record.amount}) submitted for iBAS++ verification`)}
        lang={lang}
      />

      <ClaimChallanDrawer
        isOpen={claimChallanDrawerOpen}
        onClose={() => setClaimChallanDrawerOpen(false)}
        onClaimSuccess={() => showToast('AIT Challan 154 (৳ 65,365) successfully claimed')}
        lang={lang}
      />

      <ReviewSurchargeDrawer
        isOpen={reviewSurchargeDrawerOpen}
        onClose={() => setReviewSurchargeDrawerOpen(false)}
        onResolve={() => showToast('Environmental Surcharge reconciled with verified A-Challan')}
        lang={lang}
      />

      <AllCategoriesModal
        isOpen={allCategoriesModalOpen}
        onClose={() => setAllCategoriesModalOpen(false)}
        lang={lang}
      />

      <TaxPaymentStatusModal
        isOpen={paymentStatusModalOpen}
        onClose={() => setPaymentStatusModalOpen(false)}
        onGoToEReturn={() => setGoToEReturnModalOpen(true)}
        lang={lang}
      />

      <HowItWorksModal
        isOpen={howItWorksModalOpen}
        onClose={() => setHowItWorksModalOpen(false)}
        lang={lang}
      />

      <GoToEReturnModal
        isOpen={goToEReturnModalOpen}
        onClose={() => setGoToEReturnModalOpen(false)}
        lang={lang}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div 
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#172033] text-white px-4 py-3 rounded-lg shadow-xl text-xs flex items-center gap-2.5 animate-in slide-in-from-bottom-5 border border-slate-700 max-w-md"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
