'use client';

import React from 'react';
import { RequestStatus } from '@/lib/types';
import { Check, Clock, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface HandoverTimelineProps {
  status: RequestStatus;
  isBorrowMode?: boolean;
}

export const HandoverTimeline: React.FC<HandoverTimelineProps> = ({ status, isBorrowMode = false }) => {
  const steps = [
    { key: 'REQUESTED', label: '1. Request Submitted', description: 'Waiting for owner approval' },
    { key: 'ACCEPTED', label: '2. Schedule Confirmed', description: 'Campus pickup point locked' },
    { key: 'HANDOVER_PENDING', label: '3. Handover OTP Ready', description: 'Meet in-person with 6-digit code' },
    { key: 'COMPLETED', label: isBorrowMode ? '4. In Circulation (Lent)' : '4. Exchange Completed', description: 'Savings credited & verified' },
  ];

  if (isBorrowMode) {
    steps.push({
      key: 'RETURNED',
      label: '5. Resource Returned',
      description: 'Lending cycle completed',
    });
  }

  const getStepIndex = (st: RequestStatus) => {
    switch (st) {
      case 'REQUESTED':
        return 0;
      case 'ACCEPTED':
        return 1;
      case 'HANDOVER_PENDING':
        return 2;
      case 'COMPLETED':
      case 'RETURN_PENDING':
        return 3;
      case 'RETURNED':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);
  const isCancelledOrRejected = ['CANCELLED', 'REJECTED', 'EXPIRED', 'DISPUTED'].includes(status);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center justify-between">
        <span>Handover Verification Progress</span>
        {isCancelledOrRejected ? (
          <span className="text-xs bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full font-semibold border border-rose-200">
            {status}
          </span>
        ) : (
          <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
            {status.replace('_', ' ')}
          </span>
        )}
      </h3>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const isFinished = !isCancelledOrRejected && idx < currentIndex;
            const isCurrent = !isCancelledOrRejected && idx === currentIndex;

            return (
              <div key={step.key} className="flex md:flex-col items-start gap-3">
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isFinished
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isFinished ? <Check className="w-4 h-4" /> : idx + 1}
                </div>

                {/* Step Text */}
                <div>
                  <div
                    className={`font-semibold text-xs ${
                      isFinished || isCurrent ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{step.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
