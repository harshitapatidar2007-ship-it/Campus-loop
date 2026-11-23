'use client';

import React from 'react';
import Link from 'next/link';
import { useCampusStore } from '@/lib/store/campus-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PlusCircle, BookOpen, Trash2, Edit3, Eye, Heart, ArrowRight } from 'lucide-react';

export default function MyListingsPage() {
  const { listings, activeUser, deleteListing } = useCampusStore();

  const myListings = listings.filter((l) => l.ownerId === activeUser.id);

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Listed Resources
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage items you are selling, lending, or giving away on campus.
            </p>
          </div>

          <Link
            href="/listings/create"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs transition-all hover:shadow hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ List New Resource</span>
          </Link>
        </div>

        {/* Listings Grid */}
        {myListings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">You haven&apos;t listed any items yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Give unused textbooks, drafters, and calculators another semester and help junior students save money.
            </p>
            <Link
              href="/listings/create"
              className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Your First Item</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((listing) => {
              const isAvailable = listing.availabilityStatus === 'available';

              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-3">
                    {/* Image & Status Badge */}
                    <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-slate-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                      <span
                        className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isAvailable
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {listing.availabilityStatus}
                      </span>
                    </div>

                    <div>
                      <Link
                        href={`/listings/${listing.id}`}
                        className="font-bold text-slate-900 text-sm hover:text-emerald-700 line-clamp-2 leading-snug"
                      >
                        {listing.title}
                      </Link>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {listing.subject} • Sem {listing.semesterCompatibility.join(',')}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-base font-extrabold text-emerald-700 font-mono">
                        {listing.price === 0 ? 'FREE' : formatCurrency(listing.price)}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">
                        Mode: {listing.listingType}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Stats footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {listing.viewsCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" /> {listing.savesCount}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/listings/${listing.id}`}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-50 transition-colors"
                        title="View details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
