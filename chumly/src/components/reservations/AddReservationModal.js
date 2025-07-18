'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function AddReservationModal({ open, onClose, eventId, attendees, initialData = null, onSave = null }) {
  const [form, setForm] = useState({
    title: '',
    location: '',
    date: '',
    notes: '',
    reservedBy: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        location: initialData.location || '',
        date: initialData.date ? initialData.date.toDate().toISOString().split('T')[0] : '',
        notes: initialData.notes || '',
        reservedBy: initialData.reservedBy || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!form.title || !form.reservedBy) return;

    const reservationData = {
      ...form,
      eventId,
      date: form.date ? new Date(form.date) : null,
      createdAt: serverTimestamp(),
    };

    if (initialData?.id) {
      await updateDoc(doc(db, 'reservations', initialData.id), reservationData);
      if (onSave) onSave(reservationData);
    } else {
      await addDoc(collection(db, 'reservations'), reservationData);
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Reservation' : 'Add Reservation'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Reservation Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            placeholder="Location (optional)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <select
            value={form.reservedBy}
            onChange={(e) => setForm({ ...form, reservedBy: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="">Reserved by...</option>
            {attendees.map((u) => (
              <option key={u.uid} value={u.uid}>{u.name}</option>
            ))}
          </select>
          <Textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              {initialData ? 'Save Changes' : 'Add Reservation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
