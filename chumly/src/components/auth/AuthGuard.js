'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const publicRoutes = ['/login', '/register'];

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const isPublic = publicRoutes.includes(pathname);
      if (!user && !isPublic) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [pathname]);


  return <>{children}</>;
}
