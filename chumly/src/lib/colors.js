// lib/colors.js - Centralized Color System
// Change the PRIMARY_COLOR to easily theme your entire app

const PRIMARY_COLOR = 'teal'; // Change this to: blue, purple, green, orange, etc.

export const colors = {
  // Primary color variations
  primary: {
    50: `${PRIMARY_COLOR}-50`,
    100: `${PRIMARY_COLOR}-100`,
    200: `${PRIMARY_COLOR}-200`,
    500: `${PRIMARY_COLOR}-500`,
    600: `${PRIMARY_COLOR}-600`,
    700: `${PRIMARY_COLOR}-700`,
  },
  
  // Gradient combinations
   gradients: {
    primary: `from-${PRIMARY_COLOR}-500 to-${PRIMARY_COLOR === 'indigo' ? 'purple' : PRIMARY_COLOR}-600`,
    primaryDark: `from-${PRIMARY_COLOR}-600 to-${PRIMARY_COLOR === 'indigo' ? 'purple' : PRIMARY_COLOR}-700`,
  },
  
  // State colors (fixed)
  success: {
    50: 'green-50',
    100: 'green-100',
    500: 'green-500',
    600: 'green-600',
    800: 'green-800',
  },
  
  warning: {
    50: 'orange-50',
    100: 'orange-100',
    500: 'orange-500',
    600: 'orange-600',
    800: 'orange-800',
  },
  
  info: {
    50: 'blue-50',
    100: 'blue-100',
    500: 'blue-500',
    600: 'blue-600',
    800: 'blue-800',
  },
  
  // Neutral colors
  gray: {
    50: 'gray-50',
    100: 'gray-100',
    200: 'gray-200',
    400: 'gray-400',
    500: 'gray-500',
    600: 'gray-600',
    700: 'gray-700',
    800: 'gray-800',
    900: 'gray-900',
  }
};

// Helper function to get Tailwind classes
export const getColorClass = (type, shade, prefix = '') => {
  return `${prefix}${colors[type][shade]}`;
};

// Pre-built component classes for consistency
export const componentStyles = {
  // Button styles
  primaryButton: `bg-${colors.primary[600]} hover:bg-${colors.primary[700]} text-white`,
  secondaryButton: `bg-${colors.primary[50]} text-${colors.primary[700]} hover:bg-${colors.primary[100]} border border-${colors.primary[200]}`,
  
  // Card styles
  primaryCard: `bg-gradient-to-br ${colors.gradients.primary}`,
  statsCard: 'border-0 shadow-sm bg-white',
  
  // Text styles
  primaryText: `text-${colors.primary[700]}`,
  mutedText: `text-${colors.gray[600]}`,
  
  // Background styles
  primaryBg: `bg-${colors.primary[50]}`,
  cardHover: 'hover:shadow-md transition-shadow duration-200',
};