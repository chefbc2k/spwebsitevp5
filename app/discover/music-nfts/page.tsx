'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowUpDown, Play, Pause, Info } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import Link from 'next/link';

interface MusicNFT {
  id: string;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
  price: number;
  genre: string;
  totalPlays: number;
  announcement?: string;
}

const musicNFTs: MusicNFT[] = [
  {
    id: '1',
    title: "Ethereal Whispers",
    artist: "VoiceVirtuoso",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    price: 0.5,
    genre: "Ambient Voice",
    totalPlays: 1200,
    announcement: "Featured Artist of the Week!"
  },
  {
    id: '2',
    title: "Digital Echoes",
    artist: "SoundScribe",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    price: 0.7,
    genre: "Electronic Voice",
    totalPlays: 980,
    announcement: "New Release - Listen Now!"
  },
  {
    id: '3',
    title: "Vocal Landscapes",
    artist: "AudioAlchemist",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    price: 0.3,
    genre: "Experimental",
    totalPlays: 750
  }
];

export default function MusicNFTShowcase() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'plays' | 'price'>('plays');
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const { playTrack, togglePlay, state: { currentTrack, isPlaying } } = useAudio();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => 
        (prev + 1) % musicNFTs.filter(nft => nft.announcement).length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayClick = (nft: MusicNFT) => {
    if (currentTrack?.id === nft.id) {
      togglePlay();
    } else {
      playTrack({
        id: nft.id,
        title: nft.title,
        artist: nft.artist,
        audioUrl: nft.audioUrl,
        imageUrl: nft.image,
        duration: '0:00'
      });
    }
  };

  const filteredNFTs = musicNFTs
    .filter(nft => 
      nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.genre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'plays') return b.totalPlays - a.totalPlays;
      return b.price - a.price;
    });

  const NFTCard = ({ nft }: { nft: MusicNFT }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      <Link href={`/nft/${nft.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <img 
            src={nft.image} 
            alt={nft.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{nft.title}</h3>
            <p className="text-sm text-gray-300 mb-2">by {nft.artist}</p>
            <p className="text-sm text-gray-300 mb-4">{nft.genre}</p>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">{nft.price} ETH</p>
              <p className="text-sm">{nft.totalPlays} plays</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              handlePlayClick(nft);
            }}
          >
            {currentTrack?.id === nft.id && isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Announcements Banner */}
      <AnimatePresence mode="wait">
        {musicNFTs[currentAnnouncement]?.announcement && (
          <motion.div
            key={currentAnnouncement}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gradient-to-r from-yellow to-orange text-navy p-4 rounded-lg mb-8"
          >
            <p className="text-center font-bold">
              {musicNFTs[currentAnnouncement].announcement}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search music NFTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setSortBy(sortBy === 'plays' ? 'price' : 'plays')}
        >
          Sort by {sortBy === 'plays' ? 'Price' : 'Plays'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* NFTs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3]">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          ))
        ) : (
          filteredNFTs.map(nft => (
            <NFTCard key={nft.id} nft={nft} />
          ))
        )}
      </div>
    </div>
  );
}