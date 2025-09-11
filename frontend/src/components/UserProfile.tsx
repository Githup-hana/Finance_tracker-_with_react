import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  isVisible?: boolean;
  onClose?: () => void;
  compact?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  isVisible = true, 
  onClose, 
  compact = false 
}) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Benutzer nicht gefunden</div>
      </div>
    );
  }

  if (!isVisible) return null;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Mein Profil</h2>
        <div className="flex items-center space-x-2">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
        </div>
      </div>

      {/* Willkommensnachricht */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Willkommen zurück, {user.firstName}! 👋
        </h3>
        <p className="text-gray-600">
          Verwalten Sie Ihre Finanzen intelligent und erreichen Sie Ihre Ziele.
        </p>
      </div>

      {/* Profil-Informationen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vorname
          </label>
          <div className="text-lg font-semibold text-gray-900">
            {user.firstName}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nachname
          </label>
          <div className="text-lg font-semibold text-gray-900">
            {user.lastName}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-Mail-Adresse
          </label>
          <div className="text-lg font-semibold text-gray-900">
            {user.email}
          </div>
        </div>
      </div>

      {/* Schnellzugriff */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Schnellzugriff</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleNavigation('/transactions')}
            className="bg-green-100 hover:bg-green-200 text-green-800 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="text-sm font-medium">Transaktionen</div>
          </button>
          
          <button 
            onClick={() => handleNavigation('/investment')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium">Investitionen</div>
          </button>
          
          <button 
            onClick={() => handleNavigation('/crypto')}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">₿</div>
            <div className="text-sm font-medium">Crypto</div>
          </button>
          
          <button 
            onClick={logout}
            className="bg-red-100 hover:bg-red-200 text-red-800 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">🚪</div>
            <div className="text-sm font-medium">Abmelden</div>
          </button>
        </div>
      </div>

      {/* Kontostatistiken */}
      <div className="mt-6 border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Kontoübersicht</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 text-white">
            <div className="text-sm opacity-80">Gesamtsaldo</div>
            <div className="text-2xl font-bold">€ 2,450.00</div>
            <div className="text-xs opacity-70 mt-1">+5.2% diesen Monat</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-4 text-white">
            <div className="text-sm opacity-80">Einnahmen</div>
            <div className="text-2xl font-bold">€ +3,240.00</div>
            <div className="text-xs opacity-70 mt-1">Diesen Monat</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-4 text-white">
            <div className="text-sm opacity-80">Ausgaben</div>
            <div className="text-2xl font-bold">€ -1,790.00</div>
            <div className="text-xs opacity-70 mt-1">Diesen Monat</div>
          </div>
        </div>
      </div>

      {/* Ziele & Tipps */}
      <div className="mt-6 border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Finanz-Tipps für Sie</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">💡</span>
              <span className="font-semibold text-yellow-800">Spartipp</span>
            </div>
            <p className="text-sm text-yellow-700">
              Setzen Sie 20% Ihres Einkommens für Ersparnisse beiseite.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">📈</span>
              <span className="font-semibold text-blue-800">Investitions-Tipp</span>
            </div>
            <p className="text-sm text-blue-700">
              Diversifizieren Sie Ihr Portfolio für bessere Risikominimierung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
