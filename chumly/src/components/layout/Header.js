"use client";

// components/layout/Header.jsx
import React from 'react';
import { Menu, Search, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { colors, componentStyles } from '@/lib/colors';

const Header = ({ onMenuClick }) => {
  return (
    <header className={`bg-white border-b border-${colors.gray[200]} px-4 py-3 lg:px-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-${colors.gray[400]} w-4 h-4`} />
            <Input
              placeholder="Search events, groups..."
              className={`pl-10 bg-${colors.gray[50]} border-0 focus:bg-white focus:ring-2 focus:ring-${colors.primary[500]}`}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          <Button size="sm" className={componentStyles.primaryButton}>
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;