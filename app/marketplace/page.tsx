'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Grid, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import MarketplaceMap with no SSR
const MarketplaceMap = dynamic(
  () => import('@/components/MarketplaceMap'),
  { ssr: false }
);

export default function Marketplace() {
  const [view, setView] = useState<'map'>('map');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">house Marketplace</h1>
          <div className="flex space-x-2">
            <Button
              variant={view === 'map' ? 'default' : 'outline'}
              onClick={() => setView('map')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Map View
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-[800px] rounded-lg overflow-hidden">
            <MarketplaceMap />
          </div>
        </motion.div>
      </div>
    </div>
  );
}