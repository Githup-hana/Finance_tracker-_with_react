import { Navigate } from "react-router-dom";

const Logout = () => {
  // Hier könnte man zusätzlich localStorage/session löschen
  // und ggf. einen Redirect machen
  // Beispiel: localStorage.clear();
  return <Navigate to="/" replace />;
};
export default Logout;