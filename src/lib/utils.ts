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
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'like_new':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'good':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'fair':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'heavily_used':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export function getModeBadgeColor(mode: string): string {
  switch (mode) {
    case 'sell':
      return 'bg-emerald-600 text-white';
    case 'borrow':
      return 'bg-indigo-600 text-white';
    case 'donate':
    case 'free_giveaway':
      return 'bg-purple-600 text-white';
    case 'rent':
      return 'bg-amber-600 text-white';
    case 'exchange':
      return 'bg-cyan-600 text-white';
    default:
      return 'bg-slate-700 text-white';
  }
}
