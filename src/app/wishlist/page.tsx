'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCampusStore } from '@/lib/store/campus-store';
import { ListingCategory, ConditionLevel } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Heart,
  Plus,
  Sparkles,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Bell,
  BookOpen,
} from 'lucide-react';

export default function WishlistPage() {
  const { wishlists, activeUser, addWishlistItem, removeWishlistItem, listings } = useCampusStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<ListingCategory>('textbooks');
  const [branch, setBranch] = useState(activeUser.branch);
  const [semester, setSemester] = useState(activeUser.semester);
  const [budgetMax, setBudgetMax] = useState(300);

  const userWishlists = wishlists.filter((w) => w.userId === activeUser.id);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addWishlistItem({
      title,
      subject: subject || title,
      category,
      branch,
      semester,
      budgetMax,
      preferredCondition: 'good',
    });

    setTitle('');
    setSubject('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Smart Demand Matching Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Student Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tell CampusLoop what textbook or kit you need. We will alert you the second a peer lists it within your budget.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs transition-all self-start sm:self-auto hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Wishlist Item</span>
          </button>
        </div>

        {/* Wishlist Items List */}
        {userWishlists.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add books or instruments you anticipate needing for next semester to get notified first when classmates list them.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Wish</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userWishlists.map((item) => {
              // Find live matching listing if any
              const matchedListing = listings.find(
                (l) =>
                  l.availabilityStatus === 'available' &&
                  l.price <= item.budgetMax &&
                  (l.title.toLowerCase().includes(item.title.toLowerCase()) ||
                    l.subject.toLowerCase().includes(item.subject.toLowerCase()))
              );

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                        {item.branch} • Sem {item.semester}
                      </span>
                      <span className="text-xs text-slate-400">Created: {formatDate(item.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-700 font-mono">
                        Max Budget: {formatCurrency(item.budgetMax)}
                      </span>
                      <button
                        onClick={() => removeWishlistItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove wish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.subject}</p>
                  </div>

                  {/* Smart Match Found Box */}
                  {matchedListing ? (
                    <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={matchedListing.images[0]}
                          alt={matchedListing.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Instant Match Found! ({item.matchScorePercent || 96}% Compatibility)</span>
                          </div>
                          <div className="text-xs text-slate-700 font-medium truncate max-w-sm">
                            {matchedListing.title} — Listed by {matchedListing.owner.name} for {formatCurrency(matchedListing.price)}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/listings/${matchedListing.id}`}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs shrink-0"
                      >
                        <span>View Listing</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl flex items-center gap-2">
                      <Bell className="w-4 h-4 text-slate-400" />
                      <span>Radar Active: CampusLoop is monitoring incoming listings matching this query.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD WISHLIST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add to Wishlist</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Book or Resource Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Operating System Concepts (Galvin)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Operating Systems"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="EE">EE</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Sem {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-800">Max Budget (₹ INR):</label>
                  <span className="font-bold text-emerald-700 font-mono">{formatCurrency(budgetMax)}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={1200}
                  step={50}
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-xs"
                >
                  Save Wish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
