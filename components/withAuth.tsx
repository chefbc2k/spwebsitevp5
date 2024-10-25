'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requireAdmin: boolean = false
) {
  return function AuthenticatedComponent(props: P) {
    const { isLoggedIn, isAdmin, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isLoggedIn) {
        router.push('/');
      } else if (!isLoading && requireAdmin && !isAdmin) {
        router.push('/profile');
      }
    }, [isLoggedIn, isAdmin, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!isLoggedIn || (requireAdmin && !isAdmin)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;