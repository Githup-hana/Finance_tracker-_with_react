import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home: React.FC = () => {
	const { user, loading } = useAuth();
	
	// Show loading spinner while checking authentication
	if (loading) {
		return <LoadingSpinner fullScreen={true} />;
	}
	
	// Redirect authenticated users to dashboard
	if (user) {
		return <Navigate to="/dashboard" replace />;
	}
	
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col justify-center items-center px-4 py-8">
			{/* Header Section */}
			<div className="text-center mb-12 max-w-4xl">
				<h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-2xl">
					💰 Finance Tracker
				</h1>
				<p className="text-xl text-white/90 leading-relaxed drop-shadow-lg">
					Verwalte deine Finanzen intelligent und behalte deine Ziele im Blick
				</p>
			</div>
			
			{/* Feature Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
				{/* Tracker Card */}
				<div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 hover:scale-[1.04] transition-transform duration-200 border-t-8 border-blue-700">
					<div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4 shadow-lg">
						<svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-blue-800 mb-2">Finance Tracker</h2>
					<p className="text-gray-800 text-center mb-6">Verwalte deine Einnahmen und Ausgaben einfach und übersichtlich.</p>
					<Link to="/login" className="w-full py-3 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-900 transition">Jetzt starten</Link>
				</div>
				
				{/* Transactions Card */}
				<div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 hover:scale-[1.04] transition-transform duration-200 border-t-8 border-green-700">
					<div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4 shadow-lg">
						<svg className="w-10 h-10 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-green-800 mb-2">Transaktionen</h2>
					<p className="text-gray-800 text-center mb-6">Behalte alle deine Transaktionen im Blick und filtere nach Kategorie.</p>
					<Link to="/register" className="w-full py-3 bg-green-700 text-white rounded-lg font-semibold shadow hover:bg-green-900 transition">Registrieren</Link>
				</div>
				
				{/* Investments Card */}
				<div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 hover:scale-[1.04] transition-transform duration-200 border-t-8 border-purple-700">
					<div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 mb-4 shadow-lg">
						<svg className="w-10 h-10 text-purple-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-purple-800 mb-2">Investments</h2>
					<p className="text-gray-800 text-center mb-6">Analysiere deine Investments, Gewinne und Verluste übersichtlich.</p>
					<Link to="/register" className="w-full py-3 bg-purple-700 text-white rounded-lg font-semibold shadow hover:bg-purple-900 transition">Investieren starten</Link>
				</div>
				
				{/* Crypto Card */}
				<div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 hover:scale-[1.04] transition-transform duration-200 border-t-8 border-yellow-500">
					<div className="w-16 h-16 flex items-center justify-center rounded-full bg-yellow-100 mb-4 shadow-lg">
						<svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-yellow-700 mb-2">Krypto-Preise</h2>
					<p className="text-gray-800 text-center mb-6">Checke aktuelle Krypto-Preise und verfolge deine Coins.</p>
					<Link to="/register" className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold shadow hover:bg-yellow-600 transition">Krypto entdecken</Link>
				</div>
			</div>
			
			{/* Footer Info */}
			<div className="text-center text-white/90 text-base mb-4 drop-shadow-lg">
				Deine Daten bleiben sicher im Browser gespeichert.<br />
				Viel Erfolg beim Finanzmanagement! 🚀
			</div>
		</div>
	);
};

export default Home;
