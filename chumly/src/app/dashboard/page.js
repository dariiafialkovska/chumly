"use client";

// app/dashboard/page.jsx
import React, { useState ,useEffect} from 'react';
import { Calendar, Users, MapPin, CreditCard } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import EventCard from '@/components/cards/EventCard';
import StatsCard from '@/components/cards/StatsCard';
import QuickActions from '@/components/dashboard/QuickActions';
import { colors, componentStyles } from '@/lib/colors';

import { useUser } from '@/contexts/UserContext';


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useUser();
  // Sample data - replace with your API calls
  const events = [
    {
      title: "Beach Volleyball Tournament",
      date: "June 15, 2025",
      location: "Santa Monica Beach",
      attendees: 12,
      amount: 45,
      status: "upcoming"
    },
    {
      title: "Movie Night",
      date: "June 12, 2025",
      location: "Central Park",
      attendees: 8,
      amount: 25,
      status: "ongoing"
    },
    {
      title: "Hiking Adventure",
      date: "June 8, 2025",
      location: "Mountain Trail",
      attendees: 15,
      amount: 80,
      status: "completed"
    }
  ];

  const stats = [
    { icon: Calendar, title: "Events", value: "12", subtitle: "This month", colorType: "primary" },
    { icon: Users, title: "Groups", value: "5", subtitle: "Active", colorType: "success" },
    { icon: CreditCard, title: "Expenses", value: "$342", subtitle: "This month", colorType: "warning" },
    { icon: MapPin, title: "Locations", value: "8", subtitle: "Saved", colorType: "info" },
  ];

  return (
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
              You have 3 upcoming events and 2 pending expenses to settle.
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
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;