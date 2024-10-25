'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Marker, Popup } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NFTPreviewCard from './NFTPreviewCard';
import type { NFTLocation } from '@/types/marketplace';

interface NFTMarkerProps {
  nft: NFTLocation;
  isSelected: boolean;
  onClick: () => void;
  onClose: () => void;
}

export default function NFTMarker({
  nft,
  isSelected,
  onClick,
  onClose
}: NFTMarkerProps) {
  return (
    <>
      <Marker
        latitude={nft.latitude}
        longitude={nft.longitude}
        anchor="bottom"
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-yellow hover:text-orange"
          onClick={onClick}
        >
          <MapPin className="h-6 w-6" />
        </Button>
      </Marker>

      <AnimatePresence>
        {isSelected && (
          <Popup
            latitude={nft.latitude}
            longitude={nft.longitude}
            anchor="bottom"
            onClose={onClose}
            closeButton={false}
            className="marker-popup"
          >
            <NFTPreviewCard nft={nft} onClose={onClose} />
          </Popup>
        )}
      </AnimatePresence>
    </>
  );
}