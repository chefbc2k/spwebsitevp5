import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import type { NFTFormData } from '@/types/nft';

export const createNFT = async (
  nftData: NFTFormData & { 
    mediaUrl: string;
    creatorAddress: string;
  }
) => {
  try {
    const nftRef = await addDoc(collection(db, 'nfts'), {
      ...nftData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active',
      likes: 0,
      views: 0,
    });

    // Add NFT reference to user's profile
    const userRef = doc(db, 'users', nftData.creatorAddress);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      await updateDoc(userRef, {
        createdNFTs: [...(userData.createdNFTs || []), nftRef.id],
      });
    }

    return nftRef.id;
  } catch (error) {
    console.error('Error creating NFT:', error);
    throw error;
  }
};

export const getUserNFTs = async (userAddress: string) => {
  try {
    const nftsQuery = query(
      collection(db, 'nfts'),
      where('creatorAddress', '==', userAddress)
    );
    
    const snapshot = await getDocs(nftsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    throw error;
  }
};

export const createUserProfile = async (
  userAddress: string,
  userData: {
    email?: string;
    username?: string;
    bio?: string;
    avatar?: string;
  }
) => {
  try {
    const userRef = doc(db, 'users', userAddress);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await addDoc(collection(db, 'users'), {
        address: userAddress,
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdNFTs: [],
        transactions: [],
      });
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (
  userAddress: string,
  updates: Partial<{
    email: string;
    username: string;
    bio: string;
    avatar: string;
  }>
) => {
  try {
    const userRef = doc(db, 'users', userAddress);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userAddress: string) => {
  try {
    const userRef = doc(db, 'users', userAddress);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};