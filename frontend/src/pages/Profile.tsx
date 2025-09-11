import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface UserStats {
  totalTransactions: number;
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  memberSince: string;
}

const Profile: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalInvestments: 0,
    memberSince: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Show loading while checking auth
  if (loading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (user) {
      // Initialize edit form with user data
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });

      // Calculate user statistics
      calculateUserStats();
    }
  }, [user]);

  const calculateUserStats = () => {
    const transactions = localStorage.getItem(`transactions_${user?.id || 'default'}`);
    const investments = localStorage.getItem(`investments_${user?.id || 'default'}`);
    
    const transactionArray = transactions ? JSON.parse(transactions) : [];
    const investmentArray = investments ? JSON.parse(investments) : [];

    const totalIncome = transactionArray
      .filter((t: any) => t.Transaktionstyp === 'income')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const totalExpenses = transactionArray
      .filter((t: any) => t.Transaktionstyp === 'expense')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const totalInvestments = investmentArray
      .reduce((sum: number, inv: any) => sum + (Number(inv.amount) * Number(inv.priceAtInvestment)), 0);

    setUserStats({
      totalTransactions: transactionArray.length,
      totalIncome,
      totalExpenses,
      totalInvestments,
      memberSince: 'September 2025' // This could be dynamic based on user registration date
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the update to your backend
    // For now, we'll just show a success message
    alert('Profil erfolgreich aktualisiert!');
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            👤 Mein Profil
          </h1>
          <p className="text-lg text-gray-600">
            Verwalte deine persönlichen Daten und sieh deine Statistiken
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Persönliche Daten</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isEditing ? 'Abbrechen' : 'Bearbeiten'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vorname
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nachname
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-Mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Speichern
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">Mitglied seit {userStats.memberSince}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Konto-Aktionen</h2>
              <div className="space-y-4">
                <button className="w-full p-4 bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 rounded-lg text-yellow-800 font-medium transition-colors text-left">
                  🔒 Passwort ändern
                </button>
                <button className="w-full p-4 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg text-blue-800 font-medium transition-colors text-left">
                  📧 E-Mail-Benachrichtigungen verwalten
                </button>
                <button className="w-full p-4 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-800 font-medium transition-colors text-left">
                  📁 Daten exportieren
                </button>
                <button 
                  onClick={logout}
                  className="w-full p-4 bg-red-100 hover:bg-red-200 border border-red-300 rounded-lg text-red-800 font-medium transition-colors text-left"
                >
                  🚪 Abmelden
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Deine Statistiken</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-800 font-medium">Transaktionen</span>
                  <span className="text-blue-600 font-bold">{userStats.totalTransactions}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-800 font-medium">Einnahmen</span>
                  <span className="text-green-600 font-bold">€{userStats.totalIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-800 font-medium">Ausgaben</span>
                  <span className="text-red-600 font-bold">€{userStats.totalExpenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-800 font-medium">Investments</span>
                  <span className="text-purple-600 font-bold">€{userStats.totalInvestments.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Ziele</h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Sparziel</span>
                    <span className="text-gray-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Investment-Ziel</span>
                    <span className="text-gray-600">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Erfolge</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2">
                  <span className="text-2xl">🥇</span>
                  <span className="text-sm text-gray-700">Erste Transaktion</span>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-sm text-gray-700">Erstes Investment</span>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <span className="text-2xl">📊</span>
                  <span className="text-sm text-gray-700">10 Transaktionen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
