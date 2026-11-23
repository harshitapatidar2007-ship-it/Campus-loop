'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  MapPin,
  KeyRound,
  ShieldCheck,
  Recycle,
  ArrowRight,
  CheckCircle2,
  Users,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="bg-slate-50/60 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Campus Circular Economy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            How CampusLoop Works
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            A campus-verified peer-to-peer resource circulation network designed to eliminate student textbook debt and reduce environmental waste.
          </p>
        </div>

        {/* 4 Protocol Steps */}
        <div className="space-y-6">
          {[
            {
              step: '01',
              title: 'Discover or List Academic Gear',
              desc: 'Juniors can search by exact university course code (e.g., CS204 DBMS), branch, semester, or condition. Seniors can post unused books, drafters, and calculators in under 60 seconds with our AI Listing Assistant.',
              icon: BookOpen,
            },
            {
              step: '02',
              title: 'Reserve & Lock Campus Safe Point',
              desc: 'Select a designated university pickup point—such as Central Library Foyer, Main Canteen Plaza, or Department Lobby. The system locks the item into a hold state so no two students can conflict.',
              icon: MapPin,
            },
            {
              step: '03',
              title: 'Two-Sided In-Person Inspection & OTP Code',
              desc: 'Meet on campus. Inspect the book condition, pages, or calculator functionality firsthand. Once satisfied, the requester shares their unique 6-digit one-time handover code with the owner.',
              icon: KeyRound,
            },
            {
              step: '04',
              title: 'Pass Knowledge Forward',
              desc: 'Owner verifies the code. Transaction is finalized instantly, wallet savings are calculated against retail price, and carbon offsets are registered on the campus impact leaderboard.',
              icon: Recycle,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start gap-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xl shrink-0 font-mono">
                  {item.step}
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to test CampusLoop at Apex Institute?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            Try our 2-Minute Demo Scenario from the top bar to experience the complete student-to-student handover workflow.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/marketplace"
              className="bg-white text-emerald-900 font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-colors"
            >
              Browse Campus Listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
