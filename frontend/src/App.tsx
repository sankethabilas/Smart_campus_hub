import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import HowItWorks from './components/home/HowItWorks';
import Login from './components/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import CreateTicket from './components/ticket/CreateTicket';

function App() {
	const location = useLocation();
	const [, setIsBackendConnected] = useState(false);
	const [currentPage, setCurrentPage] = useState('home');
	const isAdminMode = location.pathname.startsWith('/admin');

	// Background hook to verify connection for Footer LED
	useEffect(() => {
		fetch('http://localhost:8080/api/test')
			.then((res) => {
				if (res.ok) setIsBackendConnected(true);
			})
			.catch(() => setIsBackendConnected(false));
	}, []);

	return (
		<div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-900 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 overflow-x-hidden transition-colors duration-300">
			{/* Top Navigation */}
			<Navbar setCurrentPage={setCurrentPage} currentPage={currentPage}/>

			{/* Main Content Area */}
			<main className="grow">
				<Routes>
					<Route path="/" element={
						<>
							<Hero />
							<Features />
							<HowItWorks />
						</>
					} />

					<Route path="/login" element={<Login />} />
					<Route path="/admin/*" element={<AdminLayout isAdminMode={isAdminMode} />} />

					<Route path="/create-ticket" element={<CreateTicket />} />
				</Routes>
			</main>
			<Footer />
		</div>
	);
}




export default App;
