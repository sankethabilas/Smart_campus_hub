import { MousePointerClick, ClipboardCheck, Eye, CalendarCheck, CheckCircle2, Box } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Select Resource',
      description: 'Browse available facilities, labs, or equipment from the catalog.',
      icon: <MousePointerClick className="w-6 h-6 text-white" />,
    },
    {
      step: '02',
      title: 'Book or Report',
      description: 'Reserve a slot or submit a maintenance ticket in seconds.',
      icon: <ClipboardCheck className="w-6 h-6 text-white" />,
    },
    {
      step: '03',
      title: 'Track Status',
      description: 'Monitor your bookings and tickets in real-time from your dashboard.',
      icon: <Eye className="w-6 h-6 text-white" />,
    },
  ];

  const stats = [
    { number: '500+', label: 'Bookings', icon: <CalendarCheck className="w-8 h-8 text-indigo-300 mx-auto mb-4" /> },
    { number: '120+', label: 'Issues Resolved', icon: <CheckCircle2 className="w-8 h-8 text-indigo-300 mx-auto mb-4" /> },
    { number: '50+', label: 'Resources Available', icon: <Box className="w-8 h-8 text-indigo-300 mx-auto mb-4" /> },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Three simple steps to streamline campus operations
          </p>
        </div>

        {/* Steps */}
        <div className="relative mb-32">
          {/* Connecting Line mapping across logic */}
          <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-indigo-100 dark:bg-indigo-800 z-0"></div>
          
          <div className="grid md:grid-cols-3 gap-12 relative z-10 text-center">
            {steps.map((item, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 group-hover:bg-indigo-700 transition-colors transform group-hover:scale-110 duration-300 group-hover:-rotate-3">
                  {item.icon}
                </div>
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mb-2">
                  Step {item.step}
                </h4>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Section (Added at the bottom of HowItWorks as seen in screenshot) */}
        <div className="mt-16 bg-slate-50 dark:bg-slate-800 rounded-3xl p-12 border border-slate-100 dark:border-slate-700 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
            {stats.map((stat, i) => (
              <div key={i} className={`pt-8 md:pt-0 ${i !== 0 ? 'md:pl-8' : ''}`}>
                <div className="transform hover:scale-105 transition-transform duration-300">
                  {stat.icon}
                  <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    {stat.number}
                  </p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
