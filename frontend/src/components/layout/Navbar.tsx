import { Building2, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Facilities', href: '#' },
    { name: 'Bookings', href: '#' },
    { name: 'Tickets', href: '#' },
    { name: 'Dashboard', href: '#' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Smart Campus <span className="text-indigo-600 dark:text-indigo-400">Hub</span>
            </span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
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
            <button className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 transition-colors">
              Login
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-indigo-200 dark:shadow-none transition-all hover:shadow-md transform hover:-translate-y-0.5">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
