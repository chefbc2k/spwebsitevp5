'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Map, { NavigationControl, MapRef } from 'react-map-gl';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { NFTLocation, FilterState } from '@/types/marketplace';
import { filterCategories } from '@/lib/marketplace-constants';
import FilterSidebar from './marketplace/FilterSidebar';

const INITIAL_VIEW_STATE = {
  latitude: 0,
  longitude: 0,
  zoom: 2,
  bearing: 0,
  pitch: 0,
};

const initializeFilterState = (): FilterState => {
  const initialState: FilterState = {
    geographic: {
      continent: {},
      country: {},
      region: {}
    },
    speaker: {
      age: {},
      gender: {},
      education: {},
      languageLevel: {}
    },
    voice: {
      pitch: {},
      speed: {},
      clarity: {},
      emotion: {}
    },
    language: {
      primary: {},
      heritage: {},
      accent: {},
      dialect: {},
      pronunciation: {}
    },
    context: {
      style: {},
      format: {},
      purpose: {},
      background: {},
      accessibility: {}
    },
    cultural: {
      slang: {},
      mixedLanguages: {},
      localTerms: {},
      formality: {}
    },
    technical: {
      aiProcessed: {},
      processing: {},
      audioMix: {}
    }
  };

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('marketplaceFilters');
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Validate the structure matches our FilterState type
        if (parsedState && typeof parsedState === 'object') {
          return parsedState;
        }
      }
    } catch (error) {
      console.error('Error parsing saved filters:', error);
    }
  }

  return initialState;
};

export default function MarketplaceMap() {
  const mapRef = useRef<MapRef | null>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedNFT, setSelectedNFT] = useState<NFTLocation | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [locations, setLocations] = useState<NFTLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<NFTLocation[]>([]);
  const [filters, setFilters] = useState<FilterState>(initializeFilterState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/nft-locations');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid data format received from server');

      setLocations(data);
      setFilteredLocations(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch NFT locations';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const applyFilters = useCallback(() => {
    const newFilteredLocations = locations.filter((location) => {
      // Add your filter logic here based on the filters state
      return true; // For now, return all locations
    });

    setFilteredLocations(newFilteredLocations);
  }, [locations]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  const handleMapLoad = () => setIsMapLoaded(true);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  if (typeof window === 'undefined') return null;

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClose={() => setShowSidebar(false)}
        showSidebar={showSidebar}
      />

      {!showSidebar && (
        <Button
          variant="ghost"
          className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-900"
          onClick={() => setShowSidebar(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {error && (
        <div className="absolute top-4 right-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onLoad={handleMapLoad}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <NavigationControl />

        {isMapLoaded &&
          !isLoading &&
          filteredLocations.map((nft) => (
            <NFTMarker
              key={nft.id}
              nft={nft}
              isSelected={selectedNFT?.id === nft.id}
              onClick={() => setSelectedNFT(nft)}
              onClose={() => setSelectedNFT(null)}
            />
          ))}

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow"></div>
          </div>
        )}
      </Map>
    </div>
  );
}