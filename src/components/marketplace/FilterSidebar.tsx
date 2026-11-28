'use client';

import React from 'react';
import { ListingCategory, ConditionLevel, ListingMode } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  selectedCondition: string;
  onSelectCondition: (cond: string) => void;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  selectedSemester: string;
  onSelectSemester: (sem: string) => void;
  maxPrice: number;
  onPriceChange: (price: number) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

const CATEGORIES: { label: string; value: ListingCategory }[] = [
  { label: 'All Categories', value: '' as any },
  { label: 'Core Textbooks', value: 'textbooks' },
  { label: 'Reference Books', value: 'reference_books' },
  { label: 'Engineering Drawing', value: 'engineering_drawing' },
  { label: 'Scientific Calculators', value: 'calculators' },
  { label: 'Lab Coats & Gear', value: 'lab_coats' },
  { label: 'Electronics & Kits', value: 'electronics_kits' },
  { label: 'Study Guides & Notes', value: 'notes' },
];

const MODES: { label: string; value: string }[] = [
  { label: 'All Modes', value: 'all' },
  { label: 'Sell', value: 'sell' },
  { label: 'Borrow', value: 'borrow' },
  { label: 'Donate / Free', value: 'donate' },
  { label: 'Exchange', value: 'exchange' },
];

const CONDITIONS: { label: string; value: string }[] = [
  { label: 'Any Condition', value: 'all' },
  { label: 'Like New / New', value: 'like_new' },
  { label: 'Good', value: 'good' },
  { label: 'Fair / Usable', value: 'fair' },
];

const BRANCHES = ['All', 'CSE', 'ECE', 'MECH', 'CIVIL', 'EE'];
const SEMESTERS = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedMode,
  onSelectMode,
  selectedCondition,
  onSelectCondition,
  selectedBranch,
  onSelectBranch,
  selectedSemester,
  onSelectSemester,
  maxPrice,
  onPriceChange,
  onResetFilters,
  totalResultsCount,
}) => {
  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-6 shadow-xs text-xs sm:text-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 font-bold text-slate-950">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filters</span>
          <span className="text-xs bg-slate-200 text-slate-950 font-bold px-2.5 py-0.5 rounded-full border border-slate-300">
            {totalResultsCount} items
          </span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-700 hover:text-emerald-800 flex items-center gap-1 font-bold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Mode Filter (Pills) */}
      <div className="space-y-2">
        <label className="font-bold text-slate-950 block text-xs uppercase tracking-wider">
          Transaction Type
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {MODES.map((m) => {
            const isSelected = selectedMode === m.value;
            return (
              <button
                key={m.value}
                onClick={() => onSelectMode(m.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="font-bold text-slate-950 block text-xs uppercase tracking-wider">
          Resource Category
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value || (!selectedCategory && !cat.value);
            return (
              <button
                key={cat.label}
                onClick={() => onSelectCategory(cat.value)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors font-semibold ${
                  isSelected
                    ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Branch & Semester compatibility */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div>
          <label className="font-semibold text-slate-900 block text-xs uppercase tracking-wider mb-1.5">
            Academic Branch
          </label>
          <div className="flex flex-wrap gap-1.5">
            {BRANCHES.map((b) => {
              const isSelected = selectedBranch === b;
              return (
                <button
                  key={b}
                  onClick={() => onSelectBranch(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-900 block text-xs uppercase tracking-wider mb-1.5">
            Semester
          </label>
          <div className="grid grid-cols-5 gap-1">
            {SEMESTERS.map((s) => {
              const isSelected = selectedSemester === s;
              return (
                <button
                  key={s}
                  onClick={() => onSelectSemester(s)}
                  className={`py-1 rounded-md text-xs font-medium border text-center transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {s === 'All' ? 'All' : `S${s}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Max Price Slider */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <label className="font-semibold text-slate-900 block text-xs uppercase tracking-wider">
            Max Price
          </label>
          <span className="font-bold text-emerald-700 text-xs">
            {maxPrice >= 1500 ? 'Any Price' : `Up to ${formatCurrency(maxPrice)}`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1500}
          step={50}
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-800 font-bold">
          <span>₹0 (Free)</span>
          <span>₹750</span>
          <span>₹1,500+</span>
        </div>
      </div>

      {/* Condition Selector */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <label className="font-bold text-slate-950 block text-xs uppercase tracking-wider">
          Condition
        </label>
        <div className="space-y-1">
          {CONDITIONS.map((cond) => {
            const isSelected = selectedCondition === cond.value;
            return (
              <button
                key={cond.value}
                onClick={() => onSelectCondition(cond.value)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors font-semibold ${
                  isSelected
                    ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{cond.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
