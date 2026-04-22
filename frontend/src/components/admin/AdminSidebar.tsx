import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, PlusCircle, CalendarDays, Wrench, Home } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/overview', icon: LayoutDashboard },
    { name: 'Facilities & Assets', path: '/admin/resources', icon: Database },
    { name: 'Add New Resource', path: '/admin/resources?add=true', icon: PlusCircle }, // Handled in ManageResources
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
    { name: 'Maintenance', path: '/admin/maintenance', icon: Wrench },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors">
      {/* Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Admin Portal</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Smart Campus Hub</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/admin/resources' && item.name === 'Add New Resource' && location.search.includes('add=true'));
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <Link 
          to="/"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <Home className="w-5 h-5" />
          Exit Admin
        </Link>
      </div>
    </aside>
  );
};
