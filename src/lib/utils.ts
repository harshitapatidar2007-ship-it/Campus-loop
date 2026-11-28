import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getConditionBadgeColor(condition: string): string {
  switch (condition) {
    case 'new':
      return 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold';
    case 'like_new':
      return 'bg-teal-100 text-teal-950 border-teal-400 font-bold';
    case 'good':
      return 'bg-blue-100 text-blue-950 border-blue-400 font-bold';
    case 'fair':
      return 'bg-amber-100 text-amber-950 border-amber-400 font-bold';
    case 'heavily_used':
      return 'bg-orange-100 text-orange-950 border-orange-400 font-bold';
    default:
      return 'bg-slate-200 text-slate-950 border-slate-400 font-bold';
  }
}

export function getModeBadgeColor(mode: string): string {
  switch (mode) {
    case 'sell':
      return 'bg-emerald-700 text-white font-bold tracking-wide';
    case 'borrow':
      return 'bg-indigo-700 text-white font-bold tracking-wide';
    case 'donate':
    case 'free_giveaway':
      return 'bg-purple-700 text-white font-bold tracking-wide';
    case 'rent':
      return 'bg-amber-700 text-white font-bold tracking-wide';
    case 'exchange':
      return 'bg-cyan-700 text-white font-bold tracking-wide';
    default:
      return 'bg-slate-800 text-white font-bold tracking-wide';
  }
}
