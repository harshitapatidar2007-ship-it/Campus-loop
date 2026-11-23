'use client';

import React, { useState } from 'react';
import { useCampusStore } from '@/lib/store/campus-store';
import { askCampusLoopIntelligence, AIQueryResponse } from '@/lib/ai/gemini-assistant';
import { Sparkles, Send, X, Bot, ArrowRight, Loader2, BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, getConditionBadgeColor } from '@/lib/utils';

interface CampusLoopAssistantModalProps {
  onClose: () => void;
}

export const CampusLoopAssistantModal: React.FC<CampusLoopAssistantModalProps> = ({ onClose }) => {
  const { listings, activeUser } = useCampusStore();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIQueryResponse | null>(null);

  const samplePrompts = [
    'Find a DBMS reference book for 4th-semester CSE under ₹300',
    'Where can I borrow a scientific calculator for exams?',
    'I have ₹800. Find what I need for engineering drawing',
    'Suggest resources that I can get completely free',
  ];

  const handleAsk = async (promptToUse?: string) => {
    const q = promptToUse || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await askCampusLoopIntelligence(
        q,
        listings,
        activeUser.branch,
        activeUser.semester
      );
      setResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                CampusLoop Intelligence
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-medium px-2 py-0.5 rounded-full border border-emerald-400/30">
                  AI Academic Advisor
                </span>
              </h3>
              <p className="text-xs text-emerald-100/80">
                Connected to {listings.length} real campus listings at Apex Institute
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Conversation Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Prompts */}
          {!response && !isLoading && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Try asking the campus intelligence:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {samplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setQuery(prompt);
                      handleAsk(prompt);
                    }}
                    className="p-3 text-left bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl text-xs text-slate-700 hover:text-emerald-900 transition-all font-medium flex items-center justify-between group"
                  >
                    <span>&quot;{prompt}&quot;</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <div className="text-sm font-semibold text-slate-800">
                Analyzing campus listings & curriculum compatibility...
              </div>
              <p className="text-xs text-slate-400">
                Validating branch match for {activeUser.branch} and semester {activeUser.semester}
              </p>
            </div>
          )}

          {/* Results Box */}
          {response && (
            <div className="space-y-4 animate-in fade-in">
              {/* Answer Bubble */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-900">
                  <Bot className="w-4 h-4 text-emerald-600" />
                  <span>Campus Advisor Response:</span>
                </div>
                <div
                  className="prose prose-xs max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: response.answer
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>'),
                  }}
                />
              </div>

              {/* Matched Listings Cards */}
              {response.matchedListings.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Verified Campus Matches ({response.matchedListings.length}):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {response.matchedListings.map((item) => (
                      <Link
                        key={item.id}
                        href={`/listings/${item.id}`}
                        onClick={onClose}
                        className="p-3 bg-white border border-slate-200 hover:border-emerald-400 rounded-xl shadow-xs hover:shadow-sm transition-all flex items-start gap-3 group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-14 h-14 rounded-lg object-cover ring-1 ring-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{item.subject}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-extrabold text-emerald-700 text-xs">
                              {item.price === 0 ? 'FREE' : formatCurrency(item.price)}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded border uppercase font-semibold ${getConditionBadgeColor(item.condition)}`}>
                              {item.condition}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up suggestions */}
              {response.suggestions.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs text-slate-500 font-medium mb-1.5">Suggested next queries:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {response.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setQuery(s);
                          handleAsk(s);
                        }}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything: textbooks, drafter sets, calculator loans, budget..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-xs transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
