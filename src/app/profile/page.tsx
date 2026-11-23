'use client';

import React from 'react';
import { useCampusStore } from '@/lib/store/campus-store';
import { formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Star,
  Award,
  BookOpen,
  Calendar,
  Mail,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export default function ProfilePage() {
  const { activeUser, reviews, toggleCampusVerification } = useCampusStore();

  const userReviews = reviews.filter((r) => r.revieweeId === activeUser.id);

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/20"
                />
                {activeUser.isVerified && (
                  <ShieldCheck className="w-6 h-6 text-emerald-600 fill-white absolute -bottom-1 -right-1" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{activeUser.name}</h1>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full capitalize">
                    {activeUser.role}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{activeUser.email}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {activeUser.department} • {activeUser.branch} Sem {activeUser.semester} (ID: {activeUser.studentId})
                </div>
              </div>
            </div>

            {/* Verification State Box with Demo Toggle */}
            <div className="sm:text-right space-y-2">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold border ${
                  activeUser.isVerified
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{activeUser.isVerified ? 'Campus Verified Student' : 'Unverified Student'}</span>
              </div>
              <div>
                <button
                  onClick={() => toggleCampusVerification(activeUser.id)}
                  className="text-xs text-emerald-700 hover:underline font-semibold block sm:inline-block"
                >
                  [Demo: Toggle Verification Status]
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Bio</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{activeUser.bio}</p>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Campus Badges</h3>
            <div className="flex gap-2 flex-wrap">
              {activeUser.badges.map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-semibold bg-slate-100 text-slate-800 px-3 py-1 rounded-xl flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Peer Rating</span>
              <div className="text-lg font-black text-amber-500 font-mono flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{activeUser.rating}</span>
              </div>
              <div className="text-[10px] text-slate-500">{activeUser.totalRatings} ratings</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Exchanges</span>
              <div className="text-lg font-black text-slate-900 font-mono">{activeUser.completedExchanges}</div>
              <div className="text-[10px] text-slate-500">Items handed over</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Response Rate</span>
              <div className="text-lg font-black text-emerald-700 font-mono">{activeUser.responseRatePercent}%</div>
              <div className="text-[10px] text-slate-500">Fast responder</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Member Since</span>
              <div className="text-xs font-bold text-slate-800 pt-1">{activeUser.memberSince}</div>
              <div className="text-[10px] text-slate-500">AIT Community</div>
            </div>
          </div>
        </div>

        {/* Peer Reviews Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Completed Exchange Reviews</h3>
              <p className="text-xs text-slate-500">Feedback left only after verified OTP physical exchanges</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              {userReviews.length} reviews
            </span>
          </div>

          {userReviews.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No written reviews yet. Reviews are posted upon completing verified handovers.
            </div>
          ) : (
            <div className="space-y-4">
              {userReviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={rev.reviewerAvatar} alt={rev.reviewerName} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-slate-800">{rev.reviewerName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 italic">&quot;{rev.comment}&quot;</p>
                  <div className="text-[10px] text-slate-400">{formatDate(rev.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
