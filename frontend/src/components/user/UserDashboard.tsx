import { useEffect, useState } from 'react';
import { User, Mail, Phone, Fingerprint, Loader2, Edit2, Check, X } from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/auth/me', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUser(data);
        setFormData({ name: data.name, email: data.email, phone: data.phone || '' });
      })
      .catch(() => console.error("Could not load user"))
      .finally(() => setLoading(false));
  };

  const handleUpdate = async () => {
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
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message || 'Check your inputs'}`);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) return <div className="p-8 text-center text-red-500">User not found.</div>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="h-24 bg-indigo-600 flex items-end justify-center pb-4 relative">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          </button>
          <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center -mb-10 shadow-md">
            <User className="w-10 h-10 text-slate-400" />
          </div>
        </div>

        <div className="pt-12 pb-8 px-8">
          {isEditing ? (
            /* EDIT MODE FORM */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                <input 
                  type="text"
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                <input 
                  type="email"
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Phone (10 Digits)</label>
                <input 
                  type="text"
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <button 
                onClick={handleUpdate}
                disabled={updating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Save Changes</>}
              </button>
            </div>
          ) : (
            /* VIEW MODE */
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-6">Verified User</p>

              <div className="space-y-4 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm">{user.phone || "No phone added"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 italic">
                  <Fingerprint className="w-4 h-4" />
                  <span className="text-xs">User ID: {user.id}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}