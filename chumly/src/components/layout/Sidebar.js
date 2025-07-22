'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Users,
  MapPin,
  CreditCard,
  Home,
  User,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { colors, componentStyles } from '@/lib/colors';
import { useUser } from '@/contexts/UserContext';

export default function Sidebar({ isOpen, onClose, collapsed, setCollapsed }) {
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
      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl p-4 flex flex-col lg:hidden transition-transform duration-300 transform translate-x-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-teal-800">Chumly</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link key={index} href={item.href} onClick={onClose}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start h-10 ${isActive
                      ? `${componentStyles.secondaryButton}`
                      : `text-${colors.gray[700]} hover:bg-${colors.gray[100]}`}`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="ml-3">{item.label}</span>
                    {item.count && (
                      <Badge
                        variant="secondary"
                        className={`ml-auto bg-${colors.gray[100]} text-${colors.gray[600]} text-xs`}
                      >
                        {item.count}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Mobile User Info */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 bg-gradient-to-br ${colors.gradients.primary} rounded-full flex items-center justify-center`}>
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className={`text-sm font-medium text-${colors.gray[900]}`}>{user?.name || 'Guest'}</p>
                <p className={`text-xs text-${colors.gray[500]}`}>{user?.email || ''}</p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-${colors.gray[200]} z-50
          transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        <div className="flex flex-col h-full relative">
          {/* Collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-4 top-4 z-50 bg-white border border-gray-200 shadow hidden lg:flex"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>

          {/* Header */}
          <div className={`p-4 border-b border-${colors.gray[100]} flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <div className={` flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.0" stroke="#62748e" class="size-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              {!collapsed && (
                <div>
                  <h1 className={`font-bold text-slate-800 text-4xl`}>
                    Chumly
                  </h1>
                  <p className={`text-md text-${colors.gray[500]}`}>Organize together</p>
                </div>
              )}
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
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`
                      w-full justify-start h-12 text-left
                      ${isActive
                        ? `${componentStyles.secondaryButton} shadow-sm`
                        : `text-${colors.gray[600]} hover:text-${colors.gray[900]} hover:bg-${colors.gray[50]}`
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="ml-3 font-medium">{item.label}</span>
                        {item.count && (
                          <Badge
                            variant="secondary"
                            className={`ml-auto bg-${colors.gray[100]} text-${colors.gray[600]} text-xs`}
                          >
                            {item.count}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className={`p-3 border-t border-${colors.gray[100]}`}>
            <div className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-${colors.gray[50]} cursor-pointer`}>
              <div className={`w-8 h-8 bg-gradient-to-br ${colors.gradients.primary} rounded-full flex items-center justify-center`}>
                <User className="w-4 h-4 text-white" />
              </div>
              {!collapsed && (
                <div className="flex-1">
                  <p className={`text-sm font-medium text-${colors.gray[900]}`}>{user?.name || 'Guest'}</p>
                  <p className={`text-xs text-${colors.gray[500]}`}>{user?.email || ''}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
