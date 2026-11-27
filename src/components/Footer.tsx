import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              সহ
            </div>
            <span className="text-white font-bold text-lg">Sohojkor · সহজকর</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Experimental citizen portal UI. Not an official tax service; no real payments or submissions.
          </p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Tax Services</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/all-taxes" className="hover:text-white transition-colors">Tax with Return (0111)</Link></li>
            <li><Link to="/all-taxes" className="hover:text-white transition-colors">Advance Income Tax (AIT)</Link></li>
            <li><Link to="/travel-tax" className="hover:text-white transition-colors">Travel Tax (Air/Land/Water)</Link></li>
            <li><Link to="/gift-tax" className="hover:text-white transition-colors">Gift Tax (দানকর)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Citizen Portals</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Taxpayer Dashboard</Link></li>
            <li><Link to="/beneficiaries" className="hover:text-white transition-colors">Beneficiary Management</Link></li>
            <li><Link to="/history" className="hover:text-white transition-colors">Payment History & Receipts</Link></li>
            <li><Link to="/drafts" className="hover:text-white transition-colors">Saved Payment Drafts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Support & Guidance</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/support" className="hover:text-white transition-colors">Help & FAQ</Link></li>
            <li><Link to="/corrections" className="hover:text-white transition-colors">Challan Correction Request</Link></li>
            <li><span className="text-teal-400 font-medium">NBR National Helpline: 16555</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Sohojkor Cleanroom Citizen Portal. Prototype for engineering review.</p>
        <div className="flex gap-4">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span>·</span>
          <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          <span>·</span>
          <span className="hover:text-slate-400 cursor-pointer">Security Statement</span>
        </div>
      </div>
    </footer>
  );
};
