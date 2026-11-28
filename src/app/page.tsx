'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCampusStore } from '@/lib/store/campus-store';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Recycle,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Users,
  Compass,
  Layers,
  Calculator,
  Cpu,
  FlaskConical,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const { listings, impactStats } = useCampusStore();
  const [calculatorSemesters, setCalculatorSemesters] = useState(2);
  const [calculatorBooksPerSem, setCalculatorBooksPerSem] = useState(4);

  // Estimated savings = books * semesters * average price diff (approx ₹650 per book)
  const estimatedSavings = calculatorSemesters * calculatorBooksPerSem * 650;

  const featuredListings = listings.filter((l) => l.availabilityStatus === 'available').slice(0, 4);

  const categories = [
    { title: 'Core Textbooks', slug: 'textbooks', icon: BookOpen, count: '14 Available', color: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
    { title: 'Engineering Drawing', slug: 'engineering_drawing', icon: Compass, count: '6 Available', color: 'bg-blue-100 text-blue-950 border border-blue-300' },
    { title: 'Calculators', slug: 'calculators', icon: Calculator, count: '5 Available', color: 'bg-amber-100 text-amber-950 border border-amber-300' },
    { title: 'Lab Coats & Safety', slug: 'lab_coats', icon: FlaskConical, count: '8 Available', color: 'bg-purple-100 text-purple-950 border border-purple-300' },
    { title: 'Electronics & Kits', slug: 'electronics_kits', icon: Cpu, count: '9 Available', color: 'bg-cyan-100 text-cyan-950 border border-cyan-300' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-slate-50 to-white pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-400 text-emerald-950 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Give resources another semester.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
              Your campus already has <span className="text-emerald-700">what you need.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed max-w-2xl mx-auto">
              Buy, borrow, rent, and donate textbooks, calculators, and lab equipment with verified students at your university. Spend less. Waste less. Keep learning.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/marketplace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all hover:scale-[1.02] text-sm"
              >
                <span>Explore Campus Resources</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/listings/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3.5 rounded-2xl border-2 border-slate-300 shadow-xs transition-all hover:border-slate-400 text-sm"
              >
                <span>+ List an Unused Item</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 font-bold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verified .edu.in Institutional IDs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Designated Safe Campus Pickups</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Recycle className="w-4 h-4 text-emerald-700" />
                <span>Zero Waste Circularity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE CAMPUS IMPACT TICKER */}
      <section className="bg-slate-900 text-white py-8 border-y border-slate-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {formatCurrency(impactStats.totalSavingsRupees)}
              </div>
              <div className="text-xs text-slate-200 uppercase tracking-wider font-bold">
                Student Money Saved
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {impactStats.resourcesReusedCount}
              </div>
              <div className="text-xs text-slate-200 uppercase tracking-wider font-bold">
                Resources Recirculated
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-teal-300 font-mono">
                {impactStats.participatingStudentsCount}+
              </div>
              <div className="text-xs text-slate-200 uppercase tracking-wider font-bold">
                Active Campus Students
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
                {impactStats.co2AvoidedKg} kg
              </div>
              <div className="text-xs text-slate-200 uppercase tracking-wider font-bold">
                Estimated CO₂ Avoided
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BROWSE CATEGORIES */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Academic Resource Categories
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                From 1st year foundation gear to advanced engineering electives.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              <span>View All 12 Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/marketplace?category=${cat.slug}`}
                  className="p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all group bg-slate-50/50 hover:bg-white"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${cat.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-950 text-sm group-hover:text-emerald-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-700 font-bold mt-0.5">{cat.count}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED MARKETPLACE ITEMS */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Available Today On Campus</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Featured Available Resources
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <span>Explore 40+ Resources</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Designed For Real Campus Handover
            </h2>
            <p className="text-slate-500 text-sm">
              No postage fees. No anonymous strangers. Exchange directly at verified campus landmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Find or List</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search by course code (e.g. CS204), branch, or semester. Or post your cupboard items in 60 seconds with AI assistance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Request & Schedule</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose a designated campus safe pickup point (Central Library, Canteen, or SAC) and mutually convenient window.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Two-Sided OTP Code</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meet at the pickup location. Check the item condition in person, then exchange the secure 6-digit verification code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base">Pass It Forward</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rate your peer exchange. When your semester concludes, list the resource again for the next junior batch!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT SAVINGS CALCULATOR */}
      <section className="py-16 bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-800/40 px-3 py-1 rounded-full border border-emerald-700/50">
                <Calculator className="w-3.5 h-3.5" />
                <span>Affordability Simulator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                How much can CampusLoop save you this year?
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                A typical university engineering student spends ₹3,500 to ₹5,500 every semester on brand new reference books, drafter kits, and lab coats that get used for barely 4 months.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              {/* Slider 1: Semesters */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span>Number of Semesters:</span>
                  <span className="text-emerald-300 font-mono text-base">{calculatorSemesters} sem</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={calculatorSemesters}
                  onChange={(e) => setCalculatorSemesters(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Slider 2: Books / Kits per sem */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span>Resources needed per semester:</span>
                  <span className="text-emerald-300 font-mono text-base">{calculatorBooksPerSem} items</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={calculatorBooksPerSem}
                  onChange={(e) => setCalculatorBooksPerSem(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Output Box */}
              <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-1">
                <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                  Estimated Money Kept in Your Pocket:
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono">
                  {formatCurrency(estimatedSavings)}
                </div>
                <div className="text-[11px] text-emerald-200/70 pt-1">
                  Based on average ₹650 peer price difference vs retail textbook pricing.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO TESTIMONIALS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Voices From Acropolis Institute Of Technology and Research
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold">
              Verified feedback from active campus personas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-4">
              <p className="text-xs sm:text-sm text-slate-800 font-medium italic leading-relaxed">
                &quot;I got the Silberschatz DBMS book for ₹250 instead of ₹900. Priya met me at Central Library between lectures. Handover code took 10 seconds to verify.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80"
                  alt="Aarav"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <div className="text-xs font-bold text-slate-950">Aarav Sharma</div>
                  <div className="text-xs text-slate-700 font-semibold">2nd Year CSE Student</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-4">
              <p className="text-xs sm:text-sm text-slate-800 font-medium italic leading-relaxed">
                &quot;My engineering drafter and lab coat were sitting in my hostel wardrobe for an entire year. Passing them down to 1st year juniors cleared space and earned back ₹700.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                  alt="Priya"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <div className="text-xs font-bold text-slate-950">Priya Patel</div>
                  <div className="text-xs text-slate-700 font-semibold">3rd Year CSE • 14 Exchanges</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-4">
              <p className="text-xs sm:text-sm text-slate-800 font-medium italic leading-relaxed">
                &quot;As faculty advisor, having verified institutional email logins and official CCTV pickup zones solved student trust completely. We have kept over 300 books out of trash heaps.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
                  alt="Prof Ramanathan"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <div className="text-xs font-bold text-slate-950">Prof. K. Ramanathan</div>
                  <div className="text-xs text-slate-700 font-semibold">Campus Resource Council</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-lg shadow-emerald-600/30">
            ⟲
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to give your textbooks another semester?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Join hundreds of classmates at Acropolis Institute Of Technology and Research actively recirculating academic equipment.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/marketplace"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-2xl text-sm shadow-md transition-all hover:scale-105"
            >
              Browse Campus Marketplace
            </Link>
            <Link
              href="/listings/create"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3.5 rounded-2xl text-sm transition-all"
            >
              Post a Free or Paid Resource
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
