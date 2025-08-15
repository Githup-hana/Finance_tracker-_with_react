import "./App.css";


import { BrowserRouter as  BrowserRouter,  } from "react-router-dom";
import Navbar from "./components/layout/layout/Navbar";
import Footer from "./components/layout/layout/Footer";
import MyRoutes from "./router/routes";






function App() {
	return (
	<BrowserRouter>
			<Navbar />
			<MyRoutes />
			<Footer />
		</BrowserRouter>
	);
}

export default App;
