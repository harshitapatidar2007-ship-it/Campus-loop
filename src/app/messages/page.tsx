'use client';

import React from 'react';
import Link from 'next/link';
import { useCampusStore } from '@/lib/store/campus-store';
import { MessageSquare, ArrowRight, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function MessagesPage() {
  const { requests, activeUser, chatMessages } = useCampusStore();

  const activeConversations = requests.filter(
    (r) => r.ownerId === activeUser.id || r.requesterId === activeUser.id
  );

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Coordination Messages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reservation-linked chats for coordinating physical handover times and campus spots.
          </p>
        </div>

        {/* Chat List */}
        {activeConversations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No active coordination chats</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When you request a resource or receive a request on your listing, a dedicated coordination chat is opened automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeConversations.map((req) => {
              const otherUser = req.ownerId === activeUser.id ? req.requester : req.owner;
              const msgs = chatMessages[req.id] || [];
              const lastMsg = msgs[msgs.length - 1];

              return (
                <Link
                  key={req.id}
                  href={`/transactions/${req.id}`}
                  className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-4 block"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      {otherUser.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 fill-white absolute -bottom-1 -right-1" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{otherUser.name}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium shrink-0">
                          {req.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-700 truncate">
                        Re: {req.listing.title}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {lastMsg ? lastMsg.content : 'Chat created. Tap to coordinate pickup.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-emerald-600 hidden sm:inline">Open Chat</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
