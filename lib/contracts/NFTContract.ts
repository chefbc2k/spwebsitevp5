import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

export class NFTContract {
  private sdk: ThirdwebSDK;
  private contract: any;

  constructor(signer: ethers.Signer) {
    this.sdk = new ThirdwebSDK(signer);
    this.initializeContract();
  }

  private async initializeContract() {
    if (!contractAddress) throw new Error('NFT contract address not configured');
    this.contract = await this.sdk.getContract(contractAddress);
  }

  async mintNFT(metadata: {
    name: string;
    description: string;
    image: string;
    animation_url: string;
    attributes: any[];
  }) {
    if (!this.contract) throw new Error('Contract not initialized');

    try {
      const tx = await this.contract.erc721.mint({
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        animation_url: metadata.animation_url,
        attributes: metadata.attributes,
      });

      return tx;
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }

  async getNFTsByOwner(address: string) {
    if (!this.contract) throw new Error('Contract not initialized');

    try {
      const nfts = await this.contract.erc721.getOwned(address);
      return nfts;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      throw error;
    }
  }

  async getNFTMetadata(tokenId: string) {
    if (!this.contract) throw new Error('Contract not initialized');

    try {
      const metadata = await this.contract.erc721.get(tokenId);
      return metadata;
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      throw error;
    }
  }
}