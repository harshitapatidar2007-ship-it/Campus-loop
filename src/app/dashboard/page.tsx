'use client';

import React from 'react';
import Link from 'next/link';
import { useCampusStore } from '@/lib/store/campus-store';
import { formatCurrency } from '@/lib/utils';
import {
  BookOpen,
  PlusCircle,
  Inbox,
  TrendingUp,
  Heart,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Star,
} from 'lucide-react';

export default function DashboardPage() {
  const { activeUser, listings, requests, wishlists, impactStats } = useCampusStore();

  const myListings = listings.filter((l) => l.ownerId === activeUser.id);
  const myIncoming = requests.filter((r) => r.ownerId === activeUser.id);
  const myOutgoing = requests.filter((r) => r.requesterId === activeUser.id);
  const pendingHandovers = requests.filter(
    (r) => (r.ownerId === activeUser.id || r.requesterId === activeUser.id) && (r.status === 'HANDOVER_PENDING' || r.status === 'ACCEPTED')
  );

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500/20"
              />
              {activeUser.isVerified && (
                <ShieldCheck className="w-5 h-5 text-emerald-600 fill-white absolute -bottom-1 -right-1" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Welcome back, {activeUser.name}!
                </h1>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  {activeUser.branch} Sem {activeUser.semester}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Apex Institute of Technology • {activeUser.completedExchanges} completed peer exchanges
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <Link
              href="/listings/create"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ List Item</span>
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition-colors"
            >
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Personal Savings</span>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {formatCurrency(activeUser.completedExchanges * 650)}
            </div>
            <div className="text-[11px] text-slate-500">From peer circulation</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">My Listed Items</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{myListings.length}</div>
            <Link href="/my-listings" className="text-[11px] text-emerald-600 hover:underline">
              Manage listings &rarr;
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Active Reservations</span>
            <div className="text-2xl font-black text-slate-900 font-mono">{myOutgoing.length}</div>
            <Link href="/requests" className="text-[11px] text-emerald-600 hover:underline">
              View holds &rarr;
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Peer Rating</span>
            <div className="text-2xl font-black text-amber-500 font-mono flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{activeUser.rating}</span>
            </div>
            <div className="text-[11px] text-slate-500">Based on {activeUser.totalRatings} ratings</div>
          </div>
        </div>

        {/* Pending Handovers Alert Box */}
        {pendingHandovers.length > 0 && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <Clock className="w-4 h-4 text-amber-700 animate-spin" />
              <span>Pending Handover Meetings ({pendingHandovers.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingHandovers.map((h) => (
                <Link
                  key={h.id}
                  href={`/transactions/${h.id}`}
                  className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{h.listing.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pickup: {h.confirmedPickupPointName || h.proposedPickupPointName}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full shrink-0">
                    Open Code &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/requests"
            className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Requests Hub</h3>
            <p className="text-xs text-slate-500 mt-1">
              Review and approve incoming reservation requests from campus peers.
            </p>
          </Link>

          <Link
            href="/wishlist"
            className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">My Wishlist</h3>
            <p className="text-xs text-slate-500 mt-1">
              {wishlists.filter((w) => w.userId === activeUser.id).length} items monitored on campus radar.
            </p>
          </Link>

          <Link
            href="/impact"
            className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Sustainability Dashboard</h3>
            <p className="text-xs text-slate-500 mt-1">
              Explore your personal environmental offsets and campus-wide savings trends.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
