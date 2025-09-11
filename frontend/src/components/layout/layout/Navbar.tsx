import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
	const { isAuthenticated, user, logout } = useAuth();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const handleLogout = () => {
		logout();
		setIsMobileMenuOpen(false);
	};

	return (
		<nav className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Branding */}
					<Link 
						to={isAuthenticated ? "/dashboard" : "/"} 
						className="flex items-center space-x-2"
					>
						<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-lg">💰</span>
						</div>
						<span className="text-xl font-bold text-blue-400">
							Finance<span className="text-white">Tracker</span>
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-4">
							{/* Protected Navigation - nur für eingeloggte User */}
							{isAuthenticated ? (
								<>
									<NavLink
										to="/dashboard"
										className={({ isActive }) =>
											isActive 
												? "bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium" 
												: "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
										}
									>
										Dashboard
									</NavLink>
									<NavLink
										to="/tracker"
										className={({ isActive }) =>
											isActive 
												? "bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium" 
												: "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
										}
									>
										Tracker
									</NavLink>
									<NavLink
										to="/transactions"
										className={({ isActive }) =>
											isActive 
												? "bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium" 
												: "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
										}
									>
										Transaktionen
									</NavLink>
									<NavLink
										to="/investment"
										className={({ isActive }) =>
											isActive 
												? "bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium" 
												: "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
										}
									>
										Investments
									</NavLink>
									<NavLink
										to="/crypto"
										className={({ isActive }) =>
											isActive 
												? "bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium" 
												: "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
										}
									>
										Krypto
									</NavLink>
									<NavLink
										to="/profile"
										className={({ isActive }) =>
											isActive 
												? "bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium" 
												: "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
										}
									>
										Profil
									</NavLink>
								</>
							) : (
								<NavLink
									to="/"
									className={({ isActive }) =>
										isActive 
											? "bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium" 
											: "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
									}
									end
								>
									Home
								</NavLink>
							)}
						</div>
					</div>

					{/* User Menu */}
					<div className="hidden md:block">
						<div className="ml-4 flex items-center md:ml-6">
							{isAuthenticated ? (
								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-2">
										<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
											<span className="text-white text-sm font-medium">
												{user?.firstName?.[0]?.toUpperCase() || 'U'}
											</span>
										</div>
										<span className="text-sm text-gray-300">
											Hallo, {user?.firstName}!
										</span>
									</div>
									<button
										onClick={handleLogout}
										className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
									>
										Logout
									</button>
								</div>
							) : (
								<div className="flex items-center space-x-4">
									<NavLink
										to="/login"
										className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
									>
										Login
									</NavLink>
									<NavLink
										to="/register"
										className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
									>
										Registrieren
									</NavLink>
								</div>
							)}
						</div>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={toggleMobileMenu}
							className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						>
							<span className="sr-only">Open main menu</span>
							{!isMobileMenuOpen ? (
								<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							) : (
								<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
						{isAuthenticated ? (
							<>
								<NavLink
									to="/dashboard"
									className={({ isActive }) =>
										isActive 
											? "bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium" 
											: "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
									}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Dashboard
								</NavLink>
								<NavLink
									to="/tracker"
									className={({ isActive }) =>
										isActive 
											? "bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium" 
											: "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
									}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Tracker
								</NavLink>
								<NavLink
									to="/transactions"
									className={({ isActive }) =>
										isActive 
											? "bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium" 
											: "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
									}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Transaktionen
								</NavLink>
								<NavLink
									to="/investment"
									className={({ isActive }) =>
										isActive 
											? "bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium" 
											: "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
									}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Investments
								</NavLink>
								<NavLink
									to="/crypto"
									className={({ isActive }) =>
										isActive 
											? "bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium" 
											: "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
									}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Krypto
								</NavLink>
								<NavLink
									to="/profile"
									className={({ isActive }) =>
										isActive 
											? "bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium" 
											: "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
									}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Profil
								</NavLink>
								<div className="border-t border-gray-700 pt-4">
									<div className="flex items-center px-3">
										<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
											<span className="text-white text-sm font-medium">
												{user?.firstName?.[0]?.toUpperCase() || 'U'}
											</span>
										</div>
										<div className="ml-3">
											<div className="text-base font-medium text-white">{user?.firstName} {user?.lastName}</div>
											<div className="text-sm font-medium text-gray-400">{user?.email}</div>
										</div>
									</div>
									<div className="mt-3 px-2">
										<button
											onClick={handleLogout}
											className="w-full text-left bg-red-600 hover:bg-red-700 text-white block px-3 py-2 rounded-md text-base font-medium"
										>
											Logout
										</button>
									</div>
								</div>
							</>
						) : (
							<>
								<NavLink
									to="/"
									className={({ isActive }) =>
										isActive 
											? "bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium" 
											: "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
									}
									onClick={() => setIsMobileMenuOpen(false)}
									end
								>
									Home
								</NavLink>
								<NavLink
									to="/login"
									className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Login
								</NavLink>
								<NavLink
									to="/register"
									className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Registrieren
								</NavLink>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
