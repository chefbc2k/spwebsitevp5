'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Upload, Loader2 } from 'lucide-react';
import withAuth from '@/components/withAuth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import useAudioTransfer from '@/hooks/useAudioTransfer';
import type { NFTFormData } from '@/types/nft';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  price: z.number().min(0, 'Price must be a positive number'),
  royalties: z.number().min(0).max(100, 'Royalties must be between 0 and 100'),
  category: z.string().min(1, 'Category is required'),
  duration: z.string().min(1, 'Duration is required'),
  language: z.string().min(1, 'Language is required'),
  voiceType: z.string().min(1, 'Voice type is required'),
});

function CreateNFT() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const router = useRouter();
  const { address } = useAuth();
  const { audioBlob, audioUrl, clearAudioData } = useAudioTransfer();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<NFTFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'entertainment',
      duration: 'short',
      language: 'english',
      voiceType: 'natural',
    },
  });

  useEffect(() => {
    if (audioBlob && audioUrl) {
      const audio = new Audio(audioUrl);
      setAudioElement(audio);

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [audioBlob, audioUrl]);

  useEffect(() => {
    return () => {
      clearAudioData();
    };
  }, [clearAudioData]);

  const togglePlay = useCallback(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [audioElement, isPlaying]);

  const onSubmit = async (data: NFTFormData) => {
    if (!audioBlob || !address) {
      toast.error('Please record audio and connect your wallet first');
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload logic here...
      setUploadProgress(100);
      
      toast.success('NFT created successfully!');
      reset();
      router.push('/profile/collection');
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast.error('Failed to create NFT. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create Voice NFT</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title')} />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (ETH)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="royalties">Royalties (%)</Label>
                  <Input
                    id="royalties"
                    type="number"
                    {...register('royalties', { valueAsNumber: true })}
                  />
                  {errors.royalties && (
                    <p className="text-red-500 text-sm mt-1">{errors.royalties.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => register('category').onChange({ target: { value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select onValueChange={(value) => register('language').onChange({ target: { value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {audioUrl && (
                <div className="space-y-2">
                  <Label>Preview Recording</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: audioElement
                            ? `${(audioElement.currentTime / audioElement.duration) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-center">Uploading NFT...</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isUploading || !audioBlob}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating NFT...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Create NFT
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default withAuth(CreateNFT);