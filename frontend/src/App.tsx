import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import HowItWorks from './components/home/HowItWorks';
import { ResourcesPage } from './components/resources/ResourcesPage';
import { AdminLayout } from './components/admin/AdminLayout';

function App() {
  const [, setIsBackendConnected] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false); // Temporary Admin Mode Toggle

  // Background hook to verify connection for Footer LED
  useEffect(() => {
    fetch('http://localhost:8082/api/test')
      .then((res) => {
        if (res.ok) setIsBackendConnected(true);
      })
      .catch(() => setIsBackendConnected(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-900 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 overflow-x-hidden transition-colors duration-300">
      
      {/* Routes without standard Navbar/Footer */}
      <Routes>
        <Route path="/admin/*" element={<AdminLayout isAdminMode={isAdminMode} />} />
        
        {/* Standard Pages */}
        <Route path="*" element={
          <>
            <Navbar isAdminMode={isAdminMode} onToggleAdmin={() => setIsAdminMode(!isAdminMode)} />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={
                  <>
                    <Hero />
                    <Features />
                    <HowItWorks />
                  </>
                } />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
      
    </div>
  );
}

export default App;
