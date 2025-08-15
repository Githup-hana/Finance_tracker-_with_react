import "./App.css";

import { BrowserRouter as BrowserRouter } from "react-router-dom";
import Navbar from "./components/layout/layout/Navbar";
import Footer from "./components/layout/layout/Footer";

import AllRoutes from "./router/AllRoutes";

function App() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/assets/iStock-1025744818.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay für bessere Lesbarkeit */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 min-h-screen flex flex-col">
        <BrowserRouter>
          <Navbar />
          <div className="flex-1 flex flex-col">
            <AllRoutes />
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
