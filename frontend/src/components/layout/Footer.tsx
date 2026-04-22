import { Building2 } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    Product: ['Resources', 'Bookings', 'Tickets', 'Dashboard'],
    Company: ['About', 'Careers', 'Blog', 'Press'],
    Support: ['Help Center', 'Contact Us', 'Privacy', 'Terms'],
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-24 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">
          
          {/* Logo & Description */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 cursor-pointer group">
              <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Smart Campus <span className="text-indigo-600 dark:text-indigo-400">Hub</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Simplifying campus facility management and maintenance for universities.
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Smart Campus Operations Hub. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Optional indicator placeholder for backend test */}
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 py-1 px-3 rounded-full border border-slate-100 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Systems Operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
