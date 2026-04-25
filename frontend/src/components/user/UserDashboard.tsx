import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, Loader2, 
  Edit2, Check, X, LogOut, LayoutDashboard, Ticket, ChevronRight, AlertTriangle 
} from 'lucide-react';

export default function UserDashboard() {
  const navigate = useNavigate();
  
  // States
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets'>('overview');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    fetch('http://localhost:8080/auth/me', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUser(data);
        setFormData({ name: data.name || '', email: data.email || '', phone: data.phone || '' });
      })
      .catch(() => setMessage({ type: 'error', text: 'Failed to load profile data.' }))
      .finally(() => setLoading(false));
  };

  const handleUpdate = async () => {
    // 1. Update Confirmation
    const confirmUpdate = window.confirm("Save changes to your profile?");
    if (!confirmUpdate) return;

    setUpdating(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) localStorage.setItem('token', data.token);
        setUser(data.user || data);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Update failed. Please check your inputs.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Try again later.' });
    } finally {
      setUpdating(false);
      setTimeout(() => setMessage(null), 3000); // Clear message after 3s
    }
  };

  const handleDeleteAccount = async () => {
    // 2. Delete Confirmation
    const confirmDelete = window.confirm(
      "CRITICAL ACTION: Are you sure you want to permanently delete your account? This cannot be undone."
    );
    
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });

      if (response.ok) {
        alert("Your account has been deleted.");
        handleLogout();
      } else {
        setMessage({ type: 'error', text: 'Could not delete account. Contact support.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error during deletion.' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-indigo-600">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-10">
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg" />
            AppPortal
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>
          <Link to="/tickets" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium">
            <Ticket className="w-5 h-5" /> My Tickets
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-medium">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Toast Notification */}
        {message && (
          <div className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-top-4 duration-300 z-50 flex items-center gap-2 font-medium ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {message.type === 'success' ? <Check className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}
            {message.text}
          </div>
        )}

        <header className="mb-8">
          <h2 className="text-3xl font-bold capitalize">{activeTab}</h2>
          <p className="text-slate-500 mt-1">Manage your account and support requests.</p>
        </header>

        {activeTab === 'overview' ? (
          <div className="max-w-4xl space-y-8">
            {/* PROFILE CARD */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{user?.name}</h3>
                    <p className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded inline-block mt-1 uppercase tracking-wider">Active Account</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all text-sm font-semibold"
                >
                  {isEditing ? <><X className="w-4 h-4 text-red-500"/> Cancel</> : <><Edit2 className="w-4 h-4"/> Edit Profile</>}
                </button>
              </div>

              <div className="p-8">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500">Full Name</label>
                      <input className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500">Email Address</label>
                      <input className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500">Phone Number</label>
                      <input className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 pt-4">
                      <button onClick={handleUpdate} disabled={updating} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none">
                        {updating ? <Loader2 className="w-5 h-5 animate-spin"/> : <Check className="w-5 h-5"/>} Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Mail className="w-3 h-3"/> Email Address</p>
                      <p className="text-sm font-medium">{user?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Phone className="w-3 h-3"/> Phone Number</p>
                      <p className="text-sm font-medium">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DANGER ZONE (Account Deletion) */}
            {!isEditing && (
              <div className="p-6 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-red-700 dark:text-red-400 font-bold">Delete Account</h4>
                  <p className="text-red-600/70 dark:text-red-400/50 text-sm mt-0.5">Permanently remove your account and all associated data.</p>
                </div>
                <button onClick={handleDeleteAccount} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-all shadow-md">
                  Delete Account
                </button>
              </div>
            )}
          </div>
        ) : (
          /* TICKETS PREVIEW */
          <div className="max-w-4xl space-y-6">
            <div className="bg-indigo-600 rounded-2xl p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Support Portal</h3>
                <p className="opacity-80">Check the status of your tickets or create a new one.</p>
              </div>
              <Link to="/tickets" className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                Go to Tickets <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}