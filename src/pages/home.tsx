
import { Link } from "react-router-dom";

function Home() {
	return (
		<div className="min-h-[70vh] flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 p-4 sm:p-8 rounded-2xl shadow-xl mt-10 mb-10">
			<h1 className="text-5xl font-extrabold text-blue-700 mb-6 tracking-tight text-center drop-shadow-lg">Willkommen beim Finance Tracker!</h1>
			<p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
				Behalte deine Finanzen, Investitionen und Krypto-Assets im Blick. Nutze den Tracker, um Einnahmen und Ausgaben zu verwalten, deine Investments zu analysieren und aktuelle Krypto-Preise zu checken.
			</p>
			<div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl justify-center">
				<Link to="/tracker" className="flex-1 py-4 px-6 bg-blue-600 text-white text-xl font-bold rounded-lg shadow-md hover:bg-blue-700 text-center transition">Finance Tracker</Link>
				<Link to="/transactions" className="flex-1 py-4 px-6 bg-green-600 text-white text-xl font-bold rounded-lg shadow-md hover:bg-green-700 text-center transition">Transaktionen</Link>
			</div>
			<div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl justify-center mt-6">
				<Link to="/investment" className="flex-1 py-4 px-6 bg-purple-600 text-white text-xl font-bold rounded-lg shadow-md hover:bg-purple-700 text-center transition">Investments</Link>
				<Link to="/crypto" className="flex-1 py-4 px-6 bg-yellow-500 text-white text-xl font-bold rounded-lg shadow-md hover:bg-yellow-600 text-center transition">Krypto-Preise</Link>
			</div>
			<div className="mt-10 text-center text-gray-500 text-sm">
				<span>Deine Daten bleiben sicher im Browser gespeichert. Viel Erfolg beim Finanzmanagement! 🚀</span>
			</div>
		</div>
	);
}

export default Home;
