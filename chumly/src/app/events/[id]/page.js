'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { colors } from '@/lib/colors';
import { Loader2, Calendar, CreditCard, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AddExpenseModal from '@/components/expenses/AddExpenseModal';

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', status: '' });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return;

        const data = snap.data();
        const creatorSnap = await getDoc(doc(db, 'users', data.createdBy));
        const createdByUser = creatorSnap.exists() ? creatorSnap.data() : { name: 'Unknown' };

        // Fetch user data for attendees
        const attendeesDetailed = await Promise.all(
          (data.attendees || []).map(async (uid) => {
            const userSnap = await getDoc(doc(db, 'users', uid));
            return userSnap.exists() ? userSnap.data() : { name: 'Unknown', uid };
          })
        );

        setEvent({ ...data, attendeesDetailed, createdByUser });
        setForm({ name: data.name, description: data.description, status: data.status });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'events', id), {
        name: form.name,
        description: form.description,
        status: form.status,
      });
      setEvent({ ...event, ...form });
      setEditing(false);
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading event...
      </div>
    );
  }

  if (!event) {
    return <div className="text-center text-red-500 mt-10">Event not found.</div>;
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto mt-10 px-4 space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1 flex-1">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Event Name</label>
                  <Input
                    className="text-base"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Description</label>
                  <Textarea
                    placeholder="Event description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>

            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
                <p className="text-sm text-gray-600">{event.description || 'No description provided.'}</p>
              </>
            )}
          </div>
          <div className="text-right space-y-1 pt-4 sm:pt-0">
            {editing ? (
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white text-gray-700 focus:outline-none"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            ) : (
              <Badge
                variant="outline"
                className={`capitalize border-${colors.gray[200]} text-${colors.gray[600]}`}
              >
                {event.status}
              </Badge>
            )}

            <p className="text-xs text-gray-400">
              Created {event.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
            <p className="text-xs text-gray-400">Created By</p>
            <p className="font-medium text-gray-800">{event.createdByUser?.name || 'Unknown'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
            <p className="text-xs text-gray-400">Attendees</p>
            <div className="flex flex-wrap gap-2">
              {event.attendeesDetailed?.map((user, i) => (
                <div
                  key={i}
                  className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {user.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4">
            <CreditCard className="text-indigo-500" />
            <div>
              <p className="text-gray-700 font-semibold">Expenses</p>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4">
            <Calendar className="text-purple-500" />
            <div>
              <p className="text-gray-700 font-semibold">Reservations</p>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : (
              <span className="flex items-center gap-1">
                <Pencil className="w-4 h-4" /> Edit
              </span>
            )}
          </Button>
          {editing && (
            <Button onClick={handleSave}>Save Changes</Button>
          )}
          {!editing && (
            <Button onClick={() => alert("Add feature coming soon")}>+ Add Section</Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
