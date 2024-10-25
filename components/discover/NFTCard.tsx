'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, ExternalLink } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import Link from 'next/link';
import { NFT } from '@/types/nft';

interface NFTCardProps {
  nft: NFT;
  angle: number;
  radius: number;
}

export default function NFTCard({ nft, angle, radius }: NFTCardProps) {
  const { state: { currentTrack, isPlaying }, playTrack, togglePlay } = useAudio();
  const isCurrentTrack = currentTrack?.id === nft.id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack({
        id: nft.id,
        title: nft.title,
        artist: nft.artist,
        audioUrl: nft.audioUrl,
        imageUrl: nft.image,
        duration: '0:00',
      });
    }
  };

  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="absolute"
      style={{
        width: 200,
        height: 280,
        x: x - 100, // Center the card
        y: y - 140, // Center the card
      }}
      whileHover={{ scale: 1.1, zIndex: 10 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/marketplace/item/${nft.id}`}>
        <Card className="w-full h-full overflow-hidden bg-navy/80 border-cream/20 group">
          <div className="relative h-48">
            <img
              src={nft.image}
              alt={nft.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePlayClick}
            >
              {isCurrentTrack && isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-cream truncate">{nft.title}</h3>
            <p className="text-sm text-orange truncate">{nft.artist}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-cream">{nft.price} ETH</span>
              <ExternalLink className="h-4 w-4 text-cream opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}