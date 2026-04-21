import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import HowItWorks from './components/home/HowItWorks';
import CreateTicket from './components/ticket/CreateTicket';
import TechnicianDashboard from './components/ticket/TechnicianDashboard';
import TicketAdminPage from './components/ticket/TicketAdminPage';

function App() {
  const [, setIsBackendConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Background hook to verify connection for Footer LED
  useEffect(() => {
    fetch('http://localhost:8081/api/test')
      .then((res) => {
        if (res.ok) setIsBackendConnected(true);
      })
      .catch(() => setIsBackendConnected(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-900 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 overflow-x-hidden transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentPage === 'home' ? (
          <>
            {/* Home Sections */}
            <Hero setCurrentPage={setCurrentPage} />
            <Features />
            <HowItWorks />
          </>
        ) : currentPage === 'create-ticket' ? (
          <CreateTicket setCurrentPage={setCurrentPage} />
        ) : currentPage === 'technician-dashboard' ? (
          <TechnicianDashboard setCurrentPage={setCurrentPage} />
        ) : currentPage === 'ticket-admin' ? (
          <TicketAdminPage setCurrentPage={setCurrentPage} />
        ) : null}
      </main>

      {/* Optional: Modifying Footer prop dynamically to pass connection state, 
          but for simplicity maintaining it as a visual demo */}
      <Footer />
    </div>
  );
}

export default App;
