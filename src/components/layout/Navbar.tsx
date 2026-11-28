'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCampusStore } from '@/lib/store/campus-store';
import {
  BookOpen,
  PlusCircle,
  Bell,
  MessageSquare,
  Sparkles,
  MapPin,
  TrendingUp,
  Heart,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  CheckCheck,
} from 'lucide-react';
import { CampusLoopAssistantModal } from '../ai/CampusLoopAssistantModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { activeUser, notifications, markAllNotificationsRead, markNotificationRead } = useCampusStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const unreadCount = mounted ? notifications.filter((n) => !n.isRead).length : 0;

  const navLinks = [
    { label: 'Marketplace', href: '/marketplace', icon: BookOpen },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    { label: 'Pickup Points', href: '/locations', icon: MapPin },
    { label: 'Campus Impact', href: '/impact', icon: TrendingUp },
  ];

  if (mounted && activeUser.role === 'moderator') {
    navLinks.push({ label: 'Moderation Portal', href: '/moderator', icon: ShieldCheck });
  }
  if (mounted && activeUser.role === 'admin') {
    navLinks.push({ label: 'Admin Portal', href: '/admin', icon: ShieldCheck });
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-8 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <span className="text-xl font-bold tracking-tighter">⟲</span>
              </div>
              <div>
                <span className="text-lg font-bold text-slate-950 tracking-tight flex items-center gap-1.5">
                  Campus<span className="text-emerald-700">Loop</span>
                </span>
                <span className="hidden sm:block text-[11px] text-slate-700 font-semibold tracking-wide">
                  Give resources another semester
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs'
                        : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-700" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Button */}
            <button
              onClick={() => setShowAIModal(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 hover:border-emerald-400 text-emerald-950 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all hover:shadow-sm"
              title="Ask CampusLoop Intelligence"
            >
              <Sparkles className="w-4 h-4 text-emerald-700 animate-pulse" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Messages Icon */}
            <Link
              href="/messages"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Campus Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-1">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No notifications yet.</div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <Link
                          key={n.id}
                          href={n.link}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setShowNotifications(false);
                          }}
                          className={`block p-2.5 rounded-lg text-xs hover:bg-slate-50 transition-colors ${
                            !n.isRead ? 'bg-emerald-50/50 font-medium' : ''
                          }`}
                        >
                          <div className="text-slate-900 font-semibold">{n.title}</div>
                          <div className="text-slate-600 mt-0.5">{n.message}</div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* List an Item CTA */}
            <Link
              href="/listings/create"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-sm transition-all hover:shadow hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Item</span>
            </Link>

            {/* User Avatar & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mounted ? activeUser.avatar : ''}
                  alt={mounted ? activeUser.name : ''}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div className="hidden lg:block text-left text-xs">
                  <div className="font-semibold text-slate-800 leading-tight">{mounted ? activeUser.name : ''}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{mounted ? activeUser.role : ''}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-xs">
                  <div className="p-2 border-b border-slate-100">
                    <div className="font-semibold text-slate-900">{activeUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{activeUser.email}</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {activeUser.isVerified ? 'Campus Verified Student' : 'Unverified Account'}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Dashboard</span>
                    </Link>
                    <Link
                      href="/my-listings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>My Listings</span>
                    </Link>
                    <Link
                      href="/requests"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      <Sparkles className="w-4 h-4 text-slate-400" />
                      <span>My Requests & Reservations</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      <span>Profile & Verification</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/listings/create"
              onClick={() => setShowMobileMenu(false)}
              className="block w-full text-center bg-emerald-600 text-white font-medium py-2 rounded-xl text-sm"
            >
              + List an Item
            </Link>
          </div>
        )}
      </header>

      {/* CampusLoop Intelligence AI Modal */}
      {showAIModal && <CampusLoopAssistantModal onClose={() => setShowAIModal(false)} />}
    </>
  );
};
