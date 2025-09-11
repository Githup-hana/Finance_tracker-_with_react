
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
	const { isAuthenticated, loading } = useAuth();

	// Redirect authenticated users to dashboard
	if (!loading && isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	// Show loading state
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	// Show landing page for non-authenticated users
	return (
		<section className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 pt-16 pb-10 relative">
			<div className="relative z-10 w-full flex flex-col items-center mb-12">
				<h1 className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-2xl mb-4 text-center">
					Willkommen beim Finance Tracker
				</h1>
				<p className="text-lg sm:text-2xl text-white/90 mb-10 text-center max-w-2xl drop-shadow-lg">
					Deine zentrale Plattform für smarte Finanzen, Investments und Krypto – alles auf einen Blick, modern, sicher und einfach.
				</p>
				
				{/* Call to Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 mb-12">
					<Link 
						to="/register" 
						className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
					>
						Kostenlos registrieren
					</Link>
					<Link 
						to="/login" 
						className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
					>
						Anmelden
					</Link>
				</div>
			</div>
			
			{/* Feature Cards for non-authenticated users */}
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
					<Link to="/login" className="w-full py-3 bg-purple-700 text-white rounded-lg font-semibold shadow hover:bg-purple-900 transition">Mehr erfahren</Link>
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
					<Link to="/register" className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold shadow hover:bg-yellow-600 transition">Kostenlos testen</Link>
				</div>
			</div>

			{/* Benefits Section */}
			<div className="text-center text-white/90 text-base mb-4 drop-shadow-lg">
				Deine Daten bleiben sicher im Browser gespeichert.<br />Viel Erfolg beim Finanzmanagement! 🚀
			</div>
			<div className="text-center mt-2">
				<span className="inline-block bg-white/90 px-4 py-2 rounded shadow text-blue-900 text-base font-semibold">
					Noch kein Account?{' '}
					<Link to="/register" className="text-blue-800 font-bold hover:underline">Jetzt registrieren</Link>
				</span>
			</div>
		</section>
	);
}

export default Home;
					{/* Dashboard Card */}
					<div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 hover:scale-[1.04] transition-transform duration-200 border-t-8 border-indigo-600">
						<div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 mb-4 shadow-lg">
							<svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</div>
						<h2 className="text-2xl font-bold text-indigo-800 mb-2">Dashboard</h2>
						<p className="text-gray-800 text-center mb-6">Überblick über alle deine Finanzen und Statistiken.</p>
						<Link to="/dashboard" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition">Zum Dashboard</Link>
					</div>
					
					{/* Tracker Card */}
					<div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 hover:scale-[1.04] transition-transform duration-200 border-t-8 border-blue-700">
						<div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4 shadow-lg">
							<svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
							</svg>
						</div>
						<h2 className="text-2xl font-bold text-blue-800 mb-2">Finance Tracker</h2>
						<p className="text-gray-800 text-center mb-6">Verwalte deine Einnahmen und Ausgaben einfach und übersichtlich.</p>
						<Link to="/tracker" className="w-full py-3 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-900 transition">Zum Tracker</Link>
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
						<Link to="/transactions" className="w-full py-3 bg-green-700 text-white rounded-lg font-semibold shadow hover:bg-green-900 transition">Zu den Transaktionen</Link>
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
						<Link to="/investment" className="w-full py-3 bg-purple-700 text-white rounded-lg font-semibold shadow hover:bg-purple-900 transition">Zu den Investments</Link>
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
						<Link to="/crypto" className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold shadow hover:bg-yellow-600 transition">Zu Krypto</Link>
					</div>
				</div>
			) : (
				/* Original cards for non-authenticated users */
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
						<Link to="/login" className="w-full py-3 bg-purple-700 text-white rounded-lg font-semibold shadow hover:bg-purple-900 transition">Mehr erfahren</Link>
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
						<Link to="/register" className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold shadow hover:bg-yellow-600 transition">Kostenlos testen</Link>
					</div>
				</div>
			)}
						<div className="text-center text-white/90 text-base mb-4 drop-shadow-lg">
							Deine Daten bleiben sicher im Browser gespeichert.<br />Viel Erfolg beim Finanzmanagement! 🚀
						</div>
						<div className="text-center mt-2">
							<span className="inline-block bg-white/90 px-4 py-2 rounded shadow text-blue-900 text-base font-semibold">
								Noch kein Account?{' '}
								<Link to="/register" className="text-blue-800 font-bold hover:underline">Jetzt registrieren</Link>
							</span>
						</div>
					</section>
		);
}

export default Home;
