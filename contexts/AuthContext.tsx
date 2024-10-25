'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAddress, useMetamask, useDisconnect, useSDK } from "@thirdweb-dev/react";
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { toast } from 'sonner';

interface UserProfile {
  address: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
  industry?: string;
  vocalSpecialization?: string;
  contractPreferences?: string[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt: Date;
  mintingHistory: any[];
  isNewUser?: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  login: () => Promise<void>;
  logout: () => void;
  address: string | undefined;
  createUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  checkUserExists: (address: string) => Promise<boolean>;
  createWallet: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();
  const sdk = useSDK();
  const router = useRouter();

  const checkUserExists = async (walletAddress: string): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      const userDocRef = doc(db, 'users', walletAddress.toLowerCase());
      const userDoc = await getDoc(userDocRef);
      return userDoc.exists();
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  };

  const loadUserProfile = async (walletAddress: string) => {
    try {
      const userDocRef = doc(db, 'users', walletAddress.toLowerCase());
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
        setIsLoggedIn(true);
      } else {
        setUserProfile(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load user profile');
      setUserProfile(null);
      setIsLoggedIn(false);
    }
  };

  const checkAdminStatus = async (walletAddress: string) => {
    try {
      const response = await fetch(`/api/admin/check?address=${walletAddress}`);
      const data = await response.json();
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      if (address) {
        await loadUserProfile(address);
        await checkAdminStatus(address);
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserProfile(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [address]);

  const createUserProfile = async (data: Partial<UserProfile>) => {
    if (!address) throw new Error('No wallet connected');

    try {
      const userProfile: UserProfile = {
        address,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        profileImage: data.profileImage,
        industry: data.industry,
        vocalSpecialization: data.vocalSpecialization,
        contractPreferences: data.contractPreferences,
        socialLinks: data.socialLinks,
        createdAt: new Date(),
        mintingHistory: [],
        isNewUser: true,
        ...data
      };

      await setDoc(doc(db, 'users', address.toLowerCase()), userProfile);
      setUserProfile(userProfile);
      setIsLoggedIn(true);
      toast.success('Profile created successfully');
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast.error('Failed to create profile');
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!address || !userProfile) throw new Error('No active user profile');

    try {
      const updatedProfile = {
        ...userProfile,
        ...data,
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', address.toLowerCase()), updatedProfile, { merge: true });
      setUserProfile(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const createWallet = async (): Promise<string> => {
    if (!sdk) throw new Error('SDK not initialized');

    try {
      const wallet = await sdk.wallet.generate();
      return wallet.address;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  };

  const login = async () => {
    try {
      await connect();
      if (address) {
        const exists = await checkUserExists(address);
        if (!exists) {
          router.push('/auth/signup');
        } else {
          await loadUserProfile(address);
          router.push('/profile');
        }
      }
    } catch (error) {
      console.error('Failed to connect:', error);
      toast.error('Failed to connect wallet');
      throw error;
    }
  };

  const logout = () => {
    disconnect();
    setUserProfile(null);
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      isAdmin, 
      isLoading,
      userProfile,
      login, 
      logout, 
      address,
      createUserProfile,
      updateUserProfile,
      checkUserExists,
      createWallet
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};