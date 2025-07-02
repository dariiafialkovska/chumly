'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AppShell from '@/components/layout/AppShell';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'events'));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading events...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <AppShell>
        <div className="text-center mt-10 text-gray-500">No events found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 mt-10 space-y-4">
        <h1 className="text-2xl font-bold">All Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">{event.name}</h2>
                <Badge className="capitalize">{event.status || 'unknown'}</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {event.description || 'No description.'}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Created: {event.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
