import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Email-Validierung
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("E-Mail ist erforderlich");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Passwort-Validierung
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Passwort ist erforderlich");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Passwort muss mindestens 6 Zeichen lang sein");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Validierung beim Eingabe-Verlassen
  const handleEmailBlur = () => {
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    validatePassword(password);
  };

  // Fehler beim Tippen zurücksetzen
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Alle Felder validieren
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/tracker");
      } else {
        setError(result.message || "Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail und Passwort.");
      }
    } catch (error) {
      setError("Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-16">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className={`p-3 border-2 rounded-lg bg-gray-50 text-gray-800 w-full ${
              emailError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
            required
          />
          {emailError && <div className="text-red-600 text-sm mt-1">{emailError}</div>}
        </div>
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Passwort"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              className={`p-3 pr-12 border-2 rounded-lg bg-gray-50 text-gray-800 w-full ${
                passwordError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122L7.76 7.76m0 0L5.637 5.637m0 0L12 12l6.364-6.364M7.758 7.758l-2.122-2.122" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {passwordError && <div className="text-red-600 text-sm mt-1">{passwordError}</div>}
        </div>
        {error && <div className="text-red-600 text-center">{error}</div>}
                <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {loading ? "Anmeldung läuft..." : "Anmelden"}
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
