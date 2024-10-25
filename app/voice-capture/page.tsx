'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const Microphone3D = dynamic(() => import('@/components/Microphone3D'), {
  ssr: false,
});

export default function VoiceCapturePage() {
  const [isRecording, setIsRecording] = useState(false);
  const { isLoggedIn, address, checkUserExists } = useAuth();
  const router = useRouter();

  const handleRecordingComplete = async (blob: Blob) => {
    try {
      // Store recording status in localStorage
      localStorage.setItem('pendingVoiceRecording', 'true');

      // Check user authentication status
      if (!address) {
        toast({
          title: "Authentication Required",
          description: "Please connect your wallet to continue.",
        });
        router.push('/auth/login');
        return;
      }

      const userExists = await checkUserExists(address);
      if (!userExists) {
        toast({
          title: "Profile Required",
          description: "Please create a profile to continue.",
        });
        router.push('/auth/signup');
      } else {
        toast({
          title: "Recording completed",
          description: "Redirecting to NFT creation...",
        });
        router.push('/profile/create-nft');
      }
    } catch (error) {
      console.error('Error handling recording:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cream mb-4">
              Create Your Voice NFT
            </h1>
            <p className="text-orange text-lg">
              Record your voice and turn it into a unique digital asset
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[400px] rounded-lg overflow-hidden">
              <Microphone3D isRecording={isRecording} />
            </div>

            <div className="flex items-center">
              <VoiceRecorder
                onRecordingComplete={handleRecordingComplete}
                maxDuration={300}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}