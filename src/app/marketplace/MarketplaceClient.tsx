'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCampusStore } from '@/lib/store/campus-store';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { CampusLoopAssistantModal } from '@/components/ai/CampusLoopAssistantModal';

export const MarketplaceClient: React.FC = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const { listings } = useCampusStore();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [sortBy, setSortBy] = useState<'recent' | 'price_low' | 'price_high' | 'condition'>('recent');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  // Filter & Search Logic
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Search term
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSubject = item.subject.toLowerCase().includes(query);
        const matchesAuthor = item.author?.toLowerCase().includes(query) || false;
        const matchesCourse = item.courseCode.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesBranch = item.branchCompatibility.some((b) => b.toLowerCase().includes(query));

        if (!matchesTitle && !matchesSubject && !matchesAuthor && !matchesCourse && !matchesCategory && !matchesBranch) {
          return false;
        }
      }

      // Category
      if (selectedCategory && item.category !== selectedCategory) {
        return false;
      }

      // Mode
      if (selectedMode !== 'all') {
        if (selectedMode === 'donate' && item.listingType !== 'donate' && item.listingType !== 'free_giveaway') {
          return false;
        } else if (selectedMode !== 'donate' && item.listingType !== selectedMode) {
          return false;
        }
      }

      // Condition
      if (selectedCondition !== 'all') {
        if (selectedCondition === 'like_new' && item.condition !== 'new' && item.condition !== 'like_new') {
          return false;
        } else if (selectedCondition !== 'like_new' && item.condition !== selectedCondition) {
          return false;
        }
      }

      // Branch
      if (selectedBranch !== 'All' && !item.branchCompatibility.includes(selectedBranch)) {
        return false;
      }

      // Semester
      if (selectedSemester !== 'All' && !item.semesterCompatibility.includes(Number(selectedSemester))) {
        return false;
      }

      // Max price
      if (item.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'condition') {
        const score: Record<string, number> = { new: 5, like_new: 4, good: 3, fair: 2, heavily_used: 1 };
        return (score[b.condition] || 0) - (score[a.condition] || 0);
      }
      // default: recent
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [listings, searchQuery, selectedCategory, selectedMode, selectedCondition, selectedBranch, selectedSemester, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedMode('all');
    setSelectedCondition('all');
    setSelectedBranch('All');
    setSelectedSemester('All');
    setMaxPrice(1500);
    setSortBy('recent');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedCategory) ||
    selectedMode !== 'all' ||
    selectedCondition !== 'all' ||
    selectedBranch !== 'All' ||
    selectedSemester !== 'All' ||
    maxPrice < 1500;

  return (
    <div className="bg-slate-50/50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Marketplace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Campus Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
              Active peer exchange at Acropolis Institute Of Technology and Research
            </p>
          </div>

          {/* AI Search Assistant Trigger */}
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-sm transition-all hover:shadow hover:scale-[1.02] self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Search with CampusLoop AI</span>
          </button>
        </div>

        {/* Search Bar & Sort Row */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Natural language & keyword input */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, course code (e.g. CS204), ISBN, or subject..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-950 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Controls: Mobile Filter Toggle + Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-700 font-bold hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 text-slate-950 text-xs rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="recent">Recently Listed</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="condition">Best Condition</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-800 font-bold">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                &quot;{searchQuery}&quot;
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 font-bold px-2.5 py-1 rounded-full border border-emerald-300 capitalize">
                {selectedCategory.replace('_', ' ')}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
              </span>
            )}
            {selectedMode !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 font-bold px-2.5 py-1 rounded-full border border-emerald-300 capitalize">
                Mode: {selectedMode}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedMode('all')} />
              </span>
            )}
            {selectedBranch !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                Branch: {selectedBranch}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBranch('All')} />
              </span>
            )}
            {selectedSemester !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                Semester {selectedSemester}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSemester('All')} />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-700 hover:underline font-bold ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Content Grid: Sidebar + Listings */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block shrink-0">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedMode={selectedMode}
              onSelectMode={setSelectedMode}
              selectedCondition={selectedCondition}
              onSelectCondition={setSelectedCondition}
              selectedBranch={selectedBranch}
              onSelectBranch={setSelectedBranch}
              selectedSemester={selectedSemester}
              onSelectSemester={setSelectedSemester}
              maxPrice={maxPrice}
              onPriceChange={setMaxPrice}
              onResetFilters={handleResetFilters}
              totalResultsCount={filteredListings.length}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="lg:hidden w-full">
              <FilterSidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedMode={selectedMode}
                onSelectMode={setSelectedMode}
                selectedCondition={selectedCondition}
                onSelectCondition={setSelectedCondition}
                selectedBranch={selectedBranch}
                onSelectBranch={setSelectedBranch}
                selectedSemester={selectedSemester}
                onSelectSemester={setSelectedSemester}
                maxPrice={maxPrice}
                onPriceChange={setMaxPrice}
                onResetFilters={handleResetFilters}
                totalResultsCount={filteredListings.length}
              />
            </div>
          )}

          {/* Product Grid Area */}
          <div className="flex-1 w-full">
            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No resources found</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  No listings matched your active filters. Try broadening your budget or searching by general subject.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => setShowAIModal(true)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Ask AI Assistant
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ProductCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      {showAIModal && <CampusLoopAssistantModal onClose={() => setShowAIModal(false)} />}
    </div>
  );
};
