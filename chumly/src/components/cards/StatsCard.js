// components/cards/StatsCard.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { colors, componentStyles } from '@/lib/colors';

const StatsCard = ({ icon: Icon, title, value, subtitle, colorType = "primary" }) => {
  const colorClasses = {
    primary: colors.gradients.primary,
    success: `from-${colors.success[500]} to-${colors.success[600]}`,
    warning: `from-${colors.warning[500]} to-${colors.warning[600]}`,
    info: `from-${colors.info[500]} to-${colors.info[600]}`
  };

  return (
    <Card className={componentStyles.statsCard}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[colorType]} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className={`text-2xl font-bold text-${colors.gray[900]}`}>{value}</p>
            <p className={`text-sm font-medium text-${colors.gray[600]}`}>{title}</p>
            {subtitle && <p className={`text-xs text-${colors.gray[500]}`}>{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;