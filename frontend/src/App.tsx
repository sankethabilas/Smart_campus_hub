import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import HowItWorks from './components/home/HowItWorks';
import Login from './components/Login';
import Register from './components/layout/Register';
import { AdminLayout } from './components/admin/AdminLayout';
import CreateTicket from './components/ticket/CreateTicket';
import TechnicianDashboard from './components/ticket/TechnicianDashboard';
import { ResourcesPage } from './components/resources/ResourcesPage';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  


  // Verify backend connection
  // useEffect(() => {
  //   fetch(`${BACKEND_URL}/api/test`)
  //     .then((res) => {
  //       if (res.ok) setIsBackendConnected(true);
  //     })
  //     .catch(() => setIsBackendConnected(false));
  // }, [BACKEND_URL]);

  // Sync currentPage with route changes for UI highlights
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setCurrentPage('home');
    else if (path === '/resources') setCurrentPage('resources');
    else if (path === '/tickets') setCurrentPage('create-ticket');
    else if (path === '/technician') setCurrentPage('technician-dashboard');
    else if (path.startsWith('/admin')) setCurrentPage('ticket-admin');
  }, [location.pathname]);

  // Centralized navigation handler
  const handleSetCurrentPage = (page: string) => {
    setCurrentPage(page);
    switch (page) {
      case 'home': navigate('/'); break;
      case 'resources': navigate('/resources'); break;
      case 'create-ticket': navigate('/tickets'); break;
      case 'technician-dashboard': navigate('/technician'); break;
      case 'ticket-admin': navigate('/admin'); break;
      default: navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-900 selection:bg-indigo-100 dark:selection:bg-indigo-900 transition-colors duration-300">
      
      {/* Only show standard Navbar if NOT in admin mode. 
          AdminLayout usually provides its own sidebar/nav.
      */}
      {!isAdminMode && (
        <Navbar 
          setCurrentPage={handleSetCurrentPage} 
          currentPage={currentPage} 
        />
      )}

      <main className="grow">
        <Routes>
          {/* Landing Page Group */}
          <Route path="/" element={
            <>
              <Hero setCurrentPage={handleSetCurrentPage} />
              <Features />
              <HowItWorks />
            </>
          } />

          <Route path="/login" element={<Login setIsAdminMode={setIsAdminMode} />} />
          <Route path="/signup" element={<Register />} />

          {/* Feature Routes */}
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/tickets" element={<CreateTicket setCurrentPage={handleSetCurrentPage} />} />
          <Route path="/technician" element={<TechnicianDashboard setCurrentPage={handleSetCurrentPage} />} />

          {/* Admin Routes (Nested) */}
          <Route path="/admin/*" element={<AdminLayout isAdminMode={isAdminMode} />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminMode && <Footer isConnected={isBackendConnected} />}
    </div>
  );
}

export default App;