import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Tracker from "../pages/tracker";
import Transactions from "../pages/transactions";
import Investment from "../pages/investment";
import Crypto from "../pages/crypto";
import Logout from "../pages/logout";

// Dummy Contact Page
const Contact = () => (
  <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-14">
    <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Kontakt</h1>
    <p className="text-center text-gray-700">Hier könnte ein Kontaktformular stehen.</p>
  </div>
);

function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tracker" element={<Tracker />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/investment" element={<Investment />} />
      <Route path="/crypto" element={<Crypto />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<div className='text-center text-2xl mt-20'>404 Not Found</div>} />
    </Routes>
  );
}

export default AllRoutes;
