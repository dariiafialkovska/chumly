'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, MapPin, CreditCard, Home, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { colors, componentStyles } from '@/lib/colors';
import { useUser } from '@/contexts/UserContext';

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const user = useUser();

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Events', href: '/events', count: 5 },
    { icon: Users, label: 'Groups', href: '/groups', count: 3 },
    { icon: MapPin, label: 'Locations', href: '/locations' },
    { icon: CreditCard, label: 'Expenses', href: '/expenses' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white border-r border-${colors.gray[200]} z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 lg:w-16 lg:hover:w-64 lg:transition-all lg:duration-300 group
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-4 border-b border-${colors.gray[100]} flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${colors.gradients.primary} rounded-xl flex items-center justify-center shadow-lg`}>
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="lg:group-hover:block lg:hidden block">
                <h1 className={`font-bold text-${colors.gray[900]} text-lg`} style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  Chumly
                </h1>
                <p className={`text-xs text-${colors.gray[500]}`}>Organize together</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link href={item.href} key={index}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`
                      w-full justify-start h-12 text-left
                      ${isActive
                        ? `${componentStyles.secondaryButton} shadow-sm`
                        : `text-${colors.gray[600]} hover:text-${colors.gray[900]} hover:bg-${colors.gray[50]}`
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="ml-3 font-medium lg:group-hover:block lg:hidden block">
                      {item.label}
                    </span>
                    {item.count && (
                      <Badge
                        variant="secondary"
                        className={`ml-auto lg:group-hover:block lg:hidden block bg-${colors.gray[100]} text-${colors.gray[600]} text-xs`}
                      >
                        {item.count}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className={`p-3 border-t border-${colors.gray[100]}`}>
            <div className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-${colors.gray[50]} cursor-pointer`}>
              <div className={`w-8 h-8 bg-gradient-to-br ${colors.gradients.primary} rounded-full flex items-center justify-center`}>
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="lg:group-hover:block lg:hidden block flex-1">
                <p className={`text-sm font-medium text-${colors.gray[900]}`}>{user?.name || 'Guest'}</p>
                <p className={`text-xs text-${colors.gray[500]}`}>{user?.email || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
