import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';


const toggleDone = async (itemId, currentValue) => {
  await updateDoc(doc(db, 'checklists', itemId), {
    done: !currentValue
  });
};

export default function ChecklistCard({ task, onToggle, onEdit }) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={task.done} onCheckedChange={() => onToggle(task)} />
          <div>
            <p className={`font-semibold ${task.done ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-gray-500">{task.description}</p>
            )}
          </div>
        </div>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
