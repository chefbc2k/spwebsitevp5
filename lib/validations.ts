import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  social: z.object({
    twitter: z.string().optional(),
    discord: z.string().optional(),
    website: z.string().url().optional()
  }).optional()
});

export function validateUserData(data: unknown) {
  return userSchema.safeParse(data);
}
