'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, ExternalLink } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import Link from 'next/link';
import type { NFTLocation } from '@/types/marketplace';

interface NFTPreviewCardProps {
  nft: NFTLocation;
  onClose: () => void;
}

export default function NFTPreviewCard({ nft, onClose }: NFTPreviewCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(nft.audioPreview));

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-72"
    >
      <Card className="bg-white dark:bg-gray-900 shadow-lg">
        <div className="relative">
          <img
            src={nft.image}
            alt={nft.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-2 right-2"
            onClick={handlePlayToggle}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{nft.title}</h3>
          <p className="text-sm text-gray-500 mb-2">By {nft.artist}</p>
          
          <div className="mb-3">
            <p className="text-sm line-clamp-2">{nft.description}</p>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="secondary">{nft.metadata.language.primary}</Badge>
            <Badge variant="secondary">{nft.metadata.voice.emotion}</Badge>
            <Badge variant="secondary">{nft.metadata.technical.audioMix}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">{nft.price} ETH</span>
            <Link href={`/marketplace/item/${nft.id}`}>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}