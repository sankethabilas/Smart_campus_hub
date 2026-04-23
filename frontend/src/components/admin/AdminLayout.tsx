import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { DashboardOverview } from './views/DashboardOverview';
import { ManageResources } from './views/ManageResources';
import TicketAdminPage from '../ticket/TicketAdminPage';

interface AdminLayoutProps {
  isAdminMode: boolean;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ isAdminMode }) => {
  if (!isAdminMode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            You need administrator privileges to view this area. Please toggle "Admin Mode" in the navigation bar.
          </p>
          <a href="/" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-4 md:p-8">
          <Routes>
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="resources" element={<ManageResources />} />
            <Route path="tickets" element={<TicketAdminPage />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
