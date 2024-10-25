'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, ArrowUpDown, Clock, TrendingUp } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  creator: string;
  image: string;
  category: string;
  price: number;
  volume: number;
  items: number;
}

interface Transaction {
  id: string;
  collectionId: string;
  type: 'sale' | 'listing' | 'offer';
  price: number;
  timestamp: Date;
  buyer?: string;
  seller?: string;
}

const collections: Collection[] = [
  {
    id: '1',
    name: "Voice Pioneers",
    creator: "VoiceVirtuoso",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
    category: "Narration",
    price: 0.5,
    volume: 1000,
    items: 100
  },
  {
    id: '2',
    name: "Sound Sculptures",
    creator: "SoundScribe",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    category: "Voice Acting",
    price: 0.7,
    volume: 800,
    items: 80
  }
];

const transactions: Transaction[] = [
  {
    id: '1',
    collectionId: '1',
    type: 'sale',
    price: 0.5,
    timestamp: new Date(),
    buyer: '0x123...',
    seller: '0x456...'
  },
  {
    id: '2',
    collectionId: '2',
    type: 'listing',
    price: 0.7,
    timestamp: new Date(),
    seller: '0x789...'
  }
];

export default function TrendingCollections() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'volume' | 'price'>('volume');
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredCollections = collections
    .filter(collection =>
      (collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       collection.creator.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategories.length === 0 || selectedCategories.includes(collection.category))
    )
    .sort((a, b) => {
      if (sortBy === 'volume') return b.volume - a.volume;
      return b.price - a.price;
    });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {showSidebar && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-64 bg-white p-4 shadow-lg"
          >
            <ScrollArea className="h-[calc(100vh-2rem)]">
              <Accordion type="single" collapsible>
                <AccordionItem value="categories">
                  <AccordionTrigger>Categories</AccordionTrigger>
                  <AccordionContent>
                    {['Narration', 'Voice Acting', 'Character Voices'].map(category => (
                      <div key={category} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <span>{category}</span>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                {/* Add more filter sections as needed */}
              </Accordion>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Filter className="mr-2" />
            Filters
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSortBy(sortBy === 'volume' ? 'price' : 'volume')}
          >
            <ArrowUpDown className="mr-2" />
            Sort by {sortBy === 'volume' ? 'Price' : 'Volume'}
          </Button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))
          ) : (
            filteredCollections.map(collection => (
              <motion.div
                key={collection.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative aspect-video">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{collection.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">by {collection.creator}</p>
                  <div className="flex justify-between text-sm">
                    <span>Floor: {collection.price} ETH</span>
                    <span>Items: {collection.items}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Transaction Feed */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {transactions.map(transaction => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {transaction.type === 'sale' ? (
                    <TrendingUp className="text-green-500" />
                  ) : (
                    <Clock className="text-blue-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.buyer ? `${transaction.buyer} bought from ${transaction.seller}` : `Listed by ${transaction.seller}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{transaction.price} ETH</p>
                  <p className="text-sm text-gray-500">
                    {transaction.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}