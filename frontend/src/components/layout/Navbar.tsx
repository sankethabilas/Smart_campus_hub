import { Building2, Moon, Sun, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  isAdminMode: boolean;
  onToggleAdmin: () => void;
}

export default function Navbar({ isAdminMode, onToggleAdmin }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

    // Merged links: Using 'page' for the state and 'path' for the router
    const navLinks = [
        { name: 'Home', page: 'home', path: '/' },
        { name: 'Facilities', page: 'resources', path: '/resources' },
        { name: 'Bookings', page: 'bookings', path: '/bookings' },
        { name: 'Tickets', page: 'create-ticket', path: '/tickets' },
    ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Smart Campus <span className="text-indigo-600 dark:text-indigo-400">Hub</span>
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                document.documentElement.classList.toggle('dark');
              }}
              className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              <Moon className="w-5 h-5 block dark:hidden" />
              <Sun className="w-5 h-5 hidden dark:block" />
            </button>
            
            {!isLoggedIn ? (
              <>
                <Link 
                  to="/login"
                  className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-indigo-200 dark:shadow-none transition-all hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:border-rose-800/50 dark:text-rose-400"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
