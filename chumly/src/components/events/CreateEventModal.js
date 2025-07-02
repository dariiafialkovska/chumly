'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

export default function CreateEventModal({ onClose }) {
  const router = useRouter();
  const user = useUser();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        name,
        description,
        status,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        attendees: [user.uid],
      });
      onClose();
      router.push(`/events/${docRef.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-4 relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-gray-800 text-xl">×</button>
        <h1 className="text-xl font-bold">Create Event</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="Event Name" value={name} onChange={e => setName(e.target.value)} required />
          <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border p-2 rounded-md">
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button className="w-full">Create</Button>
        </form>
      </div>
    </div>
  );
}
