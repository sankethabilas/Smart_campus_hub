import { CalendarDays, AlertTriangle, BarChart3, Bell } from 'lucide-react';

interface HeroProps {
  setCurrentPage?: (page: string) => void;
}

export default function Hero({ setCurrentPage }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-900 pt-16 pb-32 transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              Manage Campus <br />
              Operations <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Efficiently
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Book lecture halls, labs, and equipment. Report maintenance issues instantly. 
              Track every request from submission to resolution — all in one unified platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-lg font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 transition-all hover:-translate-y-0.5">
                <CalendarDays className="w-5 h-5" />
                Book a Facility
              </button>
              <button
                onClick={() => setCurrentPage?.('create-ticket')}
                className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-800 hover:border-indigo-200 dark:hover:border-indigo-700 text-indigo-600 dark:text-indigo-400 px-8 py-3.5 rounded-lg font-semibold hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
                <AlertTriangle className="w-5 h-5" />
                Report an Issue
              </button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-slate-500 font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                       src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                ))}
              </div>
              <p className="dark:text-slate-300">Trusted by <span className="text-slate-900 dark:text-white font-bold">10,000+</span> students & staff</p>
            </div>
          </div>

          {/* Right Mockup Dashboard */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Dashboard Window Frame */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Fake Browser Headers */}
              <div className="bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600 px-4 py-3 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Card 1 */}
                  <div className="bg-white dark:bg-slate-700 p-5 rounded-xl border border-slate-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow group">
                    <CalendarDays className="w-6 h-6 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">24</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Bookings Today</p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <AlertTriangle className="w-6 h-6 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-2xl font-bold text-slate-900 mb-1">7</p>
                    <p className="text-xs font-medium text-slate-500">Open Tickets</p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <BarChart3 className="w-6 h-6 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-2xl font-bold text-slate-900 mb-1">86%</p>
                    <p className="text-xs font-medium text-slate-500">Utilization</p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <Bell className="w-6 h-6 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-2xl font-bold text-slate-900 mb-1">3</p>
                    <p className="text-xs font-medium text-slate-500">Notifications</p>
                  </div>

                </div>

                {/* Progress bars mock */}
                <div className="mt-6 space-y-3">
                  <div className="h-4 w-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 w-3/4 animate-pulse"></div>
                  </div>
                  <div className="h-4 w-5/6 bg-indigo-50 dark:bg-indigo-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-300 w-2/3 animate-pulse" style={{ animationDelay: '500ms' }}></div>
                  </div>
                  <div className="h-4 w-full bg-indigo-50 dark:bg-indigo-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 w-[85%] animate-pulse" style={{ animationDelay: '1000ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 flex items-center gap-4 animate-bounce hover:animate-none">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-xl">✓</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">System Online</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">All services operational</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
