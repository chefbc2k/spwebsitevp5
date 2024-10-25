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

export interface FilterState {
  geographic: {
    continent: Record<string, boolean>;
    country: Record<string, boolean>;
    region: Record<string, boolean>;
  };
  speaker: {
    age: Record<string, boolean>;
    gender: Record<string, boolean>;
    education: Record<string, boolean>;
    languageLevel: Record<string, boolean>;
  };
  voice: {
    pitch: Record<string, boolean>;
    speed: Record<string, boolean>;
    clarity: Record<string, boolean>;
    emotion: Record<string, boolean>;
  };
  language: {
    primary: Record<string, boolean>;
    heritage: Record<string, boolean>;
    accent: Record<string, boolean>;
    dialect: Record<string, boolean>;
    pronunciation: Record<string, boolean>;
  };
  context: {
    style: Record<string, boolean>;
    format: Record<string, boolean>;
    purpose: Record<string, boolean>;
    background: Record<string, boolean>;
    accessibility: Record<string, boolean>;
  };
  cultural: {
    slang: Record<string, boolean>;
    mixedLanguages: Record<string, boolean>;
    localTerms: Record<string, boolean>;
    formality: Record<string, boolean>;
  };
  technical: {
    aiProcessed: Record<string, boolean>;
    processing: Record<string, boolean>;
    audioMix: Record<string, boolean>;
  };
}