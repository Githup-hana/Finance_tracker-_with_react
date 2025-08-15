import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy-Login-Check
    if (!email || !password) {
      setError("Bitte E-Mail und Passwort eingeben.");
      return;
    }
    setError("");
    // Hier könntest du später echten Login einbauen
    alert("Login erfolgreich (Demo)");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-16">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800"
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800"
          required
        />
        {error && <div className="text-red-600 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 text-lg"
        >
          Login
        </button>
      </form>
      <div className="text-center mt-6 text-gray-600">
        Noch kein Account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">Registrieren</Link>
      </div>
    </div>
  );
}

export default Login;
