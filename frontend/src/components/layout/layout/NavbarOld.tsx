import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
	const { isAuthenticated, user, logout } = useAuth();

	return (
		<nav className="bg-gray-900 text-white shadow-md py-4 px-6">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Branding */}
				<Link to="/" className="text-2xl font-bold text-blue-400">
					Finance<span className="text-white">Tracker</span>
				</Link>

				{/* Navigation Links */}
				<ul className="flex gap-8 text-lg font-medium">
					<li>
						<NavLink
							to="/"
							className={({ isActive }) =>
								isActive ? "text-blue-400 underline" : "hover:text-blue-300 transition"
							}
							end
						>
							Home
						</NavLink>
					</li>

					{/* Protected Navigation - nur für eingeloggte User */}
					{isAuthenticated && (
						<>
							<li>
								<NavLink
									to="/tracker"
									className={({ isActive }) =>
										isActive ? "text-blue-400 underline" : "hover:text-blue-300 transition"
									}
								>
									Tracker
								</NavLink>
							</li>
							end
						>
							MyTracker
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/transactions"
							className={({ isActive }) =>
								isActive ? "text-blue-400 underline" : "hover:text-blue-300 transition"
							}
						>
							Transactions
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/investment"
							className={({ isActive }) =>
								isActive ? "text-blue-400 underline" : "hover:text-blue-300 transition"
							}
						>
							Investment
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/crypto"
							className={({ isActive }) =>
								isActive ? "text-blue-400 underline" : "hover:text-blue-300 transition"
							}
						>
							Crypto
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/logout"
							className={({ isActive }) =>
								isActive ? "text-blue-400 underline" : "hover:text-blue-300 transition"
							}
						>
							logout
						</NavLink>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
