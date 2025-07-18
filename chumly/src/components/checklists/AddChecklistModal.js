'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
export default function AddChecklistModal({ open, onClose, eventId, attendees, initialData = null }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    done: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        done: initialData.done || false,
      });
    }
  }, [initialData]);

const handleSubmit = async () => {
  if (!form.title) return;

  const newItem = {
    title: form.title,
    done: false,
    createdAt: serverTimestamp(),
    eventId, // passed as prop
    assignedTo: form.assignedTo || null
  };

  await addDoc(collection(db, 'checklists'), newItem);
  onClose(); // close modal
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Task' : 'Add Task'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              {initialData ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
