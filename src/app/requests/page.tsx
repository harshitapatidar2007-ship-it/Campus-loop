'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCampusStore } from '@/lib/store/campus-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Inbox,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export default function RequestsPage() {
  const { requests, activeUser, acceptRequest, rejectRequest, cancelRequest } = useCampusStore();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

  const incomingRequests = requests.filter((r) => r.ownerId === activeUser.id);
  const outgoingRequests = requests.filter((r) => r.requesterId === activeUser.id);

  const displayedRequests = activeTab === 'incoming' ? incomingRequests : outgoingRequests;

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Requests & Reservations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track incoming reservation requests and your outgoing item holds.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-200/80 p-1 rounded-2xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'incoming'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Inbox className="w-3.5 h-3.5 text-emerald-600" />
              <span>Incoming to Me ({incomingRequests.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'outgoing'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              <span>My Outgoing ({outgoingRequests.length})</span>
            </button>
          </div>
        </div>

        {/* Requests List */}
        {displayedRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              No {activeTab === 'incoming' ? 'incoming' : 'outgoing'} requests yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'incoming'
                ? 'When classmates request items you listed, they will appear here for your approval.'
                : 'Browse the campus marketplace and request resources you need for your semester.'}
            </p>
            {activeTab === 'outgoing' && (
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1 bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs mt-2"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedRequests.map((req) => {
              const otherParty = activeTab === 'incoming' ? req.requester : req.owner;
              const isHandoverReady = req.status === 'HANDOVER_PENDING' || req.status === 'ACCEPTED';
              const isCompleted = req.status === 'COMPLETED' || req.status === 'RETURNED';

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isHandoverReady
                            ? 'bg-amber-100 text-amber-900 animate-pulse'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">Created: {formatDate(req.createdAt)}</span>
                    </div>

                    <Link
                      href={`/transactions/${req.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      <span>Open Handover Tracker</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-3.5 items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={req.listing.images[0]}
                        alt={req.listing.title}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <Link
                          href={`/transactions/${req.id}`}
                          className="font-bold text-slate-900 text-sm hover:text-emerald-700 leading-snug line-clamp-1"
                        >
                          {req.listing.title}
                        </Link>
                        <div className="text-xs text-slate-500">
                          {req.listing.subject} • Mode: <span className="font-semibold capitalize">{req.requestedMode}</span>
                        </div>
                        <div className="text-xs font-extrabold text-emerald-700">
                          {req.listing.price === 0 ? 'FREE' : formatCurrency(req.listing.price)}
                        </div>
                      </div>
                    </div>

                    {/* Other party avatar */}
                    <div className="flex items-center gap-2.5 sm:self-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={otherParty.avatar}
                        alt={otherParty.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="text-xs">
                        <div className="text-slate-400 text-[10px]">
                          {activeTab === 'incoming' ? 'Requester:' : 'Owner:'}
                        </div>
                        <div className="font-bold text-slate-800">{otherParty.name}</div>
                      </div>
                    </div>
                  </div>

                  {/* Meeting Point & Time */}
                  <div className="p-3 bg-slate-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{req.confirmedPickupPointName || req.proposedPickupPointName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{req.confirmedPickupTime || req.proposedPickupTime}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex justify-end gap-2 pt-1">
                    {activeTab === 'incoming' && req.status === 'REQUESTED' && (
                      <>
                        <button
                          onClick={() => rejectRequest(req.id)}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => acceptRequest(req.id)}
                          className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                        >
                          Accept Request
                        </button>
                      </>
                    )}

                    <Link
                      href={`/transactions/${req.id}`}
                      className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
                    >
                      View Live Transaction Details
                    </Link>
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
