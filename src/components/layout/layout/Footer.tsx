import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white py-10 px-6 mt-10">
			<div className="max-w-7xl mx-auto">
				{/* Branding */}
				<div className="text-3xl font-bold mb-4 mt-6 flex items-center">
					<span className="text-primary">Finance</span>Tracker
				</div>

				{/* Main Content */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-12">
					{/* Links Section */}
					<div className="flex flex-col">
						<div className="flex gap-8">
							<ul className="space-y-1">
								<li>
									<Link to="/" className="hover:underline pr-5">
										Home
									</Link>
								</li>
								<li>
									<Link to="/transactions" className="hover:underline">
										Transactions
									</Link>
								</li>
								<li>
									<Link to="/investment" className="hover:underline">
										Investment
									</Link>
								</li>
								<li>
									<Link to="/crypto" className="hover:underline">
										Crypto
									</Link>
								</li>
								<li>
									<Link to="/logout" className="hover:underline">
										logout
									</Link>
								</li>
							</ul>
							<ul className="space-y-1 pl-20">
								<li>
									<a href="#" className="hover:underline">
										Blog
									</a>
								</li>
								<li>
									<a href="#" className="hover:underline">
										Support
									</a>
								</li>
								<li>
									<a href="#" className="hover:underline">
										Privacy Policy
									</a>
								</li>
								<li>
									<a href="#" className="hover:underline">
										Terms
									</a>
								</li>
							</ul>
						</div>

						{/* Legal Section */}
						<div className="text-sm text-gray-400 mt-6 pr-5">
							<p className="pr-28">© 2025 Finance Tracker. All rights reserved.</p>
							<p>Made with ❤️ for your finances.</p>
						</div>
					</div>

					{/* Social Media Icons */}
					<div className="flex gap-8 mb-20 pr-20">
						<a href="#" aria-label="Facebook">
							<FaFacebookF className="text-2xl hover:text-primary transition" />
						</a>
						<a href="#" aria-label="Twitter">
							<FaTwitter className="text-2xl hover:text-primary transition" />
						</a>
						<a href="#" aria-label="Instagram">
							<FaInstagram className="text-2xl hover:text-primary transition" />
						</a>
					</div>

					{/* App Store and Google Play Links */}
					<div className="flex gap-4 mb-12 pr-10">
						<img
							src="https://via.placeholder.com/150x50?text=App+Store"
							alt="App Store"
							className="h-10 rounded shadow"
						/>
						<img
							src="https://via.placeholder.com/150x50?text=Google+Play"
							alt="Google Play"
							className="h-10 rounded shadow"
						/>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
