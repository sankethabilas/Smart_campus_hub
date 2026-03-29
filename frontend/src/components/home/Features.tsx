import { CalendarDays, Wrench, BellRing, LayoutDashboard } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: 'Facility Booking',
      description: 'Reserve lecture halls, labs, and equipment with an intuitive calendar-based booking system.',
      icon: <CalendarDays className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
    {
      title: 'Incident Reporting',
      description: 'Submit maintenance tickets instantly with urgency levels, and location tagging.',
      icon: <Wrench className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
    {
      title: 'Real-time Notifications',
      description: 'Stay updated with live alerts on booking confirmations, ticket progress, and approvals.',
      icon: <BellRing className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
    {
      title: 'Admin Dashboard',
      description: 'Comprehensive analytics and management tools for campus administrators.',
      icon: <LayoutDashboard className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-800/50 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Everything You Need
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Powerful tools designed for modern campus management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.bg} dark:bg-indigo-900/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
