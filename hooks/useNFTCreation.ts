'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNFTMinting } from '@/hooks/useNFTMinting';
import { toast } from 'sonner';

interface NFTMetadata {
  name: string;
  description: string;
  audioFile: Blob;
  image?: string;
  attributes: Record<string, any>[];
}

export function useNFTCreation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { address } = useAuth();
  const { mintNFT, isLoading: isMinting } = useNFTMinting();
  const router = useRouter();

  const uploadToIPFS = async (file: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/ipfs', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload to IPFS');
    const { url } = await response.json();
    return url;
  };

  const createNFT = async (metadata: NFTMetadata) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setIsProcessing(true);

      // Upload audio file to IPFS
      const audioUrl = await uploadToIPFS(metadata.audioFile);

      // Upload cover image if provided
      let imageUrl = metadata.image;
      if (!imageUrl && metadata.audioFile) {
        // Generate waveform image if no cover image provided
        imageUrl = await generateWaveformImage(metadata.audioFile);
      }

      // Prepare NFT metadata
      const nftMetadata = {
        name: metadata.name,
        description: metadata.description,
        image: imageUrl,
        animation_url: audioUrl,
        attributes: metadata.attributes,
      };

      // Mint NFT
      const receipt = await mintNFT(nftMetadata);
      if (receipt) {
        toast.success('NFT created successfully!');
        localStorage.removeItem('voiceRecording'); // Clear stored recording
        router.push(`/profile/collection/${receipt.tokenId}`);
      }
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast.error('Failed to create NFT');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateWaveformImage = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch('/api/generate-waveform', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to generate waveform');
    const { url } = await response.json();
    return url;
  };

  return {
    createNFT,
    isProcessing: isProcessing || isMinting,
  };
}