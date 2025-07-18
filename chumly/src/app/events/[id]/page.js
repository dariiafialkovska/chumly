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
import AddReservationModal from '@/components/reservations/AddReservationModal';
import ReservationCard from '@/components/reservations/ReservationCard';
import AddChecklistModal from '@/components/checklists/AddChecklistModal';
import ChecklistCard from '@/components/checklists/ChecklistCard';
import AddNoteModal from '@/components/notes/AddNoteModal';
import { getAuth } from 'firebase/auth';

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', status: '', startDate: '' });
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [editingReservation, setEditingReservation] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [editingChecklistItem, setEditingChecklistItem] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
const auth = getAuth();
const currentUser = auth.currentUser;
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
        setForm({
          name: data.name,
          description: data.description,
          status: data.status,
          startDate: data.startDate?.toDate().toISOString().split('T')[0] || '',
        });
        // Get reservations
        const reservationsQuery = query(
          collection(db, 'reservations'),
          where('eventId', '==', id)
        );
        const reservationSnapshot = await getDocs(reservationsQuery);

        const reservationList = reservationSnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setReservations(reservationList);

        const checklistQuery = query(
          collection(db, 'checklists'),
          where('eventId', '==', id)
        );
        const checklistSnap = await getDocs(checklistQuery);
        const checklistItems = checklistSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChecklist(checklistItems); // ← useState needed
        const notesQuery = query(
          collection(db, 'notes'),
          where('eventId', '==', id)
        );
        const noteSnapshot = await getDocs(notesQuery);

        const noteList = await Promise.all(
          noteSnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const authorSnap = await getDoc(doc(db, 'users', data.authorId));
            const authorName = authorSnap.exists() ? authorSnap.data().name : 'Unknown';
            return {
              id: docSnap.id,
              ...data,
              authorName,
            };
          })
        );
        setNotes(noteList); // ✅ Add useState for `notes`
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
    if (sectionKey === 'reservations') setReservationModalOpen(true);
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
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Event Date</label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>

              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
                <p className="text-sm text-gray-600">{event.description || 'No description provided.'}</p>
                <p className="text-sm text-gray-600">
                  📅 {event.startDate?.toDate().toLocaleDateString() || 'No date'}
                </p>

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
        {event.sections?.reservations && (
          <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-blue-500" />
                <p className="text-gray-700 font-semibold">Reservations</p>
              </div>
              <Button onClick={() => setReservationModalOpen(true)}>+ Add Reservation</Button>
            </div>

            <div className="space-y-3 pt-4">
              {reservations.length === 0 ? (
                <p className="text-sm text-gray-500">No reservations yet.</p>
              ) : (
                reservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    title={reservation.title}
                    date={reservation.date?.toDate?.()}
                    location={reservation.location}
                    notes={reservation.notes}
                    reservedBy={reservation.reservedBy}
                    getUserName={(uid) =>
                      event.attendeesDetailed.find((u) => u.uid === uid)?.name || uid
                    }
                    onEdit={() => {
                      setEditingReservation(reservation);
                      setReservationModalOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {event.sections?.checklist && (
          <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-700">📝 Checklist</span>
              </div>
              <Button onClick={() => setChecklistModalOpen(true)}>+ Add Task</Button>
            </div>

            {checklist.length === 0 ? (
              <p className="text-sm text-gray-500">No tasks yet.</p>
            ) : (
              <div className="space-y-2">
                {checklist.map((task, index) => (
                  <ChecklistCard
                    key={index}
                    task={task}
                    onToggle={(item) => {
                      const updated = checklist.map((t) =>
                        t === item ? { ...t, done: !t.done } : t
                      );
                      setChecklist(updated);
                    }}
                    onEdit={(item) => {
                      setEditingChecklistItem(item);
                      setChecklistModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {event.sections?.notes && (
          <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <p className="text-gray-700 font-semibold">📝 Notes</p>
              </div>
              <Button onClick={() => setNoteModalOpen(true)}>+ Add Note</Button>
            </div>

            {notes.length === 0 ? (
              <p className="text-sm text-gray-500">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 p-3 rounded-md border">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      by {note.authorName} • {note.updatedAt?.toDate().toLocaleString() || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  handleAddSection('checklist');
                  setSectionModalOpen(false);
                }}
              >
                📝 Checklist
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  handleAddSection('notes');
                  setSectionModalOpen(false);
                }}
              >
                🗒️ Notes
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
      <AddReservationModal
        open={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        eventId={id}
        attendees={event.attendeesDetailed}
      />
      <AddChecklistModal
        open={checklistModalOpen}
        onClose={() => {
          setChecklistModalOpen(false);
          setEditingChecklistItem(null);
        }}
        eventId={id}
        initialData={editingChecklistItem}
        onSave={(data) => {
          if (editingChecklistItem) {
            setChecklist((prev) =>
              prev.map((item) =>
                item === editingChecklistItem ? { ...item, ...data } : item
              )
            );
          } else {
            setChecklist((prev) => [...prev, { ...data, done: false }]);
          }
          setChecklistModalOpen(false);
          setEditingChecklistItem(null);
        }}
      />
      <AddNoteModal
        open={noteModalOpen}
        onClose={() => {
          setNoteModalOpen(false);
          setEditingNote(null);
        }}
        eventId={id}
        user={currentUser} // Make sure you pass current user
        initialData={editingNote}
        onSave={() => {
          setNoteModalOpen(false);
          setEditingNote(null);
          // optionally refetch notes
        }}
      />



    </AppShell>
  );
}
