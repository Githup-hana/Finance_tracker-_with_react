
import { Link } from "react-router-dom";

function Home() {
			return (
					<section className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 pt-16 pb-10 relative">
						<div className="relative z-10 w-full flex flex-col items-center mb-12">
							<h1 className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-2xl mb-4 text-center">Willkommen beim Finance Tracker</h1>
							<p className="text-lg sm:text-2xl text-white/90 mb-10 text-center max-w-2xl drop-shadow-lg">
								Deine zentrale Plattform für smarte Finanzen, Investments und Krypto – alles auf einen Blick, modern, sicher und einfach.
							</p>
						</div>
								{/* Cards im 2x2-Grid wie im Frame 3 Bild */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
								{/* Tracker Card */}
								<div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 hover:scale-[1.04] transition-transform duration-200 border-t-8 border-blue-700">
										<div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4 shadow-lg">
											<svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 12v4m8-8h-4m-8 0H4" /></svg>
										</div>
										<h2 className="text-2xl font-bold text-blue-800 mb-2">Finance Tracker</h2>
										<p className="text-gray-800 text-center mb-6">Verwalte deine Einnahmen und Ausgaben einfach und übersichtlich.</p>
										<Link to="/tracker" className="w-full py-3 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-900 transition">Zum Tracker</Link>
									</div>
								{/* Transactions Card */}
								<div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 hover:scale-[1.04] transition-transform duration-200 border-t-8 border-green-700">
										<img src="/assets/0_aHoCi6mHTrJ8fhN6.jpg" alt="Transaktionen" className="w-20 h-20 object-cover rounded-xl mb-4 shadow bg-green-100" />
										<h2 className="text-2xl font-bold text-green-800 mb-2">Transaktionen</h2>
										<p className="text-gray-800 text-center mb-6">Behalte alle deine Transaktionen im Blick und filtere nach Kategorie.</p>
										<Link to="/transactions" className="w-full py-3 bg-green-700 text-white rounded-lg font-semibold shadow hover:bg-green-900 transition">Zu den Transaktionen</Link>
									</div>
								{/* Investments Card */}
								<div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 hover:scale-[1.04] transition-transform duration-200 border-t-8 border-purple-700">
										<div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 mb-4 shadow-lg">
											<svg className="w-10 h-10 text-purple-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
										</div>
										<h2 className="text-2xl font-bold text-purple-800 mb-2">Investments</h2>
										<p className="text-gray-800 text-center mb-6">Analysiere deine Investments, Gewinne und Verluste übersichtlich.</p>
										<Link to="/investment" className="w-full py-3 bg-purple-700 text-white rounded-lg font-semibold shadow hover:bg-purple-900 transition">Zu den Investments</Link>
									</div>
								{/* Crypto Card */}
								<div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 hover:scale-[1.04] transition-transform duration-200 border-t-8 border-yellow-500">
										<div className="w-16 h-16 flex items-center justify-center rounded-full bg-yellow-100 mb-4 shadow-lg">
											<svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 12v4m8-8h-4m-8 0H4" /></svg>
										</div>
										<h2 className="text-2xl font-bold text-yellow-700 mb-2">Krypto-Preise</h2>
										<p className="text-gray-800 text-center mb-6">Checke aktuelle Krypto-Preise und verfolge deine Coins.</p>
										<Link to="/crypto" className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold shadow hover:bg-yellow-600 transition">Zu Krypto</Link>
									</div>
								</div>
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
