'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CompleteProfileModal({ user, open, onClose }) {
  const [name, setName] = useState(user?.displayName || '');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
  if (!name || !username) {
    setError('Both fields are required.');
    return;
  }

  try {
    // 🔍 Check if username is already taken
    const q = query(collection(db, 'users'), where('username', '==', username));
    const snap = await getDocs(q);
    const isTaken = !snap.empty && snap.docs[0].id !== user.uid;

    if (isTaken) {
      setError('Username is already taken.');
      return;
    }

    await updateDoc(doc(db, 'users', user.uid), {
      name,
      username,
    });

    onClose();

    // ✅ Optional: force a clean reload (remove query param, refresh dashboard)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/dashboard'); // remove ?newUser=true
      window.location.reload(); // force dashboard data to refresh
    }

  } catch (err) {
    console.error('Error saving profile:', err);
    setError('Failed to save profile.');
  }
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogTitle className="text-lg font-semibold">Complete Your Profile</DialogTitle>

        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button onClick={handleSave} className="w-full">Save Profile</Button>
      </DialogContent>
    </Dialog>
  );
}
