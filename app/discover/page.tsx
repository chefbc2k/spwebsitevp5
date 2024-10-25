'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Play, Pause, Info } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import Link from 'next/link';

interface Collection {
  id: string;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
  description: string;
  price: number;
}

const collections: Collection[] = [
  {
    id: '1',
    title: "Ethereal Whispers",
    artist: "VoiceVirtuoso",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description: "A collection of ethereal vocal performances",
    price: 2.5
  },
  // Add more collections...
];

export default function TrendingCollections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { playTrack, togglePlay, state: { currentTrack, isPlaying } } = useAudio();

  const handlePlayClick = (collection: Collection) => {
    if (currentTrack?.id === collection.id) {
      togglePlay();
    } else {
      playTrack({
        id: collection.id,
        title: collection.title,
        artist: collection.artist,
        audioUrl: collection.audioUrl,
        imageUrl: collection.image,
        duration: '0:00'
      });
    }
  };

  return (
    <div className="space-y-12">
      {/* Featured Collection */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative aspect-[21/9] rounded-xl overflow-hidden"
        >
          <img
            src={collections[activeIndex].image}
            alt={collections[activeIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <h2 className="font-serif text-5xl font-bold text-cream mb-4">
              {collections[activeIndex].title}
            </h2>
            <p className="text-xl text-gray-200 mb-6 max-w-2xl">
              {collections[activeIndex].description}
            </p>
            <div className="flex space-x-4">
              <Button
                onClick={() => handlePlayClick(collections[activeIndex])}
                className="bg-yellow hover:bg-orange text-navy font-serif"
              >
                {currentTrack?.id === collections[activeIndex].id && isPlaying ? (
                  <><Pause className="mr-2" /> Pause Preview</>
                ) : (
                  <><Play className="mr-2" /> Play Preview</>
                )}
              </Button>
              <Button variant="outline" className="text-cream border-cream hover:bg-cream hover:text-navy font-serif">
                <Info className="mr-2" /> View Collection
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Horizontal Collection Scroll */}
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="flex space-x-6 p-4">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              whileHover={{ y: -10 }}
              className="relative flex-none w-80"
            >
              <div
                className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-xl font-bold text-cream mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">by {collection.artist}</p>
                    <p className="text-lg font-semibold text-yellow">{collection.price} ETH</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}