import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirm) {
      setError("Bitte alle Felder ausfüllen.");
      setSuccess("");
      return;
    }
    if (password !== confirm) {
      setError("Passwörter stimmen nicht überein.");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("Registrierung erfolgreich! (Demo)");
    // Hier könntest du später echten Register-Flow einbauen
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-16">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Registrieren</h1>
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
        <input
          type="password"
          placeholder="Passwort bestätigen"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800"
          required
        />
        {error && <div className="text-red-600 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 text-lg"
        >
          Registrieren
        </button>
      </form>
      <div className="text-center mt-6 text-gray-600">
        Bereits ein Account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </div>
    </div>
  );
}

export default Register;
