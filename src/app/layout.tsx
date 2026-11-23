import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { CampusStoreProvider } from '@/lib/store/campus-store';
import { DemoBar } from '@/components/demo/DemoBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'CampusLoop — University Circular Economy & Academic Resource Exchange',
  description:
    'Campus-verified peer-to-peer academic resource circulation platform. Buy, borrow, lend, and donate textbooks, calculators, drafters, and lab equipment.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <body className="min-h-full flex flex-col font-sans">
        <CampusStoreProvider>
          <DemoBar />
          <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </CampusStoreProvider>
      </body>
    </html>
  );
}
