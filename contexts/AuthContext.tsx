'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
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

interface DatabaseUserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_image?: string;
  industry?: string;
  vocal_specialization?: string;
  contract_preferences?: string[];
  social_links?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  created_at: string;
  minting_history: any[];
  is_new_user?: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  createUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapDatabaseProfileToUserProfile = (dbProfile: DatabaseUserProfile): UserProfile => {
  return {
    id: dbProfile.id,
    firstName: dbProfile.first_name,
    lastName: dbProfile.last_name,
    email: dbProfile.email,
    profileImage: dbProfile.profile_image,
    industry: dbProfile.industry,
    vocalSpecialization: dbProfile.vocal_specialization,
    contractPreferences: dbProfile.contract_preferences,
    socialLinks: dbProfile.social_links,
    createdAt: new Date(dbProfile.created_at),
    mintingHistory: dbProfile.minting_history,
    isNewUser: dbProfile.is_new_user
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        await loadUserProfile(session.user.id);
        await checkAdminStatus(session.user.id);
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const mappedProfile = mapDatabaseProfileToUserProfile(data as unknown as DatabaseUserProfile);
        setUserProfile(mappedProfile);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load user profile');
      setUserProfile(null);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const createUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const dbProfile = {
        id: user.id,
        email: user.email,
        first_name: data.firstName,
        last_name: data.lastName,
        profile_image: data.profileImage,
        industry: data.industry,
        vocal_specialization: data.vocalSpecialization,
        contract_preferences: data.contractPreferences,
        social_links: data.socialLinks,
        created_at: new Date().toISOString(),
        minting_history: [],
        is_new_user: true
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(dbProfile);

      if (error) {
        throw error;
      }

      const mappedProfile = mapDatabaseProfileToUserProfile(dbProfile as DatabaseUserProfile);
      setUserProfile(mappedProfile);
      toast.success('Profile created successfully');
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast.error('Failed to create profile');
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user || !userProfile) {
      throw new Error('No active user profile');
    }

    try {
      const dbProfile = {
        first_name: data.firstName,
        last_name: data.lastName,
        profile_image: data.profileImage,
        industry: data.industry,
        vocal_specialization: data.vocalSpecialization,
        contract_preferences: data.contractPreferences,
        social_links: data.socialLinks,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      const updatedProfile = {
        ...userProfile,
        ...data,
      };

      setUserProfile(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      router.push('/profile');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setUserProfile(null);
      setIsLoggedIn(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      isAdmin, 
      isLoading,
      userProfile,
      login, 
      logout, 
      user,
      createUserProfile,
      updateUserProfile
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
