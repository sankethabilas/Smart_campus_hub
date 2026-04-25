import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import HowItWorks from './components/home/HowItWorks';
import { ResourcesPage } from './components/resources/ResourcesPage';
import { MyBookingsPage } from './components/bookings/MyBookingsPage';
import Login from './components/Login';
import Register from './components/layout/Register';
import { AdminLayout } from './components/admin/AdminLayout';
import CreateTicket from './components/ticket/CreateTicket';
import TechnicianDashboard from './components/ticket/TechnicianDashboard';
import UserDashboard from './components/user/UserDashboard';
import OAuthSuccess from './components/OAuthSuccess';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- Admin Logic (Kept from Incoming) ---
  const [isAdminModeState, setIsAdminModeState] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const isAdminModeComputed = location.pathname.startsWith('/admin') || isAdminModeState || isAdminMode;

  // --- Other Logic (Best Options) ---
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Keep the backend connection check from stashed (useful for the footer)
  useEffect(() => {
    // You can uncomment this when your BACKEND_URL is defined
    /*
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/test`)
      .then((res) => { if (res.ok) setIsBackendConnected(true); })
      .catch(() => setIsBackendConnected(false));
    */
  }, []);

  // Sync currentPage with route changes
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setCurrentPage('home');
    else if (path === '/resources') setCurrentPage('resources');
    else if (path === '/tickets') setCurrentPage('create-ticket');
    else if (path === '/technician') setCurrentPage('technician-dashboard');
    else if (path.startsWith('/admin')) setCurrentPage('ticket-admin');
  }, [location.pathname]);

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
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-900 transition-colors duration-300">
      
      {!isAdminModeComputed && (
        <Navbar 
          isAdminMode={isAdminModeComputed}
          onToggleAdmin={() => setIsAdminModeState(!isAdminModeState)}
          setCurrentPage={handleSetCurrentPage} 
          currentPage={currentPage} 
        />
      )}

      <main className="grow">
        <Routes>
          <Route path="/" element={
            <>
              <Hero setCurrentPage={handleSetCurrentPage} />
              <Features />
              <HowItWorks />
            </>
          } />

          <Route path="/login" element={<Login setIsAdminMode={setIsAdminMode} />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/tickets" element={<CreateTicket setCurrentPage={handleSetCurrentPage} />} />
          <Route path="/technician" element={<TechnicianDashboard setCurrentPage={handleSetCurrentPage} />} />

          <Route path="/admin/*" element={<AdminLayout isAdminMode={isAdminModeComputed} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminModeComputed && <Footer isConnected={isBackendConnected} />}
    </div>
  );
}

export default App;