'use client';

import React from 'react';
import { Calendar, MapPin, Users, CreditCard, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { colors, componentStyles } from '@/lib/colors';

const EventCard = ({ title, startDate, location, attendees, amount, status }) => {
  const statusColors = {
    upcoming: {
      bg: `bg-${colors.info[100]}`,
      text: `text-${colors.info[800]}`
    },
    ongoing: {
      bg: `bg-${colors.success[100]}`,
      text: `text-${colors.success[800]}`
    },
    completed: {
      bg: `bg-${colors.gray[100]}`,
      text: `text-${colors.gray[800]}`
    }
  };

  // Format date
  const formattedDate = typeof startDate?.toDate === 'function'
    ? startDate.toDate().toLocaleDateString()
    : 'No date';

  // Calculate days left
  const getDaysLeft = () => {
    if (!startDate || typeof startDate.toDate !== 'function') return null;
    const eventDate = startDate.toDate();
    const today = new Date();
    const diffTime = eventDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return `in ${diffDays} days`;
    if (diffDays === 1) return 'tomorrow';
    if (diffDays === 0) return 'today';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  };

  const daysLeftText = getDaysLeft();

  const attendeeCount = Array.isArray(attendees) ? attendees.length : attendees || 0;

  return (
    <Card className="bg-slate-500 hover:bg-slate-300 transition-colors duration-200 text-slate-200 hover:text-slate-600">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 
            className={` text-3xl`} 
            style={{ fontFamily: 'Libre Baskerville, serif' }}
          >
            {title || 'Untitled Event'}
          </h3>
          {status && statusColors[status] && (
            <Badge className={`text-xs ${statusColors[status].bg} ${statusColors[status].text}`}>
              {status}
            </Badge>
          )}
        </div>

        <div className={`space-y-2 text-sm `}>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          
          {daysLeftText && (
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4" />
              <span>{daysLeftText}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{location || 'No location'}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{attendeeCount} attending</span>
            </div>
            {amount !== undefined && amount !== null && (
              <div className={`flex items-center space-x-1  font-medium`}>
                <CreditCard className="w-4 h-4" />
                <span>${amount}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
