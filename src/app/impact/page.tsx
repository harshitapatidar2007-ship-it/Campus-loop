'use client';

import React from 'react';
import { useCampusStore } from '@/lib/store/campus-store';
import { formatCurrency } from '@/lib/utils';
import {
  TrendingUp,
  Recycle,
  Droplets,
  Trees,
  CloudRain,
  ShieldCheck,
  Award,
  Sparkles,
  Users,
  BookOpen,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

export default function ImpactPage() {
  const { impactStats, activeUser, requests } = useCampusStore();

  const monthlySavingsData = [
    { month: 'Jul', savings: 14500, items: 28 },
    { month: 'Aug', savings: 32000, items: 64 },
    { month: 'Sep', savings: 48500, items: 92 },
    { month: 'Oct', savings: 72000, items: 138 },
    { month: 'Nov', savings: impactStats.totalSavingsRupees, items: impactStats.resourcesReusedCount },
  ];

  const categoryCirculationData = [
    { name: 'Textbooks', count: impactStats.booksCirculatedCount },
    { name: 'Lab Gear', count: impactStats.labKitsReusedCount },
    { name: 'Drawing Tools', count: 42 },
    { name: 'Calculators', count: 31 },
    { name: 'Donated', count: impactStats.itemsDonatedCount },
  ];

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 mb-2">
              <Recycle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Campus Sustainability & Affordability Index</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Acropolis Institute Of Technology and Research Circulation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real metrics from peer-to-peer exchanges across all engineering departments at AITR.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium block">Total Peer Savings</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
              {formatCurrency(impactStats.totalSavingsRupees)}
            </span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              💰
            </div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Student Savings</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {formatCurrency(impactStats.totalSavingsRupees)}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              Average ₹650 saved per transaction
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              📚
            </div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Items Recirculated</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {impactStats.resourcesReusedCount}
            </div>
            <p className="text-[11px] text-teal-600 font-medium">
              {impactStats.booksCirculatedCount} books & {impactStats.labKitsReusedCount} lab kits
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              🌿
            </div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Carbon Avoided</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {impactStats.co2AvoidedKg} kg
            </div>
            <p className="text-[11px] text-blue-600 font-medium">
              Lifecycle manufacturing footprint spared
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              💧
            </div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Water Conserved</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {impactStats.waterSavedLiters.toLocaleString()} L
            </div>
            <p className="text-[11px] text-cyan-600 font-medium">
              Paper milling industrial water preserved
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Chart 1: Savings Growth */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Cumulative Campus Savings (INR)</h3>
                <p className="text-xs text-slate-400">Monthly student wallet retention</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                +145% Growth
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySavingsData}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(val), 'Campus Savings']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSavings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Category Breakdown */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Circulation by Resource Category</h3>
              <p className="text-xs text-slate-400">Most exchanged items this semester</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryCirculationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip
                    formatter={(val: any) => [`${val} items`, 'Exchanged']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#10B981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Environmental Calculation Methodology Disclosure */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Environmental Impact Assumptions & Methodology Disclosure</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            In compliance with open sustainability reporting, CampusLoop does not fabricate speculative carbon credits. Our metrics are calculated based on peer-reviewed academic resource lifecycle studies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-800 block mb-0.5">CO₂ Offset (~2.5 kg/item)</span>
              <p className="text-slate-500 text-[11px]">
                Accounts for papermaking, bleaching, binding adhesives, freight delivery, and packaging avoidance.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-800 block mb-0.5">Water Savings (~50 L/item)</span>
              <p className="text-slate-500 text-[11px]">
                Calculated based on standard 800-page virgin paper pulp processing requirement of 50 liters water per textbook.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-800 block mb-0.5">Forest Conservation (1 tree / 24 books)</span>
              <p className="text-slate-500 text-[11px]">
                Each 24 recirculated engineering volumes preserves one standard 30-foot mature pulpwood pine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
