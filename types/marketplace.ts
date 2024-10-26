export interface NFTLocation {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  artist: string;
  price: number;
  image: string;
  audioPreview: string;
  audioFull: string;
  description: string;
  metadata: {
    geographic: {
      continent: string;
      country: string;
      region: string;
    };
    speaker: {
      age: string;
      gender: string;
      education: string;
      languageLevel: string;
    };
    voice: {
      pitch: string;
      speed: string;
      clarity: string;
      emotion: string;
    };
    language: {
      primary: string;
      heritage: string;
      accent: string;
      dialect: string;
      pronunciation: string;
    };
    context: {
      style: string;
      format: string;
      purpose: string;
      background: string;
      accessibility: string[];
    };
    cultural: {
      slang: boolean;
      mixedLanguages: string[];
      localTerms: boolean;
      formality: string;
    };
    technical: {
      aiProcessed: boolean;
      processing: string[];
      audioMix: string;
      quality: {
        bitrate: number;
        sampleRate: number;
        channels: number;
      };
    };
  };
  rating: number;
  cluster?: {
    count: number;
    expansionZoom: number;
  };
}

export interface Category {
  name: string;
  subcategories: string[];
}

export interface FilterSection {
  [key: string]: Record<string, boolean>;
}

export interface FilterState {
  voiceTraits?: {
    pitch: Record<string, boolean>;
    texture: Record<string, boolean>;
    volume: Record<string, boolean>;
    versatility: Record<string, boolean>;
  };
  locationLanguage?: {
    language: Record<string, boolean>;
    secondaryLanguages: Record<string, boolean>;
    regionalDialect: Record<string, boolean>;
    timeZone: Record<string, boolean>;
    studioAvailability: Record<string, boolean>;
  };
  styleTone?: {
    commercial: Record<string, boolean>;
    narration: Record<string, boolean>;
    character: Record<string, boolean>;
    corporate: Record<string, boolean>;
  };
  technical?: {
    audioQuality: Record<string, boolean>;
    sampleRate: Record<string, boolean>;
    equipment: Record<string, boolean>;
    postProduction: Record<string, boolean>;
  };
  productionQuality?: {
    broadcast: Record<string, boolean>;
    professional: Record<string, boolean>;
  };
  experience?: {
    novice: Record<string, boolean>;
    expert: Record<string, boolean>;
  };
  [key: string]: Record<string, Record<string, boolean>> | undefined;
}

export interface FilterCategory {
  label: string;
  sections: {
    [key: string]: {
      label: string;
      options: string[];
    };
  };
}

export interface FilterCategories {
  [key: string]: FilterCategory;
}
