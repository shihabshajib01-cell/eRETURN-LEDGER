import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Language, AssessmentYear } from './types';
import { TRANSLATIONS } from './data/translations';
import { getLedgerModule } from './data/mockTaxData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { CategoryProgress } from './components/CategoryProgress';
import { PendingActions } from './components/PendingActions';
import { RecentActivities } from './components/RecentActivities';
import { QuickActions } from './components/QuickActions';
import { InfoBanner } from './components/InfoBanner';
import { Footer } from './components/Footer';
import { LedgerModulePage } from './components/LedgerModulePage';
import { TaxPaymentStatusPage } from './components/TaxPaymentStatusPage';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [assessmentYear, setAssessmentYear] = useState<AssessmentYear>('2026-2027');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
  }, [lang]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const navigate = (target: string) => {
    if (target === 'goto-ereturn') {
      setToastMessage(t.handoffNotice);
      return;
    }
    setCurrentTab(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSummaryCardClick = (cardId: string) => {
    if (cardId === 'source-tax') navigate('source-salary-ibas');
    else if (cardId === 'ait') navigate('ait-154');
    else if (cardId === 'other-credits') navigate('other-173');
    else navigate('payment-status');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B6FA4]">{t.welcomeTo}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#172033]">{t.eReturnLedger}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5F6B7A]">
            {t.dashboardSubtitle} {t.assessmentYear}: {assessmentYear}.
          </p>
        </div>
      </section>

      <section aria-label="Ledger financial summary">
        <SummaryCards lang={lang} onCardClick={handleSummaryCardClick} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <CategoryProgress lang={lang} onNavigate={navigate} />
        </div>
        <div className="xl:col-span-7">
          <PendingActions lang={lang} onNavigate={navigate} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <RecentActivities lang={lang} />
        </div>
        <div className="xl:col-span-5">
          <QuickActions lang={lang} onNavigate={navigate} />
        </div>
      </section>

      <InfoBanner lang={lang} />
    </div>
  );

  const module = getLedgerModule(currentTab);

  return (
    <div className={`min-h-screen bg-[#F6F8FA] text-[#172033] ${lang === 'bn' ? "font-['Noto_Sans_Bengali',sans-serif]" : "font-['Noto_Sans',sans-serif]"}`}>
      <div className="flex min-h-screen">
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label={t.closeNavigation}
          />
        )}

        <Sidebar
          currentTab={currentTab}
          onSelectTab={navigate}
          lang={lang}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <Header
            lang={lang}
            onToggleLang={setLang}
            assessmentYear={assessmentYear}
            onChangeAssessmentYear={(year) => {
              setAssessmentYear(year);
              setToastMessage(`${t.assessmentYear}: ${year}`);
            }}
            onOpenNavigation={() => setSidebarOpen(true)}
          />

          <main id="main-content" className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {currentTab === 'dashboard' && renderDashboard()}

            {currentTab === 'payment-status' && (
              <TaxPaymentStatusPage
                lang={lang}
                assessmentYear={assessmentYear}
                onNavigate={navigate}
                onGoToEReturn={() => setToastMessage(t.handoffNotice)}
              />
            )}

            {module && (
              <LedgerModulePage
                module={module}
                lang={lang}
                assessmentYear={assessmentYear}
                onNavigate={navigate}
              />
            )}

            <Footer lang={lang} />
          </main>
        </div>
      </div>

      {toastMessage && (
        <div
          className="fixed bottom-5 right-5 z-[70] flex max-w-md items-start gap-2 rounded-lg bg-[#172033] px-4 py-3 text-xs text-white shadow-xl"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
          <span className="leading-relaxed">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
