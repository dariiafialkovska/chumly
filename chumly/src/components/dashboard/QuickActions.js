'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { colors } from '@/lib/colors';
import CreateEventModal from '@/components/events/CreateEventModal';

const QuickActions = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const actions = [
    {
      icon: Plus,
      label: 'Create Event',
      action: () => setShowModal(true),
    },
    {
      icon: Users,
      label: 'Join Group',
      action: () => console.log('Join Group'),
    },
    {
      icon: MapPin,
      label: 'Add Location',
      action: () => console.log('Add Location'),
    },
    {
      icon: CreditCard,
      label: 'Split Bill',
      action: () => console.log('Split Bill'),
    },
  ];

  return (
    <>
      <h2 className={`text-xl text-${colors.gray[900]} mb-4`}>Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.action}
            className={`h-28 flex-col justify-center items-center space-y-2 shadow-md bg-slate-50 text-${colors.gray[700]} border-0 hover:bg-slate-200`}
          >
            <action.icon className="w-10 h-10" />
            <span className="text-md">{action.label}</span>
          </Button>
        ))}
      </div>

      {showModal && <CreateEventModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default QuickActions;
