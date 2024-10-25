'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  industry: z.string().min(1, 'Please select an industry'),
  vocalSpecialization: z.string().min(1, 'Please select a specialization'),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
});

type SignupForm = z.infer<typeof signupSchema>;

const industries = [
  'Entertainment',
  'Education',
  'Corporate',
  'Gaming',
  'Advertising',
  'Other'
];

const specializations = [
  'Voice Acting',
  'Narration',
  'Commercial',
  'Character Voices',
  'Audiobooks',
  'Other'
];

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const { createUserProfile, address, createWallet } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);

      // If no wallet is connected, create one
      const userAddress = address || await createWallet();

      await createUserProfile({
        ...data,
        address: userAddress,
        profileImage,
        socialLinks: {
          twitter: data.twitter,
          instagram: data.instagram,
          linkedin: data.linkedin,
        },
      });
      
      toast.success('Profile created successfully');
      
      // Check if there's a captured voice recording pending
      const hasPendingRecording = localStorage.getItem('pendingVoiceRecording');
      if (hasPendingRecording) {
        router.push('/profile/create-nft');
      } else {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-cream">Create Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-cream">First Name</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    className="bg-white/5 border-white/10 text-cream"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-cream">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    className="bg-white/5 border-white/10 text-cream"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-cream">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="bg-white/5 border-white/10 text-cream"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-cream">Industry</Label>
                  <Select onValueChange={(value) => register('industry').onChange({ target: { value } })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-cream">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="text-red-400 text-sm">{errors.industry.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vocalSpecialization" className="text-cream">Vocal Specialization</Label>
                  <Select onValueChange={(value) => register('vocalSpecialization').onChange({ target: { value } })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-cream">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vocalSpecialization && (
                    <p className="text-red-400 text-sm">{errors.vocalSpecialization.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-cream">Profile Picture</Label>
                <ImageUpload
                  value={profileImage}
                  onChange={(url) => setProfileImage(url)}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-cream">Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    {...register('twitter')}
                    placeholder="Twitter"
                    className="bg-white/5 border-white/10 text-cream"
                  />
                  <Input
                    {...register('instagram')}
                    placeholder="Instagram"
                    className="bg-white/5 border-white/10 text-cream"
                  />
                  <Input
                    {...register('linkedin')}
                    placeholder="LinkedIn"
                    className="bg-white/5 border-white/10 text-cream"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow hover:bg-orange text-navy font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Create Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}