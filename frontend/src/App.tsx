import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import HowItWorks from './components/home/HowItWorks';
import Login from './components/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import CreateTicket from './components/ticket/CreateTicket';
import TechnicianDashboard from './components/ticket/TechnicianDashboard';
import { ResourcesPage } from './components/resources/ResourcesPage';

function App() {
  const location = useLocation();
  const [, setIsBackendConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();
  const isAdminMode = location.pathname.startsWith('/admin');

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
    } else if (path.startsWith('/admin')) {
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
      <Routes>
        {/* Admin Dashboard has its own layout, no top Navbar/Footer */}
        <Route path="/admin/*" element={<AdminLayout isAdminMode={isAdminMode} />} />

        {/* Standard Pages have Navbar and Footer */}
        <Route
          path="*"
          element={
            <>
              <Navbar setCurrentPage={handleSetCurrentPage} currentPage={currentPage} />
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
                  <Route path="/login" element={<Login />} />
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
