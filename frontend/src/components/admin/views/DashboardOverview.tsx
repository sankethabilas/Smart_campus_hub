import React, { useEffect, useState, useMemo } from 'react';
import { assetService } from '../../../services/assetService';
import { bookingService } from '../../../services/bookingService';
import type { Asset } from '../../../services/assetService';
import type { BookingResponse } from '../../../services/bookingService';
import { Database, CalendarCheck, ArrowUpRight, Filter, Activity, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

export const DashboardOverview: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7' | '30' | 'all'>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          assetService.fetchAllAssets(),
          bookingService.getAllBookings()
        ]);
        
        if (results[0].status === 'fulfilled') {
          setAssets(results[0].value || []);
        } else {
          console.error('Failed to load assets', results[0].reason);
        }

        if (results[1].status === 'fulfilled') {
          setBookings(results[1].value || []);
        } else {
          console.error('Failed to load bookings', results[1].reason);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter bookings based on date range
  const filteredBookings = useMemo(() => {
    if (dateRange === 'all') return bookings;
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - parseInt(dateRange));
    
    return bookings.filter(b => {
      const bDate = new Date(b.createdAt || b.bookingDate);
      return bDate >= pastDate;
    });
  }, [bookings, dateRange]);

  // Derived stats
  const stats = [
    { label: 'Total Resources', value: assets.length, icon: Database, color: 'bg-indigo-500' },
    { label: 'Total Bookings', value: filteredBookings.length, icon: CalendarCheck, color: 'bg-emerald-500' },
  ];

  // Most Booked Resources
  const mostBookedData = useMemo(() => {
    const counts: Record<number, number> = {};
    filteredBookings.forEach(b => {
      counts[b.assetId] = (counts[b.assetId] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([assetId, count]) => {
        const asset = assets.find(a => a.id === Number(assetId));
        return {
          name: asset ? asset.name : `Asset ${assetId}`,
          bookings: count
        };
      })
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [filteredBookings, assets]);

  // Peak Booking Hours
  const peakHoursData = useMemo(() => {
    const hours: Record<string, number> = {};
    // Initialize standard working hours (8 AM to 6 PM)
    for (let i = 8; i <= 18; i++) {
      const hourStr = `${i.toString().padStart(2, '0')}:00`;
      hours[hourStr] = 0;
    }
    
    filteredBookings.forEach(b => {
      if (b.startTime) {
        const hour = b.startTime.substring(0, 2) + ':00';
        hours[hour] = (hours[hour] || 0) + 1;
      }
    });

    return Object.entries(hours)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [filteredBookings]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{label}</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            {payload[0].value} Bookings
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">System usage and performance insights.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            <select 
              className="bg-transparent border-none text-sm text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer py-1.5 pl-2 pr-8"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7' | '30' | 'all')}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <Link 
            to="/admin/resources?add=true"
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            Add Resource
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-28 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:scale-105 transition-transform duration-300 cursor-default group">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                </div>
                <div className={`p-3.5 rounded-xl ${stat.color} bg-opacity-10 dark:bg-opacity-20 text-white shadow-inner`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Peak Booking Hours Area Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                Peak Booking Hours
              </h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" dark:stroke="#334155" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      allowDecimals={false}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorCount)" 
                      activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most Booked Resources Bar Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-500" />
                Most Booked Resources
              </h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mostBookedData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" dark:stroke="#334155" />
                    <XAxis 
                      type="number" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      allowDecimals={false}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
                      width={120}
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar 
                      dataKey="bookings" 
                      fill="#10b981" 
                      radius={[0, 6, 6, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Quick Links or Recent Assets (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recently Added Assets</h2>
              <Link to="/admin/resources" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                View Catalog <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {assets.slice(-4).reverse().map(asset => (
                <li key={asset.id} className="px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                      <Database className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{asset.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{asset.type} • Capacity: {asset.capacity}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                    asset.status === 'ACTIVE' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                  }`}>
                    {asset.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
