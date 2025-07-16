import React from 'react';
import { CreditCard, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const getCurrencySymbol = (currency) => {
  return {
    USD: '$',
    EUR: '€',
    TRY: '₺',
    GBP: '£',
    JPY: '¥',
  }[currency] || currency;
};

const ExpenseCard = ({
  description,
  amount,
  currency = 'TRY',
  paidBy,
  splitType = 'equal',
  splitDetails = [],
  getUserName = (uid) => uid,
  onEdit,
}) => {
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4 space-y-3">
        {/* Top: Description and Amount */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">{description}</div>
          <div className="text-lg font-bold text-indigo-600">
            {currencySymbol}{parseFloat(amount).toFixed(2)}
          </div>
        </div>

        {/* Paid by + split type */}
        <div className="flex justify-between text-sm text-gray-500">
          <span>Paid by <span className="font-medium">{paidBy}</span></span>
          <Badge variant="outline" className="text-xs capitalize">{splitType}</Badge>
        </div>

        {/* Split details */}
        {splitDetails.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-1">Split with:</p>
            <ul className="space-y-1 text-sm text-gray-700">
              {splitDetails.map(({ uid, amount, percentage }, i) => {
                const name = getUserName(uid);
                const value =
                  splitType === 'percentage'
                    ? `${percentage}%`
                    : `${currencySymbol}${parseFloat(amount).toFixed(2)}`;
                return (
                  <li key={i} className="flex justify-between">
                    <span>{name}</span>
                    <span className="text-gray-600">{value}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Edit button */}
        {onEdit && (
          <div className="pt-3">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
