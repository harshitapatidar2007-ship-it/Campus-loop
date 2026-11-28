'use client';

import React from 'react';
import { useCampusStore } from '@/lib/store/campus-store';
import { MapPin, Clock, ShieldCheck, Accessibility, CheckCircle2, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function PickupPointsPage() {
  const { pickupPoints } = useCampusStore();

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Campus Safety Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Designated Safe Pickup Hubs
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
              Official university exchange points equipped with security surveillance and campus wifi.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs transition-all self-start sm:self-auto"
          >
            <span>Browse Available Items</span>
          </Link>
        </div>

        {/* Pickup Points Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pickupPoints.map((point) => (
            <div
              key={point.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-950 text-base">{point.name}</h3>
                      <p className="text-xs text-slate-700 font-semibold">{point.building}</p>
                    </div>
                  </div>

                  {point.isSafeZone && (
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded-full border border-emerald-300 shrink-0">
                      CCTV Safe Zone
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-800 font-medium leading-relaxed">{point.description}</p>

                <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span><strong className="text-slate-950">Hours:</strong> {point.operatingHours}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <Accessibility className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span><strong className="text-slate-950">Access:</strong> {point.accessibility}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-800 space-y-0.5 border border-slate-200">
                  <span className="font-bold text-slate-950 block text-[11px] uppercase tracking-wider">
                    Meeting Tip:
                  </span>
                  <p className="text-slate-800 font-medium text-[11px]">{point.meetingInstructions}</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/marketplace?pickup=${point.id}`}
                  className="w-full text-center block bg-slate-200 hover:bg-emerald-100 hover:text-emerald-950 text-slate-900 font-bold py-2.5 rounded-xl text-xs transition-colors border border-slate-300"
                >
                  View Listings at this Hub
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
