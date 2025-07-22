"use client";

// app/dashboard/page.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, CreditCard } from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import EventCard from '@/components/cards/EventCard';
import StatsCard from '@/components/cards/StatsCard';
import QuickActions from '@/components/dashboard/QuickActions';
import { colors, componentStyles } from '@/lib/colors';
import { useSearchParams } from 'next/navigation';
import CompleteProfileModal from '@/components/auth/CompleteProfileModal';
import { useUser } from '@/contexts/UserContext';
import { query, where } from 'firebase/firestore';


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const upcomingEventsCount = events.filter(e => e.status === 'upcoming').length;
  const pendingExpensesCount = events.filter(e => e.amount > 0 && e.status !== 'completed').length;
  const searchParams = useSearchParams();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      const newUser = searchParams.get('newUser') === 'true';

      if (!user || !newUser) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        const data = snap.data();

        const profileIncomplete = !data?.username || !data?.name;

        if (profileIncomplete) {
          setShowProfileModal(true);
        } else {
          // Profile is already complete → clean up URL param
          window.history.replaceState(null, '', '/dashboard');
        }
      } catch (err) {
        console.error('Failed to check profile completion:', err);
      }
    };

    checkProfileCompletion();
  }, [user, searchParams]);

  const stats = [
    { icon: Calendar, title: "Events", value: events.length.toString(), subtitle: "This month", colorType: "primary" },
    { icon: Users, title: "Groups", value: "5", subtitle: "Active", colorType: "success" },
    { icon: CreditCard, title: "Expenses", value: "$342", subtitle: "This month", colorType: "warning" },
    { icon: MapPin, title: "Locations", value: "8", subtitle: "Saved", colorType: "info" },
  ];


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const q = query(
          eventsRef,
          where('attendees', 'array-contains', user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Optional: Also get events created by user
        const createdQ = query(eventsRef, where('createdBy', '==', user.uid));
        const createdSnap = await getDocs(createdQ);
        const createdEvents = createdSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Combine both and remove duplicates
        const allEvents = [...data, ...createdEvents].filter(
          (e, index, self) => index === self.findIndex(ev => ev.id === e.id)
        );

        setEvents(allEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <div className={`min-h-screen bg-${colors.gray[50]}`} style={{ fontFamily: 'Libre Baskerville, serif' }}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="lg:ml-16 transition-all duration-300">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-4 lg:p-6 space-y-6">
            {/* Welcome Section */}
            <div className={`bg-gradient-to-r ${colors.gradients.primaryDark} rounded-2xl p-6`}>
              <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
              <p className={`text-${colors.primary[100]}`}>
                You have {upcomingEventsCount} upcoming {upcomingEventsCount === 1 ? 'event' : 'events'} and {pendingExpensesCount} pending {pendingExpensesCount === 1 ? 'expense' : 'expenses'} to settle.
              </p>

            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Recent Events */}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold text-${colors.gray[900]}`}>Recent Events</h2>
                <Button
                  variant="outline"
                  className={`text-${colors.primary[500]} border-${colors.primary[500]}`}
                  onClick={() => window.location.href = '/events'}
                >
                  View All
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event, index) => (
                  <Link
                    href={`/events/${event.id}`}
                    key={event.id || index}
                    className="block"
                  >
                    <EventCard
                      title={event.name || 'Untitled'}
                      startDate={event.startDate}
                      location={event.location}
                      attendees={event.attendees}
                      amount={event.amount}
                      status={event.status}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </main>
        </div>
      </div>
      {user && (
        <CompleteProfileModal
          user={user}
          open={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
};

export default Dashboard;