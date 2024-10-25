import { db } from './config';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export interface UserProfile {
  address: string;
  email?: string;
  username?: string;
  createdAt: Date;
  mintingHistory: {
    tokenId: string;
    timestamp: Date;
    transactionHash: string;
  }[];
  isNewUser?: boolean;
}

export async function createUser(profile: UserProfile) {
  try {
    await setDoc(doc(db, 'users', profile.address.toLowerCase()), {
      ...profile,
      createdAt: new Date(),
      mintingHistory: [],
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUser(address: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', address.toLowerCase()));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function updateUser(address: string, data: Partial<UserProfile>) {
  try {
    await updateDoc(doc(db, 'users', address.toLowerCase()), {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function addMintingRecord(
  address: string,
  tokenId: string,
  transactionHash: string
) {
  try {
    const userRef = doc(db, 'users', address.toLowerCase());
    await updateDoc(userRef, {
      mintingHistory: [
        {
          tokenId,
          timestamp: new Date(),
          transactionHash,
        },
      ],
    });
  } catch (error) {
    console.error('Error adding minting record:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return {
        id: userDoc.id,
        ...userDoc.data(),
      } as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}