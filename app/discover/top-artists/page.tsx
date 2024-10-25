'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

interface Artist {
  id: string;
  name: string;
  image: string;
  totalSales: number;
  genre: string;
  announcement?: string;
}

const artists: Artist[] = [
  { 
    id: '1',
    name: "VoiceVirtuoso",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
    totalSales: 1000,
    genre: "Narration",
    announcement: "New Audiobook Series Coming Soon!"
  },
  { 
    id: '2',
    name: "SoundScribe",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    totalSales: 850,
    genre: "Voice Acting",
    announcement: "Live Voice Acting Workshop Next Week"
  },
  { 
    id: '3',
    name: "AudioAlchemist",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    totalSales: 720,
    genre: "Character Voices",
    announcement: "Join the Character Voice Challenge"
  }
];

export default function TopArtists() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'sales' | 'name'>('sales');
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => 
        (prev + 1) % artists.filter(a => a.announcement).length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredArtists = artists
    .filter(artist => 
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'sales') return b.totalSales - a.totalSales;
      return a.name.localeCompare(b.name);
    });

  const ArtistCard = ({ artist }: { artist: Artist }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      <Link href={`/artist/${artist.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <img 
            src={artist.image} 
            alt={artist.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{artist.name}</h3>
            <p className="text-sm text-gray-300 mb-2">{artist.genre}</p>
            <p className="text-lg font-semibold">{artist.totalSales} Sales</p>
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="sm">View Profile</Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Announcements Banner */}
      <AnimatePresence mode="wait">
        {artists[currentAnnouncement]?.announcement && (
          <motion.div
            key={currentAnnouncement}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gradient-to-r from-yellow to-orange text-navy p-4 rounded-lg mb-8"
          >
            <p className="text-center font-bold">
              {artists[currentAnnouncement].announcement}
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
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setSortBy(sortBy === 'sales' ? 'name' : 'sales')}
        >
          Sort by {sortBy === 'sales' ? 'Name' : 'Sales'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3]">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          ))
        ) : (
          // Actual artist cards
          filteredArtists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))
        )}
      </div>
    </div>
  );
}