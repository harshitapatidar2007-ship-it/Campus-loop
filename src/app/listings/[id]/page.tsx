import React, { Suspense } from 'react';
import { ListingDetailClient } from './ListingDetailClient';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense
      fallback={
        <div className="py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      }
    >
      <ListingDetailClient listingId={resolvedParams.id} />
    </Suspense>
  );
}
