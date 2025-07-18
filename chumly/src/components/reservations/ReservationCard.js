import React from 'react';
import { Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ReservationCard = ({
  title,
  date,
  location,
  reservedBy,
  notes,
  getUserName = (uid) => uid,
  onEdit,
}) => {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4 space-y-3">
        {/* Title and Date */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">{title}</div>
          <div className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</div>
        </div>

        {/* Reserved By */}
        <div className="text-sm text-gray-600">
          Reserved by <span className="font-medium">{getUserName(reservedBy)}</span>
        </div>

        {/* Location and Notes */}
        {location && (
          <p className="text-sm text-gray-500">
            📍 <span className="font-medium">{location}</span>
          </p>
        )}
        {notes && (
          <p className="text-sm text-gray-500">
            📝 {notes}
          </p>
        )}

        {/* Edit Button */}
        {onEdit && (
          <div className="pt-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
