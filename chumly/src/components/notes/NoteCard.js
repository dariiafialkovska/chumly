import { Card, CardContent } from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NoteCard({ content, authorName, updatedAt, onEdit }) {
  return (
    <Card className="shadow-sm border">
      <CardContent className="p-4 space-y-2">
        <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
        <div className="text-xs text-gray-500">
          {authorName && <span>✍️ {authorName}</span>}
          {updatedAt && (
            <span className="ml-2">🕒 {updatedAt.toDate().toLocaleString()}</span>
          )}
        </div>
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
}
