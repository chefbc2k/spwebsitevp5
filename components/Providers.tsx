'use client';

import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from '@/contexts/AuthContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { UserProvider } from '@/contexts/UserContext';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ThirdwebProvider
        activeChain="ethereum"
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="nft-marketplace-theme"
        >
          <AuthProvider>
            <UserProvider>
              <AudioProvider>
                {children}
                <Toaster />
              </AudioProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </ThirdwebProvider>
    </Suspense>
  );
}