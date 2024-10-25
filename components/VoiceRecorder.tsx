'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, StopCircle, Loader2 } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface VoiceRecorderProps {
  onRecordingComplete?: (blob: Blob) => void;
  maxDuration?: number;
}

export function VoiceRecorder({ onRecordingComplete, maxDuration = 300 }: VoiceRecorderProps) {
  const {
    isRecording,
    audioBlob,
    audioUrl,
    duration,
    startRecording,
    stopRecording,
  } = useVoiceRecording();

  const { isLoggedIn, address } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (maxDuration && isRecording && duration >= maxDuration) {
      stopRecording();
    }
  }, [duration, isRecording, maxDuration, stopRecording]);

  const handleComplete = async () => {
    if (!audioBlob) return;

    if (onRecordingComplete) {
      onRecordingComplete(audioBlob);
    }

    if (!isLoggedIn || !address) {
      router.push('/auth/login');
    } else {
      router.push('/profile/create-nft');
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={`${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-yellow hover:bg-orange'
              } text-navy font-bold rounded-full w-16 h-16`}
            >
              {isRecording ? (
                <StopCircle className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
          </div>

          {isRecording && (
            <div className="space-y-2">
              <Progress value={(duration / maxDuration) * 100} />
              <p className="text-center text-sm text-cream">
                Recording: {Math.floor(duration)}s / {maxDuration}s
              </p>
            </div>
          )}

          <AnimatePresence>
            {audioUrl && !isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <audio src={audioUrl} controls className="w-full" />
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={startRecording}
                    className="text-cream border-cream hover:bg-cream hover:text-navy"
                  >
                    Record Again
                  </Button>
                  <Button
                    onClick={handleComplete}
                    className="bg-yellow hover:bg-orange text-navy"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}