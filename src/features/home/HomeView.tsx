import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, FileText, Plane, Gift, ArrowRight, 
  CheckCircle2, Building2, Zap, Users, Lock 
} from 'lucide-react';
import { useApp } from '../../shared/AppContext';

export const HomeView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-600 text-teal-200 text-xs font-semibold tracking-wide">
              <ShieldCheck size={14} /> Sohojkor experimental UI
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Sohojkor · সহজকর <br />
              <span className="text-teal-300 font-normal text-3xl sm:text-4xl">Smart National Tax Portal</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Explore the proposed citizen tax filing, challan, travel tax and gift tax interfaces.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate('/all-taxes')}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                {t('payTaxNow')} <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/travel-tax')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                {t('calculateTravelTax')} <Plane size={18} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs uppercase tracking-wider text-teal-200 font-semibold">Quick Taxpayer Status</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono">SAMPLE DATA</span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Taxpayer Name:</span>
                  <strong className="text-white">{user.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">12-Digit TIN:</span>
                  <strong className="text-teal-300 font-mono">{user.tin}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Tax Circle / Zone:</span>
                  <span className="text-white text-right">{user.circle}, {user.zone}</span>
                </div>
              </div>
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="w-full py-3 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs tracking-wide uppercase transition-colors"
              >
                {isAuthenticated ? 'Open Full Dashboard' : 'Sign In with TIN'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Tax Service Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/all-taxes')}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-6 group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">All Tax Payments</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              File Annual Income Tax with Return (0111), Advance Income Tax (AIT), Source Tax, and property transfer taxes.
            </p>
            <span className="text-teal-700 dark:text-teal-400 text-sm font-semibold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Proceed to Filing <ArrowRight size={16} />
            </span>
          </div>

          <div 
            onClick={() => navigate('/travel-tax')}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-6 group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <Plane size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{t('travelTax')}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Calculate and pay departure travel taxes for international air, land, or water routes with instant passport validation.
            </p>
            <span className="text-teal-700 dark:text-teal-400 text-sm font-semibold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Calculate Travel Tax <ArrowRight size={16} />
            </span>
          </div>

          <div 
            onClick={() => navigate('/gift-tax')}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-6 group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <Gift size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{t('giftTax')}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              File structured Gift Tax with Donor and Donee TIN mapping, relationship tagging, and automated tax calculations.
            </p>
            <span className="text-teal-700 dark:text-teal-400 text-sm font-semibold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              File Gift Tax <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </section>

      {/* Why Sohojkor 2x3 Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('whySohojkor')}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Illustrative citizen tax workflows for design and engineering review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">01</div>
            <h4 className="font-bold text-base">{t('instantChallan')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('instantChallanDesc')}</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">02</div>
            <h4 className="font-bold text-base">{t('secureGovtIntegration')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('secureGovtIntegrationDesc')}</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">03</div>
            <h4 className="font-bold text-base">{t('multiChannelPayment')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('multiChannelPaymentDesc')}</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">04</div>
            <h4 className="font-bold text-base">{t('multiBeneficiarySupport')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('multiBeneficiarySupportDesc')}</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">05</div>
            <h4 className="font-bold text-base">{t('offlineDrafts')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('offlineDraftsDesc')}</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">06</div>
            <h4 className="font-bold text-base">{t('auditTrail')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('auditTrailDesc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
