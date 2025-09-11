import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Feldspezifische Fehlermeldungen
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  // Validierungsfunktionen
  const validateFirstName = (firstName: string) => {
    if (!firstName.trim()) {
      setFirstNameError("Vorname ist erforderlich");
      return false;
    }
    if (firstName.trim().length < 2) {
      setFirstNameError("Vorname muss mindestens 2 Zeichen lang sein");
      return false;
    }
    setFirstNameError("");
    return true;
  };

  const validateLastName = (lastName: string) => {
    if (!lastName.trim()) {
      setLastNameError("Nachname ist erforderlich");
      return false;
    }
    if (lastName.trim().length < 2) {
      setLastNameError("Nachname muss mindestens 2 Zeichen lang sein");
      return false;
    }
    setLastNameError("");
    return true;
  };

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

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Passwort ist erforderlich");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Passwort muss mindestens 6 Zeichen lang sein");
      return false;
    }
    if (!/(?=.*[a-z])/.test(password)) {
      setPasswordError("Passwort muss mindestens einen Kleinbuchstaben enthalten");
      return false;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      setPasswordError("Passwort muss mindestens einen Großbuchstaben enthalten");
      return false;
    }
    if (!/(?=.*\d)/.test(password)) {
      setPasswordError("Passwort muss mindestens eine Zahl enthalten");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (password: string, confirm: string) => {
    if (!confirm) {
      setConfirmError("Passwort-Bestätigung ist erforderlich");
      return false;
    }
    if (password !== confirm) {
      setConfirmError("Passwörter stimmen nicht überein");
      return false;
    }
    setConfirmError("");
    return true;
  };

  // Handler-Funktionen für Eingaben
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    if (firstNameError) setFirstNameError("");
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    if (lastNameError) setLastNameError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
    // Bestätigungs-Passwort auch neu validieren falls es bereits eingegeben wurde
    if (confirm) {
      validateConfirmPassword(e.target.value, confirm);
    }
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
    if (confirmError) setConfirmError("");
  };

  // Blur-Handler für Validierung beim Verlassen der Felder
  const handleFirstNameBlur = () => validateFirstName(firstName);
  const handleLastNameBlur = () => validateLastName(lastName);
  const handleEmailBlur = () => validateEmail(email);
  const handlePasswordBlur = () => validatePassword(password);
  const handleConfirmBlur = () => validateConfirmPassword(password, confirm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Alle Felder validieren
    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(password, confirm);
    
    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
      return;
    }
    
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      const result = await register(email, password, firstName, lastName);
      if (result.success) {
        setSuccess("Registrierung erfolgreich! Sie werden in 2 Sekunden weitergeleitet...");
        setTimeout(() => {
          navigate("/tracker");
        }, 2000);
      } else {
        setError(result.message || "Registrierung fehlgeschlagen. Versuchen Sie es erneut.");
      }
    } catch (error) {
      setError("Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-16">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Registrieren</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <input
            type="text"
            placeholder="Vorname"
            value={firstName}
            onChange={handleFirstNameChange}
            onBlur={handleFirstNameBlur}
            className={`p-3 border-2 rounded-lg bg-gray-50 text-gray-800 w-full ${
              firstNameError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
            required
          />
          {firstNameError && <div className="text-red-600 text-sm mt-1">{firstNameError}</div>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Nachname"
            value={lastName}
            onChange={handleLastNameChange}
            onBlur={handleLastNameBlur}
            className={`p-3 border-2 rounded-lg bg-gray-50 text-gray-800 w-full ${
              lastNameError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
            required
          />
          {lastNameError && <div className="text-red-600 text-sm mt-1">{lastNameError}</div>}
        </div>
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
        <div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Passwort bestätigen"
              value={confirm}
              onChange={handleConfirmChange}
              onBlur={handleConfirmBlur}
              className={`p-3 pr-12 border-2 rounded-lg bg-gray-50 text-gray-800 w-full ${
                confirmError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
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
          {confirmError && <div className="text-red-600 text-sm mt-1">{confirmError}</div>}
        </div>
        {error && <div className="text-red-600 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 text-lg ${
            loading 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? "Registrierung läuft..." : "Registrieren"}
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
