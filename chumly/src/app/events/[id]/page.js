'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { colors } from '@/lib/colors';
import { Loader2, Calendar, CreditCard, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppShell from '@/components/layout/AppShell';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AddExpenseModal from '@/components/expenses/AddExpenseModal';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', status: '' });
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return;

        const data = snap.data();
        const sections = data.sections || {};
        const creatorSnap = await getDoc(doc(db, 'users', data.createdBy));
        const createdByUser = creatorSnap.exists() ? creatorSnap.data() : { name: 'Unknown' };

        const attendeesDetailed = await Promise.all(
          (data.attendees || []).map(async (uid) => {
            const userSnap = await getDoc(doc(db, 'users', uid));
            return userSnap.exists() ? userSnap.data() : { name: 'Unknown', uid };
          })
        );

        const expensesQuery = query(
          collection(db, 'expenses'),
          where('eventId', '==', id)
        );
        const expenseSnapshot = await getDocs(expensesQuery);

        const expenseList = await Promise.all(expenseSnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let paidByName = 'Unknown';
          if (data.paidBy) {
            try {
              const paidBySnap = await getDoc(doc(db, 'users', data.paidBy));
              paidByName = paidBySnap.exists() ? paidBySnap.data().name : 'Unknown';
            } catch (err) {
              console.warn('Failed to fetch paidBy user:', err);
            }
          }

          const sharedWithNames = await Promise.all(
            (data.sharedWith || []).map(async (uid) => {
              const snap = await getDoc(doc(db, 'users', uid));
              return snap.exists() ? snap.data().name : 'Unknown';
            })
          );

          return {
            id: docSnap.id,
            ...data,
            paidByName,
            sharedWithNames
          };
        }));

        setExpenses(expenseList);
        setEvent({ ...data, attendeesDetailed, createdByUser, sections });
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

  const handleAddSection = async (sectionKey) => {
    const updatedSections = {
      ...event.sections,
      [sectionKey]: true,
    };
    await updateDoc(doc(db, 'events', id), { sections: updatedSections });
    setEvent({ ...event, sections: updatedSections });
    if (sectionKey === 'expenses') setExpenseModalOpen(true);
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

        {event.sections?.expenses && (
          <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="text-indigo-500" />
                <p className="text-gray-700 font-semibold">Expenses</p>
              </div>
              <Button onClick={() => setExpenseModalOpen(true)}>+ Add Expense</Button>
            </div>

            <div className="space-y-3 pt-4">
              {expenses.length === 0 ? (
                <p className="text-sm text-gray-500">No expenses yet.</p>
              ) : (
                expenses.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    description={expense.description}
                    amount={expense.amount}
                    paidBy={expense.paidByName}
                    currency={expense.currency}
                    splitType={expense.splitType}
                    splitDetails={expense.splitDetails}
                    getUserName={(uid) =>
                      event.attendeesDetailed.find((u) => u.uid === uid)?.name || uid
                    }
                    onEdit={() => {
                      setEditingExpense(expense);
                      setEditModalOpen(true);
                    }}
                  />


                ))
              )}
            </div>


          </div>
        )}

        <Dialog open={sectionModalOpen} onOpenChange={setSectionModalOpen}>
          <DialogContent>
            <div className="space-y-3">
              <DialogTitle className="text-lg font-semibold">
                Add a Section
              </DialogTitle>              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  handleAddSection('expenses');
                  setSectionModalOpen(false);
                }}
              >
                💰 Expenses
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  handleAddSection('reservations');
                  setSectionModalOpen(false);
                }}
              >
                📅 Reservations
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="pt-4">
          <Button onClick={() => setSectionModalOpen(true)}>+ Add Section</Button>
        </div>

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
        </div>
      </div>

      <AddExpenseModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingExpense(null);
        }}
        eventId={id}
        attendees={event.attendeesDetailed}
        initialData={editingExpense}
        onSave={() => {
          setEditModalOpen(false);
          setEditingExpense(null);

        }}
      />
      <AddExpenseModal
        open={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        eventId={id}
        attendees={event.attendeesDetailed}
      />

    </AppShell>
  );
}
