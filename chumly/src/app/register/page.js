'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        name,
        username,
        email,
        provider: 'email',
      });

router.push('/dashboard?newUser=true');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const userRef = doc(db, 'users', cred.user.uid);

      await setDoc(userRef, {
        uid: cred.user.uid,
        name: cred.user.displayName || '',
        username: '', // Ask later in settings if needed
        email: cred.user.email,
        provider: 'google',
      }, { merge: true });

router.push('/dashboard?newUser=true');
    } catch (err) {
      setError('Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleRegister} className="space-y-4 bg-white p-6 rounded-xl shadow-md w-[320px]">
        <h1 className="text-xl font-bold text-center">Create Account</h1>
        <Input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
        <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full">Register</Button>
        <div className="text-center text-sm text-gray-500">or</div>
        <Button type="button" onClick={handleGoogleSignup} variant="outline" className="w-full">
          Sign up with Google
        </Button>
      </form>
    </div>
  );
}
