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


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setIsBackendConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdminMode, setIsAdminMode] = useState(false);

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
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-900 transition-colors duration-300">
      
      {/* Kept your specific isAdminMode logic here */}
      <Navbar 
        isAdminMode={isAdminMode} 
        onToggleAdmin={() => setIsAdminMode(!isAdminMode)} 
        setCurrentPage={handleSetCurrentPage} 
        currentPage={currentPage} 
      />

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
          <Route path="/tickets" element={<CreateTicket setCurrentPage={handleSetCurrentPage} />} />
          <Route path="/technician" element={<TechnicianDashboard setCurrentPage={handleSetCurrentPage} />} />
          
          {/* Admin routes - usually handled by the AdminLayout */}
          <Route path="/admin/*" element={<AdminLayout isAdminMode={isAdminMode} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;