'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { formatCurrency, getConditionBadgeColor, getModeBadgeColor } from '@/lib/utils';
import { ShieldCheck, MapPin, Heart, ArrowUpRight, Clock, Star } from 'lucide-react';

interface ProductCardProps {
  listing: Listing;
  isSaved?: boolean;
  onToggleSave?: (listingId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ listing, isSaved = false, onToggleSave }) => {
  const savings = (listing.originalPrice || listing.price * 2) - listing.price;
  const isAvailable = listing.availabilityStatus === 'available';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          {/* Mode Pill */}
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs pointer-events-auto ${getModeBadgeColor(listing.listingType)}`}>
            {listing.listingType === 'free_giveaway' ? 'Free Giveaway' : listing.listingType}
          </span>

          {/* Condition Badge */}
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shadow-2xs capitalize bg-white/90 backdrop-blur-xs ${getConditionBadgeColor(listing.condition)}`}>
            {listing.condition.replace('_', ' ')}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleSave(listing.id);
            }}
            className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500 shadow-xs transition-colors backdrop-blur-xs"
            title="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        )}

        {/* Status Overlay if not available */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <span className="bg-white/95 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider shadow-md">
              {listing.availabilityStatus === 'reserved' ? '⏳ Reserved (Hold)' : 'Completed Exchange'}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Branch & Semester compatibility chips */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className="text-[10px] font-bold bg-slate-200 text-slate-900 px-2 py-0.5 rounded-md border border-slate-300">
            {listing.branchCompatibility.join(', ')}
          </span>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-md border border-emerald-300">
            Sem {listing.semesterCompatibility.join(', ')}
          </span>
        </div>

        {/* Title */}
        <Link href={`/listings/${listing.id}`} className="group-hover:text-emerald-700 transition-colors">
          <h3 className="font-bold text-slate-950 text-sm line-clamp-2 leading-snug mb-1">
            {listing.title}
          </h3>
        </Link>

        {/* Subject */}
        <p className="text-xs text-slate-700 font-semibold line-clamp-1 mb-3">{listing.subject}</p>

        {/* Price & Savings Row */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-950 font-mono">
                {listing.price === 0 ? 'FREE' : formatCurrency(listing.price)}
              </span>
              {listing.originalPrice && listing.originalPrice > listing.price && (
                <span className="text-xs text-slate-500 line-through font-semibold">
                  {formatCurrency(listing.originalPrice)}
                </span>
              )}
            </div>
            {savings > 0 && listing.price > 0 && (
              <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded inline-block mt-0.5">
                Save ~{formatCurrency(savings)}
              </span>
            )}
            {listing.deposit ? (
              <span className="text-[11px] text-slate-700 font-semibold block mt-0.5">
                Deposit: {formatCurrency(listing.deposit)} (Refundable)
              </span>
            ) : null}
          </div>

          {/* Owner avatar & verification */}
          <div className="flex items-center gap-1.5 text-right">
            <div>
              <div className="text-xs font-bold text-slate-950 truncate max-w-[80px]">
                {listing.owner.name.split(' ')[0]}
              </div>
              <div className="flex items-center gap-0.5 text-xs text-amber-800 font-bold justify-end">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{listing.owner.rating}</span>
              </div>
            </div>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listing.owner.avatar}
                alt={listing.owner.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-300"
              />
              {listing.owner.isVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-white absolute -bottom-1 -right-1" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
