import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bookingService } from '../../services/bookingService';
import type { Asset } from '../../services/assetService';
import { format } from 'date-fns';

interface BookResourceModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookResourceModal: React.FC<BookResourceModalProps> = ({ asset, isOpen, onClose, onSuccess }) => {
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [purpose, setPurpose] = useState('');
  const [headcount, setHeadcount] = useState<number | ''>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !asset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !startTime || !endTime || !purpose || !headcount) {
      setError('Please fill in all required fields.');
      return;
    }
    if (startTime >= endTime) {
      setError('End time must be after start time.');
      return;
    }
    if (asset.capacity && Number(headcount) > asset.capacity) {
      setError(`Headcount cannot exceed resource capacity of ${asset.capacity}.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await bookingService.createBooking({
        assetId: asset.id,
        bookingDate: format(bookingDate, 'yyyy-MM-dd'),
        startTime: format(startTime, 'HH:mm:ss'),
        endTime: format(endTime, 'HH:mm:ss'),
        purpose,
        headcount: Number(headcount),
      });
      onSuccess();
      onClose();
      setBookingDate(null);
      setStartTime(null);
      setEndTime(null);
      setPurpose('');
      setHeadcount('');
    } catch (err: unknown) {
      const e = err as { response?: { data?: string } };
      setError(e.response?.data || 'Failed to create booking. Time slot might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm';

  return (
    <>
      {/* Inject custom styles for react-datepicker dark mode */}
      <style>{`
        .booking-datepicker .react-datepicker {
          font-family: inherit;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 20px 60px -10px rgba(0,0,0,0.15);
        }
        .dark .booking-datepicker .react-datepicker {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }
        .dark .booking-datepicker .react-datepicker__header {
          background: #0f172a;
          border-bottom-color: #334155;
        }
        .dark .booking-datepicker .react-datepicker__current-month,
        .dark .booking-datepicker .react-datepicker__day-name,
        .dark .booking-datepicker .react-datepicker__time-list-item {
          color: #f1f5f9;
        }
        .dark .booking-datepicker .react-datepicker__day {
          color: #cbd5e1;
        }
        .dark .booking-datepicker .react-datepicker__day:hover {
          background: #334155;
          border-radius: 50%;
        }
        .dark .booking-datepicker .react-datepicker__day--selected,
        .dark .booking-datepicker .react-datepicker__time-list-item--selected {
          background: #4f46e5 !important;
          color: white;
        }
        .dark .booking-datepicker .react-datepicker__day--disabled {
          color: #475569;
        }
        .dark .booking-datepicker .react-datepicker__time-container {
          border-left-color: #334155;
        }
        .dark .booking-datepicker .react-datepicker__time {
          background: #1e293b;
        }
        .dark .booking-datepicker .react-datepicker__time-list-item:hover {
          background: #334155 !important;
        }
        .booking-datepicker .react-datepicker__day--selected {
          background: #4f46e5;
          border-radius: 50%;
        }
        .booking-datepicker .react-datepicker__day--today {
          font-weight: 700;
          color: #4f46e5;
        }
        .dark .booking-datepicker .react-datepicker__day--today {
          color: #818cf8;
        }
        .booking-datepicker .react-datepicker-wrapper {
          width: 100%;
        }
        .booking-datepicker .react-datepicker__input-container input {
          width: 100%;
        }
        .booking-datepicker .react-datepicker__navigation-icon::before {
          border-color: #64748b;
        }
        .dark .booking-datepicker .react-datepicker__navigation-icon::before {
          border-color: #94a3b8;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Book Resource</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{asset.name} · {asset.type}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 booking-datepicker">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Date */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" /> Date
              </label>
              <DatePicker
                selected={bookingDate}
                onChange={(date: Date | null) => setBookingDate(date)}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                placeholderText="Pick a date…"
                className={inputClass}
                calendarClassName="booking-cal"
                showPopperArrow={false}
                required
              />
            </div>

            {/* Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <Clock className="w-4 h-4 text-indigo-500" /> Start Time
                </label>
                <DatePicker
                  selected={startTime}
                  onChange={(date: Date | null) => setStartTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Start"
                  dateFormat="h:mm aa"
                  placeholderText="Pick time…"
                  className={inputClass}
                  showPopperArrow={false}
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <Clock className="w-4 h-4 text-indigo-500" /> End Time
                </label>
                <DatePicker
                  selected={endTime}
                  onChange={(date: Date | null) => setEndTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="End"
                  dateFormat="h:mm aa"
                  placeholderText="Pick time…"
                  className={inputClass}
                  minTime={startTime ?? undefined}
                  maxTime={startTime ? new Date(startTime.getTime() + 8 * 60 * 60 * 1000) : undefined}
                  showPopperArrow={false}
                  required
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Purpose</label>
              <input
                type="text"
                required
                placeholder="e.g., Team Meeting, Lecture, Exam"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Headcount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Expected Attendees</label>
              <input
                type="number"
                min="1"
                required
                value={headcount}
                onChange={(e) => setHeadcount(e.target.value ? Number(e.target.value) : '')}
                className={inputClass}
              />
              {asset.capacity && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>
                  Max capacity: <strong>{asset.capacity}</strong>
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm shadow-indigo-200 dark:shadow-none disabled:opacity-50"
              >
                {loading ? 'Submitting…' : 'Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
