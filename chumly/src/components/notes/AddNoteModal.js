'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { addDoc, collection, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function AddNoteModal({ open, onClose, eventId, user, initialData = null, onSave = null }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || '');
    } else {
      setContent('');
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!content.trim()) return;

    const noteData = {
      content,
      eventId,
      authorId: user.uid,
      updatedAt: serverTimestamp(),
    };

    if (initialData?.id) {
      await updateDoc(doc(db, 'notes', initialData.id), noteData);
      onSave?.();
    } else {
      await addDoc(collection(db, 'notes'), {
        ...noteData,
        createdAt: serverTimestamp(),
      });
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Note' : 'Add Note'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleSave}>{initialData ? 'Save Changes' : 'Add Note'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
