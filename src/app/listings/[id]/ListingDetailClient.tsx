'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCampusStore } from '@/lib/store/campus-store';
import { formatCurrency, getConditionBadgeColor, getModeBadgeColor, formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Heart,
  Share2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  Award,
  BookOpen,
  Info,
  Star,
  ExternalLink,
} from 'lucide-react';

export const ListingDetailClient: React.FC<{ listingId: string }> = ({ listingId }) => {
  const router = useRouter();
  const { getListingById, activeUser, pickupPoints, createRequest, reportItem } = useCampusStore();

  const listing = getListingById(listingId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Incorrect information or damaged condition');
  const [reportNote, setReportNote] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Request form state
  const [selectedPickupPointId, setSelectedPickupPointId] = useState(
    listing?.pickupPointPreferenceId || pickupPoints[0]?.id || 'pickup-lib'
  );
  const [pickupTime, setPickupTime] = useState('Tomorrow 2:00 PM - 3:00 PM');
  const [requestMessage, setRequestMessage] = useState(
    'Hi! I would like to reserve this resource. I can meet you at the pickup point.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [whatsAppSuccessData, setWhatsAppSuccessData] = useState<{ waLink: string; phone: string } | null>(null);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Resource Not Found</h2>
        <p className="text-sm text-slate-500">This listing may have been completed or removed.</p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-medium px-4 py-2 rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const isOwner = activeUser.id === listing.ownerId;
  const isAvailable = listing.availabilityStatus === 'available';
  const isBorrow = listing.listingType === 'borrow' || listing.listingType === 'lend';
  const savings = (listing.originalPrice || listing.price * 2) - listing.price;
  const ownerWhatsApp = listing.whatsappNumber || '+919876543210';

  const sendWhatsAppNotification = async (pickupPtName: string, reqId?: string) => {
    const waText = `Hello ${listing.owner.name.split(' ')[0]}! I'm ${activeUser.name} from Acropolis Institute Of Technology and Research (${activeUser.branch} Sem ${activeUser.semester}). I saw your resource listing for "${listing.title}" on CampusLoop and would like to ${listing.listingType} it. Can we meet at ${pickupPtName} around ${pickupTime}? CampusLoop Transaction: ${reqId ? `https://campusloop.internal/transactions/${reqId}` : 'Direct Campus Request'}`;

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: ownerWhatsApp,
          message: waText,
          listingTitle: listing.title,
          requesterName: activeUser.name,
          pickupPointName: pickupPtName,
          requestId: reqId,
        }),
      });
      const data = await res.json();
      if (data.success && data.waLink) {
        setWhatsAppSuccessData({ waLink: data.waLink, phone: ownerWhatsApp });
        // Automatically open WhatsApp in a new tab for seamless user experience
        window.open(data.waLink, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.warn('Failed to call WhatsApp dispatch API:', err);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const chosenPoint = pickupPoints.find((p) => p.id === selectedPickupPointId);
    const chosenPointName = chosenPoint ? chosenPoint.name : 'Central Library Entrance';

    const result = createRequest({
      listingId: listing.id,
      mode: listing.listingType,
      pickupPointId: selectedPickupPointId,
      pickupTime,
      message: requestMessage,
    });

    if (result.success && result.request) {
      // Direct WhatsApp message sent directly to the owner's WhatsApp number mentioned during listing!
      await sendWhatsAppNotification(chosenPointName, result.request.id);
      setIsSubmitting(false);
      setShowRequestModal(false);
      router.push(`/transactions/${result.request.id}`);
    } else {
      setIsSubmitting(false);
      setErrorMessage(result.error || 'Unable to submit request.');
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportItem({
      targetType: 'listing',
      targetId: listing.id,
      targetTitle: listing.title,
      reason: reportReason,
      description: reportNote || 'Student flagged this listing for moderation inspection.',
    });
    setReportSuccess(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSuccess(false);
    }, 2000);
  };

  return (
    <div className="bg-slate-50/60 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Back link */}
        <div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
        </div>

        {/* Main Grid: Gallery & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-3 shadow-xs overflow-hidden">
              <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.images[activeImageIndex] || listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs ${getModeBadgeColor(
                    listing.listingType
                  )}`}
                >
                  {listing.listingType === 'free_giveaway' ? 'Free Giveaway' : listing.listingType}
                </span>
                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full border shadow-xs bg-white/95 backdrop-blur-xs capitalize ${getConditionBadgeColor(
                    listing.condition
                  )}`}
                >
                  {listing.condition.replace('_', ' ')}
                </span>
              </div>

              {/* Thumbnails */}
              {listing.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx ? 'border-emerald-600 scale-105' : 'border-transparent opacity-75'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Safety & Anti-Fraud Pledge Box */}
            <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-2xl p-4 text-xs space-y-2 text-emerald-950">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Campus Safe Exchange Guarantee</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Exchanges take place exclusively at university-approved physical meeting hubs with CCTV. Handover is confirmed with a 6-digit one-time code only after you have personally inspected the resource condition.
              </p>
            </div>
          </div>

          {/* Center Column: Listing Information (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              {/* Branch & Semester compatibility */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-lg">
                  {listing.branchCompatibility.join(', ')}
                </span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                  Semester {listing.semesterCompatibility.join(', ')}
                </span>
                <span className="text-xs font-bold bg-slate-200 text-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-300">
                  {listing.academicYear}
                </span>
              </div>

              {/* Title & Subject */}
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 leading-snug">
                  {listing.title}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-emerald-800 mt-1">
                  Subject: {listing.subject} {listing.courseCode ? `(${listing.courseCode})` : ''}
                </p>
              </div>

              {/* Author / Edition / ISBN if applicable */}
              {(listing.author || listing.isbn || listing.edition) && (
                <div className="pt-3 border-t border-slate-200 text-xs space-y-1.5 text-slate-800 font-medium">
                  {listing.author && (
                    <div>
                      <span className="font-bold text-slate-950">Author:</span> {listing.author}
                    </div>
                  )}
                  {listing.edition && (
                    <div>
                      <span className="font-bold text-slate-950">Edition:</span> {listing.edition}
                    </div>
                  )}
                  {listing.isbn && (
                    <div>
                      <span className="font-bold text-slate-950">ISBN:</span>{' '}
                      <span className="font-mono font-bold text-slate-900">{listing.isbn}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  About this resource:
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Condition Notes */}
              {listing.conditionNotes && (
                <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-300 text-xs space-y-1">
                  <span className="font-bold text-slate-950 block">Condition Notes:</span>
                  <p className="text-slate-800 font-medium">{listing.conditionNotes}</p>
                </div>
              )}

              {/* Preferred Campus Pickup Point */}
              <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-800 font-medium">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-950">Preferred Pickup Point:</span>
                  <div className="text-slate-900 font-semibold">{listing.pickupPointPreferenceName || 'Central Library Entrance'}</div>
                </div>
              </div>
            </div>

            {/* Report Listing Button */}
            <div className="text-right">
              <button
                onClick={() => setShowReportModal(true)}
                className="text-xs text-slate-600 hover:text-rose-700 inline-flex items-center gap-1 font-bold transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-slate-600" />
                <span>Report this listing</span>
              </button>
            </div>
          </div>

          {/* Right Column: Pricing & Action Card + Owner Profile (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Action Box */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-5">
              <div>
                <span className="text-xs text-slate-700 font-bold uppercase tracking-wider block">
                  Campus Price
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-950 font-mono">
                    {listing.price === 0 ? 'FREE' : formatCurrency(listing.price)}
                  </span>
                  {listing.originalPrice && listing.originalPrice > listing.price && (
                    <span className="text-sm text-slate-500 line-through font-semibold">
                      {formatCurrency(listing.originalPrice)}
                    </span>
                  )}
                </div>

                {savings > 0 && listing.price > 0 && (
                  <div className="mt-2 text-xs font-bold text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-lg w-fit border border-emerald-300">
                    You save ~{formatCurrency(savings)} vs retail!
                  </div>
                )}

                {listing.deposit ? (
                  <div className="mt-2 text-xs text-slate-800 font-medium">
                    Refundable security deposit: <strong className="text-slate-950">{formatCurrency(listing.deposit)}</strong>
                  </div>
                ) : null}

                {listing.maxLendingDays ? (
                  <div className="mt-1 text-xs text-slate-800 font-medium">
                    Lending duration: up to <strong className="text-slate-950">{listing.maxLendingDays} days</strong>
                  </div>
                ) : null}
              </div>

              {/* Action Button */}
              {isOwner ? (
                <div className="p-3 bg-slate-100 rounded-xl text-center text-xs font-semibold text-slate-600">
                  This is your own listed resource.
                </div>
              ) : isAvailable ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <span>📱</span>
                    <span>{isBorrow ? 'Borrow Now (Direct WhatsApp)' : 'Request Resource'}</span>
                  </button>

                  {/* Direct WhatsApp Instant Action */}
                  <button
                    type="button"
                    onClick={() => {
                      const pt = pickupPoints.find((p) => p.id === listing.pickupPointPreferenceId) || pickupPoints[0];
                      sendWhatsAppNotification(pt.name);
                    }}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold py-2.5 rounded-2xl transition-all text-xs flex items-center justify-center gap-1.5"
                    title={`Send instant WhatsApp alert to ${listing.owner.name}`}
                  >
                    <span>💬 Direct Message on WhatsApp ({ownerWhatsApp})</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs font-semibold text-amber-800">
                  Currently Reserved by another student
                </div>
              )}
            </div>

            {/* Owner Verification Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Resource Owner
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={listing.owner.avatar}
                    alt={listing.owner.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  {listing.owner.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 fill-white absolute -bottom-1 -right-1" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-950 text-sm">{listing.owner.name}</h4>
                  <div className="text-xs text-slate-700 font-semibold">
                    {listing.owner.branch} • Semester {listing.owner.semester}
                  </div>
                  <div className="text-xs text-emerald-800 font-bold flex items-center gap-1 mt-0.5">
                    <span>📱 WhatsApp:</span>
                    <span className="font-mono">{ownerWhatsApp}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-950 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{listing.owner.rating}</span>
                  </div>
                  <div className="text-xs text-slate-700 font-semibold">Peer Rating</div>
                </div>

                <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-950">
                    {listing.owner.completedExchanges}
                  </div>
                  <div className="text-xs text-slate-700 font-semibold">Circulated</div>
                </div>
              </div>

              <div className="text-xs text-emerald-950 font-semibold bg-emerald-100 p-2.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Verified student at Acropolis Institute Of Technology and Research</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REQUEST RESOURCE MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Request Resource</h3>
                <p className="text-xs text-slate-500">Coordinate pickup with {listing.owner.name}</p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Item summary */}
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.images[0]} alt="item" className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-xs truncate">{listing.title}</div>
                  <div className="text-emerald-700 font-extrabold text-xs">
                    {listing.price === 0 ? 'FREE' : formatCurrency(listing.price)}
                  </div>
                </div>
              </div>

              {/* Campus Pickup Point Choice */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Designated Campus Pickup Point:
                </label>
                <select
                  value={selectedPickupPointId}
                  onChange={(e) => setSelectedPickupPointId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {pickupPoints.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name} — {pt.building}
                    </option>
                  ))}
                </select>
              </div>

              {/* Meeting Window */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Proposed Meeting Window:
                </label>
                <input
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="e.g. Tomorrow 2:00 PM – 3:00 PM"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Optional message */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Message to {listing.owner.name}:
                </label>
                <textarea
                  rows={2}
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-xs"
                >
                  {isSubmitting ? 'Sending Request...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT LISTING MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs sm:text-sm">
            <h3 className="font-bold text-base text-slate-900">Report Resource to Moderator</h3>
            {reportSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900">Report Logged</h4>
                <p className="text-xs text-slate-500">
                  Campus moderators have been notified and will review this listing.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="font-semibold block mb-1">Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  >
                    <option>Incorrect information or damaged condition</option>
                    <option>Counterfeit or unapproved edition</option>
                    <option>Duplicate or spam listing</option>
                    <option>Non-academic commercial product</option>
                    <option>Inappropriate or unsafe content</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Additional Details</label>
                  <textarea
                    rows={3}
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder="Provide details to assist campus moderators..."
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
