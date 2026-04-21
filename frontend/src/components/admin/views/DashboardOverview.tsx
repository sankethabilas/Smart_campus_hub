import React, { useEffect, useState } from 'react';
import { assetService } from '../../../services/assetService';
import type { Asset } from '../../../services/assetService';
import { Database, Activity, ServerCrash, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardOverview: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assetService.fetchAllAssets().then(data => {
      setAssets(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: 'Total Resources', value: assets.length, icon: Database, color: 'bg-indigo-500' },
    { label: 'Active Facilities', value: assets.filter(a => a.status === 'ACTIVE').length, icon: Activity, color: 'bg-emerald-500' },
    { label: 'Out of Service', value: assets.filter(a => a.status === 'OUT_OF_SERVICE').length, icon: ServerCrash, color: 'bg-rose-500' },
    { label: 'Total Capacity', value: assets.reduce((sum, a) => sum + a.capacity, 0), icon: Users, color: 'bg-amber-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time metrics and alerts for campus facilities.</p>
        </div>
        <Link 
          to="/admin/resources?add=true"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          Add New Resource
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex items-start justify-between group">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 text-white shadow-sm`}>
                <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity placeholder */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Assets Added</h2>
          <Link to="/admin/resources" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-0">
          <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {assets.slice(-5).reverse().map(asset => (
              <li key={asset.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{asset.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Type: {asset.type} • Capacity: {asset.capacity}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  asset.status === 'ACTIVE' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                }`}>
                  {asset.status}
                </span>
              </li>
            ))}
            {assets.length === 0 && !loading && (
              <li className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No recent activity to display.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
