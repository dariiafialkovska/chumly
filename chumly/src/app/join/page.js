'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth'; // 👈 assumes you already have a hook for current user

export default function JoinEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { currentUser } = useAuth();

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    const tryJoinEvent = async () => {
      if (!token || !currentUser) return;

      try {
        const q = query(collection(db, 'events'), where('inviteToken', '==', token));
        const snap = await getDocs(q);

        if (snap.empty) {
          setStatus('error');
          return;
        }

        const eventDoc = snap.docs[0];
        const data = eventDoc.data();
        const attendees = data.attendees || [];

        if (!attendees.includes(currentUser.uid)) {
          await updateDoc(doc(db, 'events', eventDoc.id), {
            attendees: [...attendees, currentUser.uid],
          });
        }

        setEventId(eventDoc.id);
        setStatus('success');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    tryJoinEvent();
  }, [token, currentUser]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin mr-2" />
        Joining event...
      </div>
    );
  }

  if (status === 'error') {
    return <div className="text-center text-red-500 mt-10">Invalid or expired invite token.</div>;
  }

  return (
    <div className="text-center mt-10 space-y-4">
      <h1 className="text-xl font-semibold text-green-700">You've joined the event!</h1>
      <Button onClick={() => router.push(`/events/${eventId}`)}>Go to Event</Button>
    </div>
  );
}
