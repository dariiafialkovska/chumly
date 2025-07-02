'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddExpenseModal({ open, onClose, eventId, attendees }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splits, setSplits] = useState([]);

  const handleSplitChange = (userId, value) => {
    const updated = [...splits.filter(s => s.userId !== userId), {
      userId,
      percentage: Number(value)
    }];
    setSplits(updated);
  };

  const handleSubmit = async () => {
    const totalSplit = splits.reduce((sum, s) => sum + s.percentage, 0);
    if (!description || !amount || !paidBy || totalSplit !== 100) {
      alert('Please fill all fields and make sure split % totals 100.');
      return;
    }

    try {
      await addDoc(collection(db, 'expenses'), {
        eventId,
        description,
        amount: Number(amount),
        paidBy,
        splits,
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (err) {
      console.error('Error saving expense:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Total amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="">Paid by...</option>
            {attendees.map((u) => (
              <option key={u.uid} value={u.uid}>{u.name}</option>
            ))}
          </select>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Split between attendees (must total 100%)</p>
            {attendees.map((u) => (
              <div key={u.uid} className="flex items-center gap-2">
                <span className="w-24 text-sm">{u.name}</span>
                <Input
                  type="number"
                  className="w-20"
                  placeholder="%"
                  onChange={(e) => handleSplitChange(u.uid, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Save Expense</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
