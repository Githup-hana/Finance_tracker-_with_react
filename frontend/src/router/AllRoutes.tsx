import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import Dashboard from "../pages/Dashboard";
import Tracker from "../pages/tracker";
import Transactions from "../pages/TransactionsPage";
import Investment from "../pages/investment";
import Crypto from "../pages/crypto";
import Profile from "../pages/Profile";
import Logout from "../pages/logout";
import DataRecovery from "../pages/DataRecovery";
import UserDataDemo from "../pages/UserDataDemo";
import { ProtectedRoute, PublicRoute } from "../components/ProtectedRoute";



function AllRoutes() {
  return (
    <Routes>
      {/* Temporäre öffentliche Routen für Demo/Fehlerfall (kein Login benötigt) */}
      <Route path="/tracker-public" element={<Tracker />} />

      {/* Öffentliche Routes - nur für nicht-eingeloggte User */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* Geschützte Routes - nur für eingeloggte User */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/tracker" element={
        <ProtectedRoute>
          <Tracker />
        </ProtectedRoute>
      } />
      <Route path="/transactions" element={
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      } />
      <Route path="/investment" element={
        <ProtectedRoute>
          <Investment />
        </ProtectedRoute>
      } />
      <Route path="/crypto" element={
        <ProtectedRoute>
          <Crypto />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/data-recovery" element={
        <ProtectedRoute>
          <DataRecovery />
        </ProtectedRoute>
      } />
      <Route path="/user-demo" element={
        <ProtectedRoute>
          <UserDataDemo />
        </ProtectedRoute>
      } />
      <Route path="/logout" element={
        <ProtectedRoute>
          <Logout />
        </ProtectedRoute>
      } />

      <Route path="*" element={<div className='text-center text-2xl mt-20'>404 Not Found</div>} />
    </Routes>
  );
}

export default AllRoutes;
