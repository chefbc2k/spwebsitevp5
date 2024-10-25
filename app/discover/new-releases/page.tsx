'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Pause, Info } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

interface Release {
  id: string;
  title: string;
  artist: string;
  image: string;
  category: 'Animation' | 'Movies' | 'Audiobooks';
  audioPreview: string;
  description: string;
  releaseDate: string;
}

const releases: Release[] = [
  {
    id: '1',
    title: "The Last Guardian",
    artist: "VoiceVirtuoso",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
    category: "Animation",
    audioPreview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description: "An epic fantasy animation featuring stunning voice performances",
    releaseDate: "2024-02-01"
  },
  {
    id: '2',
    title: "Neon Dreams",
    artist: "SoundScribe",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    category: "Movies",
    audioPreview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    description: "A cyberpunk thriller with immersive voice acting",
    releaseDate: "2024-02-02"
  },
  {
    id: '3',
    title: "The Midnight Library",
    artist: "AudioAlchemist",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    category: "Audiobooks",
    audioPreview: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    description: "A captivating audiobook about infinite possibilities",
    releaseDate: "2024-02-03"
  }
];

export default function NewReleases() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Release['category']>('Animation');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { playTrack, togglePlay, state: { currentTrack, isPlaying } } = useAudio();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        (prev + 1) % releases.filter(r => r.category === selectedCategory).length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const handlePlayClick = (release: Release) => {
    if (currentTrack?.id === release.id) {
      togglePlay();
    } else {
      playTrack({
        id: release.id,
        title: release.title,
        artist: release.artist,
        audioUrl: release.audioPreview,
        imageUrl: release.image,
        duration: '0:00'
      });
    }
  };

  const filteredReleases = releases.filter(r => r.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Release['category'])}>
        <TabsList className="mb-8">
          <TabsTrigger value="Animation">Animation</TabsTrigger>
          <TabsTrigger value="Movies">Movies</TabsTrigger>
          <TabsTrigger value="Audiobooks">Audiobooks</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Hero Section */}
      <div className="relative aspect-[21/9] mb-12 overflow-hidden rounded-lg">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              <img
                src={filteredReleases[currentSlide].image}
                alt={filteredReleases[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {filteredReleases[currentSlide].title}
                </h2>
                <p className="text-xl text-gray-200 mb-4">
                  {filteredReleases[currentSlide].description}
                </p>
                <div className="flex space-x-4">
                  <Button
                    onClick={() => handlePlayClick(filteredReleases[currentSlide])}
                    className="bg-yellow hover:bg-orange text-navy"
                  >
                    {currentTrack?.id === filteredReleases[currentSlide].id && isPlaying ? (
                      <><Pause className="mr-2" /> Pause Preview</>
                    ) : (
                      <><Play className="mr-2" /> Play Preview</>
                    )}
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-navy">
                    <Info className="mr-2" /> More Info
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))
        ) : (
          filteredReleases.map((release) => (
            <motion.div
              key={release.id}
              whileHover={{ scale: 1.05 }}
              className="relative group cursor-pointer"
              onClick={() => handlePlayClick(release)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={release.image}
                  alt={release.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {currentTrack?.id === release.id && isPlaying ? (
                    <Pause className="w-12 h-12 text-white" />
                  ) : (
                    <Play className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-semibold truncate">{release.title}</h3>
                <p className="text-sm text-gray-500">{release.artist}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}