// components/cards/EventCard.jsx
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

  return (
    <Card className={`${componentStyles.cardHover} ${componentStyles.statsCard}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 
            className={`font-semibold text-${colors.gray[900]} text-sm`} 
            style={{ fontFamily: 'Libre Baskerville, serif' }}
          >
            {title}
          </h3>
          <Badge className={`text-xs ${statusColors[status].bg} ${statusColors[status].text}`}>
            {status}
          </Badge>
        </div>
        <div className={`space-y-2 text-sm text-${colors.gray[600]}`}>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{attendees} attending</span>
            </div>
            {amount && (
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