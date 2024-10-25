'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NFTContract } from '@/lib/contracts/NFTContract';
import { addMintingRecord } from '@/lib/firebase/users';
import { toast } from 'sonner';
import { useSDK } from '@thirdweb-dev/react';

export function useNFTMinting() {
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAuth();
  const sdk = useSDK();

  const mintNFT = async (metadata: {
    name: string;
    description: string;
    image: string;
    animation_url: string;
    attributes: any[];
  }) => {
    if (!address || !sdk) {
      toast.error('Please connect your wallet');
      return null;
    }

    setIsLoading(true);

    try {
      const signer = await sdk.getSigner();
      const contract = new NFTContract(signer);
      
      const tx = await contract.mintNFT(metadata);
      const receipt = await tx.wait();
      
      // Add minting record to user's profile
      await addMintingRecord(
        address,
        receipt.tokenId.toString(),
        receipt.transactionHash
      );

      toast.success('NFT minted successfully!');
      return receipt;
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('Failed to mint NFT');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mintNFT,
    isLoading
  };
}