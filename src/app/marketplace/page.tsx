import React, { Suspense } from 'react';
import { MarketplaceClient } from './MarketplaceClient';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Campus Marketplace — CampusLoop',
  description: 'Explore textbooks, drawing kits, calculators, and lab gear circulating across the university.',
};

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      }
    >
      <MarketplaceClient />
    </Suspense>
  );
}
