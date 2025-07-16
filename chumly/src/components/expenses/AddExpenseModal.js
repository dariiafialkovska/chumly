'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

export default function AddExpenseModal({ open, onClose, eventId, attendees, initialData = null, onSave = null }) {
  const [paidBy, setPaidBy] = useState('');

  const handleSplitChange = (uid, amount) => {
    setForm(prev => {
      const updated = prev.splitDetails.filter(s => s.uid !== uid);
      return {
        ...prev,
        splitDetails: [...updated, { uid, amount }],
      };
    });
  };

  const handleSubmit = async () => {
    const expenseData = {
      ...form,
      eventId
    };

    if (initialData?.id) {
      // Edit mode
      await updateDoc(doc(db, 'expenses', initialData.id), expenseData);
      if (onSave) onSave(expenseData);
    } else {
      // Add mode
      await addDoc(collection(db, 'expenses'), expenseData);
    }

    onClose();
  };
  const getCurrencySymbol = (currency) => {
    return {
      USD: '$',
      EUR: '€',
      TRY: '₺',
      GBP: '£',
      JPY: '¥',
    }[currency] || currency;
  };
  const [form, setForm] = useState({
    description: initialData?.description || '',
    amount: initialData?.amount || '',
    currency: initialData?.currency || 'TRY',
    paidBy: initialData?.paidBy || '',
    splitType: initialData?.splitType || 'equal',
    splitDetails: initialData?.splitDetails || [],
  });
  const totalSplit = form.splitDetails.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
  const isMismatch = parseFloat(form.amount) !== totalSplit;
  const currencySymbol = getCurrencySymbol(form.currency || 'TRY');


  useEffect(() => {
    if (initialData) {
      setForm({
        description: initialData.description || '',
        amount: initialData.amount || '',
        currency: initialData.currency || 'TRY',
        paidBy: initialData.paidBy || '',
        splitType: initialData.splitType || 'equal',
      });

      setForm(prev => ({
        ...prev,
        splitDetails: initialData.splitDetails || [],
      }));
    }
  }, [initialData]);


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Total amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
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
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            <option value="TRY">₺ TRY</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
            <option value="JPY">¥ JPY</option>
            <option value="Other">Other</option>
          </select>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Split between attendees (amounts must total the expense)
            </p>
            {attendees.map((u) => (
              <div key={u.uid} className="flex items-center gap-2">
                <span className="w-24 text-sm">{u.name}</span>
                <Input
                  type="number"
                  className="w-24"
                  placeholder="₺0.00"
                  value={form.splitDetails.find(s => s.uid === u.uid)?.amount || ''}
                  onChange={(e) => handleSplitChange(u.uid, parseFloat(e.target.value))}
                />
              </div>
            ))}
          </div>
          {isMismatch && (
            <p className="text-sm text-red-500">
              Total split ({currencySymbol}{totalSplit.toFixed(2)}) does not match expense amount ({currencySymbol}{form.amount})
            </p>
          )}


          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              {initialData ? 'Save Changes' : 'Add Expense'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
