'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCampusStore } from '@/lib/store/campus-store';
import { HandoverTimeline } from '@/components/transactions/HandoverTimeline';
import { HandoverOtpCard } from '@/components/transactions/HandoverOtpCard';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const TransactionClient: React.FC<{ requestId: string }> = ({ requestId }) => {
  const {
    requests,
    activeUser,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    initiateReturn,
    confirmReturn,
    chatMessages,
    sendChatMessage,
    pickupPoints,
  } = useCampusStore();

  const request = requests.find((r) => r.id === requestId);

  const [messageInput, setMessageInput] = useState('');
  const [returnCodeInput, setReturnCodeInput] = useState('');
  const [returnError, setReturnError] = useState('');

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Transaction Not Found</h2>
        <p className="text-sm text-slate-500">
          This request may have been completed, cancelled, or you might not be signed in as the participating student.
        </p>
        <Link
          href="/requests"
          className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-medium px-4 py-2 rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to My Requests</span>
        </Link>
      </div>
    );
  }

  const isOwner = activeUser.id === request.ownerId;
  const isRequester = activeUser.id === request.requesterId;
  const isBorrow = request.requestedMode === 'borrow' || request.requestedMode === 'lend';
  const messages = chatMessages[request.id] || [];

  const handleSendMessage = (contentToSend?: string) => {
    const text = contentToSend || messageInput;
    if (!text.trim()) return;
    sendChatMessage(request.id, text);
    setMessageInput('');
  };

  const handleConfirmReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnError('');
    const res = confirmReturn(request.id, returnCodeInput);
    if (!res.success) {
      setReturnError(res.error || 'Failed to verify return code.');
    }
  };

  const quickChatPrompts = [
    'Can we meet near Central Library entrance?',
    'I will be there in 5 minutes at the designated spot.',
    'Could we meet around 2:30 PM tomorrow instead?',
    'Item checked and in great condition!',
  ];

  return (
    <div className="bg-slate-50/60 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Top Back Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/requests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Requests & Reservations</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Transaction ID:</span>
            <span className="font-mono text-xs bg-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-semibold">
              {request.id}
            </span>
          </div>
        </div>

        {/* DEMO NOTICE BANNER (Helps judges seamlessly switch) */}
        <div className="p-3 bg-amber-50 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[10px]">
              DEMO GUIDE
            </span>
            <span>
              {isOwner && request.status === 'REQUESTED' && (
                <>You are viewing as <strong>Priya (Owner)</strong>. Click &quot;Accept Request&quot; below to generate the 6-digit OTP code.</>
              )}
              {isOwner && (request.status === 'HANDOVER_PENDING' || request.status === 'ACCEPTED') && (
                <>You are <strong>Priya (Owner)</strong>. Switch to <strong>Aarav</strong> on top bar to see his 6-digit code, then enter it here to complete the handover.</>
              )}
              {isRequester && (request.status === 'HANDOVER_PENDING' || request.status === 'ACCEPTED') && (
                <>You are <strong>Aarav (Requester)</strong>. Show your 6-digit code below to Priya to verify physical handover.</>
              )}
              {request.status === 'COMPLETED' && (
                <>Transaction completed! Money saved and campus circularity stats have updated dynamically.</>
              )}
            </span>
          </div>
        </div>

        {/* Top Stepper Timeline */}
        <HandoverTimeline status={request.status} isBorrowMode={isBorrow} />

        {/* Main Grid: Handover / Resource Details + Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Handover Actions & Resource Summary */}
          <div className="lg:col-span-7 space-y-6">
            {/* If Owner and status is REQUESTED: Show Accept / Decline Card */}
            {isOwner && request.status === 'REQUESTED' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Incoming Reservation Request</h3>
                    <p className="text-xs text-slate-500">
                      {request.requester.name} wants to {request.requestedMode} this resource.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-700">
                  <div><strong>Proposed Meeting Point:</strong> {request.proposedPickupPointName}</div>
                  <div><strong>Proposed Time:</strong> {request.proposedPickupTime}</div>
                  {request.requesterMessage && (
                    <div><strong>Message:</strong> &quot;{request.requesterMessage}&quot;</div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => rejectRequest(request.id, 'Resource unavailable at proposed time.')}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-xs transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => acceptRequest(request.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition-all hover:scale-[1.02]"
                  >
                    Accept Request & Generate Code
                  </button>
                </div>
              </div>
            )}

            {/* Handover OTP Card */}
            {request.status !== 'REQUESTED' && (
              <HandoverOtpCard request={request} currentUser={activeUser} />
            )}

            {/* Return Workflow Card (For Borrow Mode) */}
            {isBorrow && request.status === 'RETURN_PENDING' && (
              <div className="bg-white rounded-3xl border border-indigo-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
                  <RotateCcw className="w-5 h-5 text-indigo-600" />
                  <span>Borrowing Return Verification</span>
                </div>
                <p className="text-xs text-slate-600">
                  Due Date: <strong>{formatDate(request.returnDueDate || '')}</strong>. Once the borrower returns the book to the owner, the owner enters the return code to release the deposit.
                </p>

                {isRequester ? (
                  <div className="p-4 bg-indigo-50 rounded-2xl text-center space-y-1">
                    <span className="text-xs text-indigo-700 font-semibold">Your Return Code:</span>
                    <div className="text-3xl font-mono font-black text-indigo-900 tracking-wider">
                      {request.returnHandoverCode || '729104'}
                    </div>
                    <span className="text-[11px] text-slate-500">Show this to {request.owner.name} upon return.</span>
                  </div>
                ) : isOwner ? (
                  <form onSubmit={handleConfirmReturnSubmit} className="space-y-3">
                    <label className="text-xs font-semibold block text-slate-800">
                      Enter Borrower&apos;s Return Code:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={returnCodeInput}
                        onChange={(e) => setReturnCodeInput(e.target.value)}
                        placeholder="e.g. 729104"
                        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                      >
                        Confirm Return
                      </button>
                    </div>
                    {returnError && <div className="text-xs text-rose-600">{returnError}</div>}
                  </form>
                ) : null}
              </div>
            )}

            {/* Resource & Transaction Metadata Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Resource Summary</h3>

              <div className="flex gap-4 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={request.listing.images[0]}
                  alt={request.listing.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">
                    {request.listing.title}
                  </h4>
                  <div className="text-xs text-slate-500">
                    {request.listing.subject} ({request.listing.courseCode})
                  </div>
                  <div className="flex gap-2 items-center text-xs">
                    <span className="font-extrabold text-emerald-700">
                      {request.listing.price === 0 ? 'FREE' : formatCurrency(request.listing.price)}
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {request.listing.condition}
                    </span>
                  </div>
                </div>
              </div>

              {/* Meeting Details */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Campus Pickup Location:</span>
                    <span>{request.confirmedPickupPointName || request.proposedPickupPointName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Confirmed Pickup Window:</span>
                    <span>{request.confirmedPickupTime || request.proposedPickupTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): In-Context Campus Chat */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[580px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  💬
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    Pickup Coordination Chat
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Messaging between {request.requester.name} and {request.owner.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No chat messages yet. Send a message to coordinate exact spot.
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = m.senderId === activeUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5">{m.senderName}</span>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          isMine
                            ? 'bg-emerald-600 text-white rounded-br-xs'
                            : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick response suggestions */}
            <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/40 flex gap-1.5 overflow-x-auto text-[11px]">
              {quickChatPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-800 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 border-t border-slate-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a coordination message..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
