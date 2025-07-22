'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';

export default function JoinEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { user, loading: authLoading } = useAuth();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    if (!token || authLoading) return;

    // If user is not logged in, store redirect and send to login
    if (!user) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', `/join?token=${token}`);
      }
      router.push('/login');
      return;
    }

    const joinEvent = async () => {
      try {
        const q = query(collection(db, 'events'), where('inviteToken', '==', token));
        const snap = await getDocs(q);

        if (snap.empty) {
          setStatus('error');
          return;
        }

        const eventDoc = snap.docs[0];
        const eventData = eventDoc.data();
        const attendees = eventData.attendees || [];

        if (!attendees.includes(user.uid)) {
          await updateDoc(doc(db, 'events', eventDoc.id), {
            attendees: [...attendees, user.uid],
          });
        }

        const eventPage = `/events/${eventDoc.id}`;
router.replace(eventPage); // 👈 auto-navigate

      } catch (err) {
        console.error('Join event failed:', err);
        setStatus('error');
      }
    };

    joinEvent();
  }, [authLoading, token, user, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin mr-2" />
        <span>Joining event...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center mt-10 space-y-4 text-red-500">
        <h2>Invalid or expired invite token.</h2>
        <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

return (
  <div className="text-center mt-10 space-y-4">
    <h1 className="text-xl font-semibold text-green-700">You've joined the event!</h1>
    <Button onClick={() => router.push(`/events/${eventId}`)}>Go to Event</Button>
  </div>
);

}
