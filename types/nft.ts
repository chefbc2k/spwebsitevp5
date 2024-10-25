export interface NFT {
  id: number;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
  price: number;
  category: string;
  description?: string;
  metadata?: {
    duration?: string;
    fileSize?: number;
    fileType?: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'sold';
  owner: string;
  likes: number;
  views: number;
}

export interface NFTFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  royalties: number;
  duration: string;
  language: string;
  voiceType: string;
}