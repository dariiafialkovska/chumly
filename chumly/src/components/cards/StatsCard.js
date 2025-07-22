// components/cards/StatsCard.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { colors, componentStyles } from '@/lib/colors';

const StatsCard = ({ icon: Icon, title, value, subtitle, }) => {
 

  return (
    <Card className="bg-slate-200 hover:bg-slate-300 transition-colors duration-200">
      <CardContent className="p-5">
        <div className="flex">
          
          <div className=' flex-1 space-y-1'>
            <p className={`text-5xl font-italic text-${colors.gray[900]}`}>{value}</p>
            <p className={`text-md font-medium text-${colors.gray[600]}`}>{title}</p>
            {subtitle && <p className={`text-sm text-${colors.gray[500]}`}>{subtitle}</p>}
          </div>
          <div className={`w-20 h-20   rounded-xl flex items-center justify-center`}>
            <Icon className="w-16 h-16 text-slate-500 stroke-1 hover:text-slate-700 transition-colors duration-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;