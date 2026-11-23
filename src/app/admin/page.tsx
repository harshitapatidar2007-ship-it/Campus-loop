'use client';

import React from 'react';
import { useCampusStore } from '@/lib/store/campus-store';
import { SEED_CAMPUS, SEED_DEPARTMENTS } from '@/lib/data/seed-data';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldCheck,
  Building,
  MapPin,
  Layers,
  Users,
  Settings,
  Activity,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function AdminPage() {
  const { pickupPoints, listings, requests, impactStats, activeUser } = useCampusStore();

  const auditEvents = [
    { id: '1', action: 'CONCURRENCY_LOCK_ACQUIRED', entity: 'Listing list-dbms-korth', user: 'system', time: 'Just now' },
    { id: '2', action: 'HANDOVER_OTP_GENERATED', entity: 'Request req-20491', user: 'user-priya', time: '10 mins ago' },
    { id: '3', action: 'STUDENT_VERIFIED_EDU', entity: 'User 2023CSE0142', user: 'dean.welfare@apex.edu.in', time: '1 hour ago' },
    { id: '4', action: 'PICKUP_POINT_AUDIT_PASSED', entity: 'Central Library Foyer CCTV', user: 'campus-security', time: 'Today 09:00 AM' },
  ];

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/70 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Institutional Dean Office & Campus System Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              University Administration Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Campus boundaries, department curricula, safe zones, and operational integrity.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
            <div>Admin: <strong>{activeUser.name}</strong></div>
            <div className="text-[11px] text-amber-700 font-semibold">{activeUser.department}</div>
          </div>
        </div>

        {/* Campus Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Institutional Domain</span>
            <div className="text-xl font-bold text-slate-900 font-mono">@{SEED_CAMPUS.domain}</div>
            <p className="text-[11px] text-emerald-600 font-medium">Automatic verification enabled</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Campus Savings</span>
            <div className="text-xl font-bold text-emerald-700 font-mono">
              {formatCurrency(impactStats.totalSavingsRupees)}
            </div>
            <p className="text-[11px] text-slate-500">Across {impactStats.completedTransactionsCount} transactions</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Active Student Cohort</span>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {SEED_CAMPUS.studentsCount.toLocaleString()} Students
            </div>
            <p className="text-[11px] text-slate-500">5 Accredited Engineering Depts</p>
          </div>
        </div>

        {/* 2-Col Layout: Departments & Pickup Hubs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Departments */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>Academic Departments & Curriculum</span>
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                5 Branches
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {SEED_DEPARTMENTS.map((dept) => (
                <div key={dept.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{dept.name}</span>
                    <span className="text-slate-400 ml-2">({dept.code})</span>
                  </div>
                  <span className="text-emerald-700 font-medium">8 Semesters</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup Points */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Configured Safe Pickup Points</span>
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                {pickupPoints.length} Hubs Active
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {pickupPoints.map((pt) => (
                <div key={pt.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{pt.name}</span>
                    <div className="text-[11px] text-slate-400">{pt.building}</div>
                  </div>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    CCTV Protected
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Concurrency Audit Log */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Platform Security & Concurrency Audit Trail</span>
            </h3>
            <span className="text-[11px] text-slate-400">Live PostgreSQL Event Stream</span>
          </div>

          <div className="space-y-2">
            {auditEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-800">{evt.action}</span>
                  <span className="text-slate-500">[{evt.entity}]</span>
                </div>
                <div className="text-slate-400 text-[11px]">{evt.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
