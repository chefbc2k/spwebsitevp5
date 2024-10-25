'use client';

import { useState, useEffect } from 'react';
import { motion, MotionValue, useSpring, useTransform } from 'framer-motion';
import NFTCard from './NFTCard';
import { NFT } from '@/types/nft';

interface RadialGalleryProps {
  nfts: NFT[];
}

export default function RadialGallery({ nfts }: RadialGalleryProps) {
  const [radius, setRadius] = useState(300);
  const mouseX = useSpring(0);
  const rotation = useSpring(0);

  useEffect(() => {
    const handleResize = () => {
      const newRadius = window.innerWidth < 768 ? 150 : 300;
      setRadius(newRadius);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const rotationValue = ((e.clientX - centerX) / centerX) * 30;
    rotation.set(rotationValue);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="relative"
        style={{
          width: radius * 2,
          height: radius * 2,
          rotate: rotation
        }}
      >
        {nfts.map((nft, index) => {
          const angle = (2 * Math.PI * index) / nfts.length;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <NFTCard
              key={nft.id}
              nft={nft}
              angle={angle}
              radius={radius}
            />
          );
        })}
      </motion.div>
    </div>
  );
}