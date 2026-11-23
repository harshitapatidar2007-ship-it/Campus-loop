'use client';

import React, { useState } from 'react';
import { useCampusStore } from '@/lib/store/campus-store';
import { formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Check,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

export default function ModeratorPage() {
  const { reports, resolveReport, activeUser, listings, deleteListing } = useCampusStore();
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});

  const sampleReports = reports.length > 0 ? reports : [
    {
      id: 'rep-demo-1',
      reporterId: 'user-aarav',
      reporterName: 'Aarav Sharma',
      targetType: 'listing' as const,
      targetId: 'list-os-galvin',
      targetTitle: 'Operating System Concepts (9th Edition)',
      reason: 'Edition clarification needed',
      description: 'The syllabus this year expects 10th edition, seller listed 9th. Please check syllabus compatibility.',
      status: 'pending' as const,
      createdAt: '2026-11-23T14:30:00Z',
    },
  ];

  const handleAction = (reportId: string, actionText: string, listingIdToDelete?: string) => {
    resolveReport(reportId, actionText);
    if (listingIdToDelete) {
      deleteListing(listingIdToDelete);
    }
  };

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/60 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Campus Resource Council • Official Moderation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Moderation & Safety Queue
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review flagged items, reported pricing anomalies, and resolve peer disputes.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
            <div>Signed in as: <strong>{activeUser.name}</strong></div>
            <div className="text-[11px] text-purple-700 font-semibold">{activeUser.department}</div>
          </div>
        </div>

        {/* Reports Queue */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Pending Reports & Review Queue ({sampleReports.filter((r) => r.status === 'pending').length})
          </h2>

          {sampleReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      report.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800 animate-pulse'
                    }`}
                  >
                    {report.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Reported by {report.reporterName} • {formatDate(report.createdAt)}
                  </span>
                </div>

                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Target: {report.targetType.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{report.targetTitle}</h3>
                <div className="text-xs font-semibold text-rose-700 mt-1">
                  Reason: {report.reason}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 leading-relaxed">
                  &quot;{report.description}&quot;
                </p>
              </div>

              {report.status === 'resolved' ? (
                <div className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Resolution:</strong> {report.resolutionNote || 'Moderator verified and cleared.'}</span>
                </div>
              ) : (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                  <Link
                    href={`/listings/${report.targetId}`}
                    className="text-xs text-emerald-700 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Target Listing</span>
                  </Link>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleAction(report.id, 'Dismissed: Listing complies with guidelines.')}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => handleAction(report.id, 'Resolved: Verified condition with student seller.')}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      Mark Approved
                    </button>
                    <button
                      onClick={() => handleAction(report.id, 'Taken Down: Incompatible or damaged.', report.targetId)}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      Remove Listing
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
