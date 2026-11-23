'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Heart, Sparkles, MapPin, Recycle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-auto pt-16 pb-12 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Vision */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                ⟲
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Campus<span className="text-emerald-500">Loop</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Campus-verified peer-to-peer academic resource circulation platform. Giving textbooks, lab coats, and engineering equipment another semester.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
              <Recycle className="w-4 h-4" />
              <span>Give resources another semester.</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Explore Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/marketplace?category=textbooks" className="hover:text-white transition-colors">Core Textbooks</Link></li>
              <li><Link href="/marketplace?category=engineering_drawing" className="hover:text-white transition-colors">Engineering Drafters & Tools</Link></li>
              <li><Link href="/marketplace?category=calculators" className="hover:text-white transition-colors">Scientific Calculators</Link></li>
              <li><Link href="/marketplace?category=lab_coats" className="hover:text-white transition-colors">Lab Coats & Kits</Link></li>
              <li><Link href="/marketplace?category=electronics_kits" className="hover:text-white transition-colors">Electronics & IoT Kits</Link></li>
            </ul>
          </div>

          {/* Col 3: Safe Campus Operations */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Campus Network</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/locations" className="hover:text-white transition-colors">Designated Safe Pickup Points</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">Two-Sided OTP Handover Protocol</Link></li>
              <li><Link href="/impact" className="hover:text-white transition-colors">Affordability & Environmental Methodology</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Institutional Email Verification</Link></li>
            </ul>
          </div>

          {/* Col 4: Campus Information */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Active University</h4>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="font-semibold text-white">Apex Institute of Technology</div>
              <div className="text-slate-400">North Campus, New Delhi</div>
              <div className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Official Student Exchange Active
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 CampusLoop Platform. Built for University Resource Circularity.
          </div>
          <div className="flex items-center gap-6">
            <span>Pass knowledge forward, not just textbooks.</span>
            <span>Made with 💚 for students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
