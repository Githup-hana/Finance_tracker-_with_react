import "./App.css";


import { BrowserRouter as  BrowserRouter,  } from "react-router-dom";
import Navbar from "./components/layout/layout/Navbar";
import Footer from "./components/layout/layout/Footer";

import AllRoutes from "./router/AllRoutes";






function App() {
	return (
	<BrowserRouter>
			<Navbar />
			<AllRoutes />
			<Footer />
		</BrowserRouter>
	);
}

export default App;
