'use client';

import React, { useState } from 'react';
import { RequestReservation, User } from '@/lib/types';
import { useCampusStore } from '@/lib/store/campus-store';
import { ShieldCheck, KeyRound, CheckCircle2, AlertTriangle, ArrowRight, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '@/lib/utils';

interface HandoverOtpCardProps {
  request: RequestReservation;
  currentUser: User;
}

export const HandoverOtpCard: React.FC<HandoverOtpCardProps> = ({ request, currentUser }) => {
  const { verifyHandoverCode, addReview } = useCampusStore();
  const [enteredCode, setEnteredCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Review dialog state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isRequester = currentUser.id === request.requesterId;
  const isOwner = currentUser.id === request.ownerId;
  const isCompleted = ['COMPLETED', 'RETURN_PENDING', 'RETURNED'].includes(request.status);

  const handleVerify = () => {
    if (!enteredCode.trim() || enteredCode.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit code.');
      return;
    }
    setErrorMsg('');
    setIsVerifying(true);

    const res = verifyHandoverCode(request.id, enteredCode);
    setIsVerifying(false);

    if (res.success) {
      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10B981', '#34D399', '#FBBF24'],
        });
      } catch (e) {
        // ignore in non-browser env
      }
      setShowReviewModal(true);
    } else {
      setErrorMsg(res.error || 'Failed to verify code.');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const otherUserId = isOwner ? request.requesterId : request.ownerId;
    addReview({
      requestId: request.id,
      listingId: request.listingId,
      revieweeId: otherUserId,
      rating: reviewRating,
      comment: reviewComment || 'Smooth and verified campus exchange.',
    });
    setReviewSubmitted(true);
    setTimeout(() => setShowReviewModal(false), 2000);
  };

  const savings = Math.max(0, (request.listing.originalPrice || request.listing.price * 2) - request.listing.price);

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-700/50">
      {/* Background ambient pattern */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center ring-1 ring-emerald-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Campus Handover Protocol</h3>
              <p className="text-xs text-emerald-200/80">Two-sided in-person cryptographic verification</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-800/60 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-700/50">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Fraud Protection</span>
          </div>
        </div>

        {/* State 1: Already Completed */}
        {isCompleted ? (
          <div className="py-4 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Handover Verified & Completed!</h4>
            <p className="text-xs text-emerald-200/90 max-w-md mx-auto">
              Physical exchange confirmed on campus at <strong>{request.confirmedPickupPointName || request.proposedPickupPointName}</strong>.
            </p>
            {savings > 0 && (
              <div className="inline-block bg-emerald-800/50 border border-emerald-600/50 px-4 py-2 rounded-2xl text-xs font-semibold text-emerald-300">
                🎉 Real Student Savings: {formatCurrency(savings)} compared to market price
              </div>
            )}
            <div className="pt-2">
              <button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white font-medium underline"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Leave or View Peer Feedback</span>
              </button>
            </div>
          </div>
        ) : isRequester ? (
          /* State 2: Current user is the Requester (Buyer/Borrower) */
          <div className="space-y-4">
            <div className="bg-emerald-950/80 border border-emerald-500 rounded-2xl p-5 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Your Secret Handover OTP Code:
              </span>
              <div className="text-4xl sm:text-5xl font-mono font-black tracking-widest text-emerald-300 select-all py-1">
                {request.handoverCode || '492817'}
              </div>
              <p className="text-xs text-white font-medium max-w-sm mx-auto">
                Present this 6-digit code to <strong>{request.owner.name}</strong> when you meet at {request.confirmedPickupPointName || request.proposedPickupPointName}.
              </p>
            </div>

            <div className="text-xs text-emerald-100 font-medium bg-emerald-950/70 p-3.5 rounded-xl border border-emerald-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Safety Rule:</strong> Never reveal this code via chat or phone before physical inspection of the resource. Only give it once the item is in your hands.
              </span>
            </div>
          </div>
        ) : isOwner ? (
          /* State 3: Current user is the Owner (Lender/Seller) */
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Enter Requester&apos;s 6-Digit Handover Code:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 492817"
                  className="bg-emerald-950 border-2 border-emerald-400 rounded-xl px-4 py-3 text-center text-xl sm:text-2xl font-mono font-black tracking-widest text-white placeholder:text-emerald-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-300 flex-1"
                />
                <button
                  onClick={handleVerify}
                  disabled={isVerifying || enteredCode.length !== 6}
                  className="bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-black px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Verify Handover</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Demo Hint */}
              <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold pt-1">
                <span>Code attempt: {request.handoverAttempts}/5</span>
                <span className="font-mono bg-emerald-800/80 px-2.5 py-1 rounded text-white border border-emerald-600">
                  Demo hint: Code is <strong className="text-emerald-200">{request.handoverCode || '492817'}</strong>
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* State 4: Other user or observer */
          <div className="text-xs text-emerald-200/80">
            Handover in progress between {request.requester.name} and {request.owner.name}.
          </div>
        )}
      </div>

      {/* Review & Feedback Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-base">Rate Completed Exchange</h4>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {reviewSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-slate-900">Thank you for your feedback!</h5>
                <p className="text-xs text-slate-500">Your review helps maintain campus trust.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="font-semibold block mb-1">Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Feedback Comment</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Was the resource condition as described? Was pickup punctual?"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-xs"
                >
                  Submit Campus Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
