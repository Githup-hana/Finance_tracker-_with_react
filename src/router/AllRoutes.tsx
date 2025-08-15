import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import Tracker from "../pages/tracker";
import Transactions from "../pages/transactions";
import Investment from "../pages/investment";
import Crypto from "../pages/crypto";
import Logout from "../pages/logout";



function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tracker" element={<Tracker />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/investment" element={<Investment />} />
      <Route path="/crypto" element={<Crypto />} />
      <Route path="/logout" element={<Logout />} />
    
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
      <Route path="*" element={<div className='text-center text-2xl mt-20'>404 Not Found</div>} />
    </Routes>
  );
}

export default AllRoutes;
