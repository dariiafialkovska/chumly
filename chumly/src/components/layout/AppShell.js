'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // control << toggle

  return (
    <div className="flex min-h-screen bg-gray-50">
<Sidebar
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  collapsed={collapsed}
  setCollapsed={setCollapsed}
/>
      <div className={`transition-all duration-300 w-full ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <main className="p-4 lg:p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}
