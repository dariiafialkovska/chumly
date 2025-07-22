'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const getRedirectPath = () => {
    if (typeof window === 'undefined') return '/dashboard';

    const stored = sessionStorage.getItem('redirectAfterLogin');
    if (stored) {
      sessionStorage.removeItem('redirectAfterLogin'); // Clean up
      return stored;
    }

    const fromQuery = new URLSearchParams(window.location.search).get('redirect');
    return fromQuery || '/dashboard';
  };



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const redirectPath = getRedirectPath();
      router.push(redirectPath);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const isNewUser = await ensureUserInFirestore(cred.user);
      router.push(isNewUser ? '/dashboard?newUser=true' : redirectPath);
    } catch (err) {
      setError('Google sign-in failed');
    }
  };

  const ensureUserInFirestore = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || '',
        username: '',
        email: user.email,
        provider: user.providerData[0]?.providerId || 'google',
      });
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="space-y-4 bg-white p-6 rounded-xl shadow-md w-[320px]">
        <h1 className="text-xl font-bold text-center">Login</h1>
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full">Login</Button>
        <div className="text-center text-sm text-gray-500">or</div>
        <Button type="button" onClick={handleGoogleLogin} variant="outline" className="w-full">
          Sign in with Google
        </Button>
        <div className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
