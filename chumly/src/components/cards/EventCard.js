'use client';

import React from 'react';
import { Calendar, MapPin, Users, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { colors, componentStyles } from '@/lib/colors';

const EventCard = ({ title, date, location, attendees, amount, status }) => {
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

  // 🧠 Defensive checks
  const formattedDate = typeof date?.toDate === 'function'
    ? date.toDate().toLocaleDateString()
    : date || 'No date';

  const attendeeCount = Array.isArray(attendees) ? attendees.length : attendees || 0;

  return (
    <Card className={`${componentStyles.cardHover} ${componentStyles.statsCard}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 
            className={`font-semibold text-${colors.gray[900]} text-sm`} 
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
        <div className={`space-y-2 text-sm text-${colors.gray[600]}`}>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
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
              <div className={`flex items-center space-x-1 text-${colors.success[600]} font-medium`}>
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
