import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function Tracker() {
  const { user, loading } = useAuth();
  const [transaction, setTransaction] = useState({
    Kategorie: "Gehalt",
    amount: "",
    Transaktionstyp: "income",
    description: "",
  });

  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Show loading while checking auth
  if (loading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Hilfsfunktion: Guthaben neu berechnen
  const calculateBalance = (transactionsArray: { Transaktionstyp: string; amount: number | string }[]) => {
    return transactionsArray.reduce(
      (sum: number, t) => {
        const amt = Number(t.amount) || 0;
        return t.Transaktionstyp === "income" ? sum + amt : sum - amt;
      },
      0
    );
  };

  const loadTransactions = () => {
    const transactions = localStorage.getItem(`transactions_${user?.id || 'default'}`);
    const transactionsArray = transactions ? JSON.parse(transactions) : [];
    setBalance(calculateBalance(transactionsArray));
    setRecentTransactions(transactionsArray.slice(-5).reverse()); // Letzte 5 Transaktionen
  };

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const today = new Date();
    const dateString = today.toLocaleDateString("de-DE");
    
    const transactions = localStorage.getItem(`transactions_${user?.id || 'default'}`);
    const transactionsArray = transactions ? JSON.parse(transactions) : [];

    const amountNumber = parseFloat(transaction.amount || "0");

    const newTransaction = {
      Kategorie: transaction.Kategorie,
      amount: amountNumber,
      Transaktionstyp: transaction.Transaktionstyp,
      description: transaction.description || `${transaction.Kategorie} - ${transaction.Transaktionstyp}`,
      date: dateString,
      id: Date.now().toString(),
    };

    transactionsArray.push(newTransaction);
    localStorage.setItem(`transactions_${user?.id || 'default'}`, JSON.stringify(transactionsArray));

    // UI aktualisieren
    loadTransactions();
    setSuccessMessage("Transaktion erfolgreich hinzugefügt!");
    setTimeout(() => setSuccessMessage(""), 3000);

    // Formular zurücksetzen
    setTransaction({
      Kategorie: "Gehalt",
      amount: "",
      Transaktionstyp: "income",
      description: "",
    });
  };

  const getCategoryIcon = (kategorie: string) => {
    const icons: { [key: string]: string } = {
      "Gehalt": "💰",
      "Miete": "🏠",
      "Investitionen": "📈",
      "Lebensmittel": "🛒",
      "Transport": "🚗",
      "Entertainment": "🎬",
      "Gesundheit": "🏥",
      "Bildung": "📚",
      "Sparen": "🏦",
      "Sonstiges": "📝"
    };
    return icons[kategorie] || "📝";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          💰 Transaktions-Tracker
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Transaktions-Formular */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              ➕ Neue Transaktion
            </h2>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                ✅ {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Kategorie
                </label>
                <select
                  name="Kategorie"
                  value={transaction.Kategorie}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="Gehalt">💰 Gehalt</option>
                  <option value="Miete">🏠 Miete</option>
                  <option value="Investitionen">📈 Investitionen</option>
                  <option value="Lebensmittel">🛒 Lebensmittel</option>
                  <option value="Transport">🚗 Transport</option>
                  <option value="Entertainment">🎬 Entertainment</option>
                  <option value="Gesundheit">🏥 Gesundheit</option>
                  <option value="Bildung">📚 Bildung</option>
                  <option value="Sparen">🏦 Sparen</option>
                  <option value="Sonstiges">📝 Sonstiges</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Betrag (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={transaction.amount}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Typ
                </label>
                <select
                  name="Transaktionstyp"
                  value={transaction.Transaktionstyp}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="income">💰 Einnahme</option>
                  <option value="expense">💸 Ausgabe</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Beschreibung (optional)
                </label>
                <textarea
                  name="description"
                  value={transaction.description}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Zusätzliche Details..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              >
                💾 Transaktion hinzufügen
              </button>
            </form>
          </div>

          {/* Dashboard */}
          <div className="space-y-6">
            {/* Guthaben-Anzeige */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                💳 Aktuelles Guthaben
              </h3>
              <div className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {balance >= 0 ? '+' : ''}{balance.toFixed(2)} €
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Stand: {new Date().toLocaleDateString("de-DE")}
              </div>
            </div>

            {/* Letzte Transaktionen */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                📋 Letzte Transaktionen
              </h3>
              {recentTransactions.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <div>Noch keine Transaktionen vorhanden</div>
                  <div className="text-sm">Füge deine erste Transaktion hinzu!</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((trans, index) => (
                    <div
                      key={trans.id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getCategoryIcon(trans.Kategorie)}</span>
                        <div>
                          <div className="font-medium text-gray-800">{trans.Kategorie}</div>
                          <div className="text-sm text-gray-600">{trans.date}</div>
                        </div>
                      </div>
                      <div className={`font-semibold ${trans.Transaktionstyp === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {trans.Transaktionstyp === 'income' ? '+' : '-'}{Number(trans.amount).toFixed(2)} €
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schnell-Statistiken */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-lg font-semibold text-gray-800">Einnahmen</div>
            <div className="text-2xl font-bold text-green-600">
              +{recentTransactions
                .filter(t => t.Transaktionstyp === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0)
                .toFixed(2)} €
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📉</div>
            <div className="text-lg font-semibold text-gray-800">Ausgaben</div>
            <div className="text-2xl font-bold text-red-600">
              -{recentTransactions
                .filter(t => t.Transaktionstyp === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0)
                .toFixed(2)} €
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-lg font-semibold text-gray-800">Transaktionen</div>
            <div className="text-2xl font-bold text-blue-600">
              {recentTransactions.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
