'use client';

import React, { useState } from 'react';
import { useCampusStore } from '@/lib/store/campus-store';
import { Sparkles, ShieldCheck, RefreshCw, UserCheck, PlayCircle, X, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const DemoBar: React.FC = () => {
  const { activeUser, switchUser, users, resetDemoData, toggleCampusVerification } = useCampusStore();
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setShowResetToast(true);
    setTimeout(() => setShowResetToast(false), 3000);
  };

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-3 sm:px-6 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Demo badge & campus */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3 h-3" />
            HACKATHON DEMO MODE
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300 font-medium">
            🏫 Apex Institute of Technology
          </span>
        </div>

        {/* Center: Switch Accounts */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-slate-400 hidden lg:inline mr-1">Switch Persona:</span>
          
          {/* Aarav (Buyer) */}
          <button
            onClick={() => switchUser('user-aarav')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              activeUser.id === 'user-aarav'
                ? 'bg-emerald-600 text-white font-medium shadow-sm ring-2 ring-emerald-400/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Aarav Sharma: 2nd Year CSE student (Requester/Buyer)"
          >
            <span>👨‍🎓</span>
            <span className="font-medium">Aarav</span>
            <span className="hidden sm:inline text-[10px] opacity-75">(Buyer)</span>
          </button>

          {/* Priya (Seller) */}
          <button
            onClick={() => switchUser('user-priya')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              activeUser.id === 'user-priya'
                ? 'bg-emerald-600 text-white font-medium shadow-sm ring-2 ring-emerald-400/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Priya Patel: 3rd Year CSE student (Seller/Lender)"
          >
            <span>👩‍🎓</span>
            <span className="font-medium">Priya</span>
            <span className="hidden sm:inline text-[10px] opacity-75">(Seller)</span>
          </button>

          {/* Moderator */}
          <button
            onClick={() => switchUser('user-mod')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
              activeUser.id === 'user-mod'
                ? 'bg-purple-600 text-white font-medium shadow-sm ring-2 ring-purple-400/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Prof. K. Ramanathan: Campus Moderator"
          >
            <span>🛡️</span>
            <span className="hidden sm:inline">Mod</span>
          </button>

          {/* Admin */}
          <button
            onClick={() => switchUser('user-admin')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
              activeUser.id === 'user-admin'
                ? 'bg-amber-600 text-white font-medium shadow-sm ring-2 ring-amber-400/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Dr. Sunita Rao: Dean / System Admin"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* Right: Walkthrough Guide & Reset Button */}
        <div className="flex items-center gap-2">
          {/* Toggle verification state for active user */}
          <button
            onClick={() => toggleCampusVerification(activeUser.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
              activeUser.isVerified
                ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                : 'border-red-500/50 text-red-400 bg-red-500/10'
            }`}
            title="Toggle simulated institutional ID verification"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{activeUser.isVerified ? 'Verified' : 'Unverified'}</span>
          </button>

          {/* 2-Min Live Walkthrough Button */}
          <button
            onClick={() => setShowScenarioModal(true)}
            className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-2.5 py-1 rounded shadow-sm"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>2-Min Demo Script</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
            title="Reset listings, requests and ratings to fresh demo state"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Toast */}
      {showResetToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-900 border border-emerald-500 text-emerald-100 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Demo state refreshed to original seed data!</span>
        </div>
      )}

      {/* 2-Min Demo Walkthrough Modal */}
      {showScenarioModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">CampusLoop 2-Minute Judge Walkthrough</h3>
                  <p className="text-xs text-slate-400">Complete end-to-end academic exchange scenario</p>
                </div>
              </div>
              <button
                onClick={() => setShowScenarioModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs sm:text-sm">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-emerald-400">Scene 1: Student Needs Textbook</span>
                <p className="text-slate-300 mt-1">
                  You are <strong>Aarav</strong> (2nd Yr CSE). You need a 4th-semester DBMS book but don’t want to spend ₹900 brand new.
                </p>
                <div className="mt-2 flex gap-2">
                  <Link
                    href="/marketplace?search=dbms"
                    onClick={() => setShowScenarioModal(false)}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-medium"
                  >
                    Open Marketplace with DBMS search <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-emerald-400">Scene 2: Select Listing & Submit Request</span>
                <p className="text-slate-300 mt-1">
                  Click on <strong>Database System Concepts (6th Ed)</strong> by Priya. Click &quot;Request Resource&quot;, choose <strong>Central Library Entrance</strong> and tomorrow 2 PM.
                </p>
                <div className="mt-2">
                  <Link
                    href="/listings/list-dbms-korth"
                    onClick={() => setShowScenarioModal(false)}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-medium"
                  >
                    Go to DBMS Listing Detail <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-emerald-400">Scene 3: Switch to Priya (Owner) & Accept</span>
                <p className="text-slate-300 mt-1">
                  Use the top bar to switch to <strong>Priya (Seller)</strong>. Go to <strong>Requests</strong> or Transaction Tracker. Click <strong>&quot;Accept Request&quot;</strong>. The system atomically locks the resource and generates a safe 6-digit OTP code!
                </p>
                <div className="mt-2">
                  <Link
                    href="/requests"
                    onClick={() => {
                      switchUser('user-priya');
                      setShowScenarioModal(false);
                    }}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-medium"
                  >
                    Switch to Priya & Open Requests <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-emerald-400">Scene 4: Two-Sided Campus Handover & OTP Verification</span>
                <p className="text-slate-300 mt-1">
                  Switch back to <strong>Aarav</strong> to see his 6-digit pickup code. Switch to <strong>Priya</strong> to enter the code and verify in-person exchange.
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-emerald-400">Scene 5: Real Savings & Impact Update</span>
                <p className="text-slate-300 mt-1">
                  Exchange completes! Aarav saved ₹650 (New: ₹900 - Paid: ₹250). Check the <strong>Campus Impact Dashboard</strong> to see live campus-wide metrics dynamically updated.
                </p>
                <div className="mt-2">
                  <Link
                    href="/impact"
                    onClick={() => setShowScenarioModal(false)}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-medium"
                  >
                    View Campus Impact Dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowScenarioModal(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-xl text-xs sm:text-sm"
              >
                Got it, let&apos;s run the demo!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
