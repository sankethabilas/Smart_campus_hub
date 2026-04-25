import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import HowItWorks from './components/home/HowItWorks';
import { ResourcesPage } from './components/resources/ResourcesPage';
import { AdminLayout } from './components/admin/AdminLayout';
import CreateTicket from './components/ticket/CreateTicket';
import TechnicianDashboard from './components/ticket/TechnicianDashboard';

function App() {
  const [, setIsBackendConnected] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  // Background hook to verify connection for Footer LED
  useEffect(() => {
    fetch('http://localhost:8081/api/test')
      .then((res) => {
        if (res.ok) setIsBackendConnected(true);
      })
      .catch(() => setIsBackendConnected(false));
  }, []);

  // Sync currentPage with route changes
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentPage('home');
    } else if (path === '/resources') {
      setCurrentPage('resources');
    } else if (path === '/tickets') {
      setCurrentPage('create-ticket');
    } else if (path === '/technician') {
      setCurrentPage('technician-dashboard');
    } else if (path === '/admin') {
      setCurrentPage('ticket-admin');
    }
  }, [location.pathname]);

  // Handle page navigation
  const handleSetCurrentPage = (page: string) => {
    setCurrentPage(page);
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'resources':
        navigate('/resources');
        break;
      case 'create-ticket':
        navigate('/tickets');
        break;
      case 'technician-dashboard':
        navigate('/technician');
        break;
      case 'ticket-admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-900 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 overflow-x-hidden transition-colors duration-300">
      {/* Routes without standard Navbar/Footer */}
      <Routes>
        <Route path="/admin/*" element={<AdminLayout isAdminMode={isAdminMode} />} />

        {/* Standard Pages */}
        <Route
          path="*"
          element={
            <>
              <Navbar isAdminMode={isAdminMode} onToggleAdmin={() => setIsAdminMode(!isAdminMode)} />
              <main className="flex-grow">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Hero setCurrentPage={handleSetCurrentPage} />
                        <Features />
                        <HowItWorks />
                      </>
                    }
                  />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/tickets" element={<CreateTicket setCurrentPage={handleSetCurrentPage} />} />
                  <Route path="/technician" element={<TechnicianDashboard setCurrentPage={handleSetCurrentPage} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
