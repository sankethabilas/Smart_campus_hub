import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, XCircle, Users } from 'lucide-react';
import { bookingService, BookingResponse } from '../../services/bookingService';

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.cancelBooking(id);
      loadBookings();
    } catch (err) {
      alert('Failed to cancel booking.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">🟡 PENDING</span>;
      case 'APPROVED':
        return <span className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">🟢 APPROVED</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 rounded-full">🔴 REJECTED</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 rounded-full">⚫ CANCELLED</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Bookings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage your resource reservations.</p>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No bookings yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">You haven't made any resource reservations.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {booking.assetName} <span className="text-sm font-normal text-slate-500">({booking.assetType})</span>
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {booking.bookingDate}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {booking.startTime.substring(0, 5)} – {booking.endTime.substring(0, 5)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-slate-400" />
                        {booking.headcount} attendees
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Purpose: </span>
                      <span className="text-slate-600 dark:text-slate-400">{booking.purpose}</span>
                    </div>

                    {booking.status === 'REJECTED' && booking.reviewReason && (
                      <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-sm rounded-lg border border-rose-100 dark:border-rose-900/30">
                        <span className="font-semibold">Reason for rejection:</span> {booking.reviewReason}
                      </div>
                    )}
                  </div>

                  {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-rose-400 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
