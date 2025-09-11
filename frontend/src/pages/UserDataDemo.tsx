import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function UserDataDemo() {
  const { user } = useAuth();
  const [testTransactions, setTestTransactions] = useState<any[]>([]);

  // Erstelle Test-Transaktionen für den aktuellen User
  const createTestData = () => {
    if (!user?.id) {
      alert("Benutzer nicht eingeloggt!");
      return;
    }

    const sampleTransactions = [
      {
        id: `${Date.now()}_1`,
        Kategorie: "Gehalt",
        amount: 2500,
        Transaktionstyp: "income",
        description: "Monatsgehalt",
        date: new Date().toISOString(),
        userId: user.id
      },
      {
        id: `${Date.now()}_2`,
        Kategorie: "Lebensmittel",
        amount: 150,
        Transaktionstyp: "expense",
        description: "Wocheneinkauf",
        date: new Date().toISOString(),
        userId: user.id
      },
      {
        id: `${Date.now()}_3`,
        Kategorie: "Miete",
        amount: 800,
        Transaktionstyp: "expense",
        description: "Monatsmiete",
        date: new Date().toISOString(),
        userId: user.id
      }
    ];

    // Speichere mit benutzer-spezifischem Key
    const userKey = `transactions_${user.id}`;
    localStorage.setItem(userKey, JSON.stringify(sampleTransactions));
    
    alert(`✅ Test-Transaktionen für User "${user.email}" erstellt!`);
    loadUserTransactions();
  };

  // Lade Transaktionen für den aktuellen User
  const loadUserTransactions = () => {
    if (!user?.id) return;

    const userKey = `transactions_${user.id}`;
    const stored = localStorage.getItem(userKey);
    
    if (stored) {
      setTestTransactions(JSON.parse(stored));
    } else {
      setTestTransactions([]);
    }
  };

  // Zeige alle localStorage Keys
  const showAllStorageKeys = () => {
    const allKeys = Object.keys(localStorage);
    const transactionKeys = allKeys.filter(key => key.startsWith('transactions_'));
    
    console.log("🔍 Alle Transaction-Keys im localStorage:");
    transactionKeys.forEach(key => {
      const data = localStorage.getItem(key);
      const count = data ? JSON.parse(data).length : 0;
      console.log(`📝 ${key}: ${count} Transaktionen`);
    });

    alert(`Gefunden: ${transactionKeys.length} verschiedene User-Daten. Schau in die Browser-Console (F12) für Details.`);
  };

  // Lösche Daten für aktuellen User
  const clearUserData = () => {
    if (!user?.id) return;
    
    const userKey = `transactions_${user.id}`;
    localStorage.removeItem(userKey);
    setTestTransactions([]);
    alert(`🗑️ Daten für User "${user.email}" gelöscht.`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          👥 Benutzer-spezifische Datenspeicherung
        </h1>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Aktueller Benutzer:
          </h2>
          <p className="text-blue-700">
            <strong>Email:</strong> {user?.email || "Nicht eingeloggt"}<br/>
            <strong>User ID:</strong> {user?.id || "Keine ID"}<br/>
            <strong>Storage Key:</strong> <code>transactions_{user?.id || "KEINE_ID"}</code>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={createTestData}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            📝 Test-Daten erstellen
          </button>
          
          <button
            onClick={loadUserTransactions}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Daten laden
          </button>
          
          <button
            onClick={showAllStorageKeys}
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            🔍 Alle User anzeigen
          </button>
          
          <button
            onClick={clearUserData}
            className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            🗑️ Meine Daten löschen
          </button>
        </div>

        {/* Aktuelle Transaktionen anzeigen */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Meine Transaktionen ({testTransactions.length})
          </h3>
          
          {testTransactions.length === 0 ? (
            <p className="text-gray-500 italic">Keine Transaktionen für diesen User gefunden.</p>
          ) : (
            <div className="space-y-2">
              {testTransactions.map((transaction, index) => (
                <div key={index} className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{transaction.description}</span>
                      <span className="text-sm text-gray-500 ml-2">({transaction.Kategorie})</span>
                    </div>
                    <div className={`font-bold ${
                      transaction.Transaktionstyp === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.Transaktionstyp === 'income' ? '+' : '-'}€{transaction.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            ℹ️ So funktioniert die Trennung:
          </h3>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>• Jeder User hat seinen eigenen localStorage-Key: <code>transactions_USER_ID</code></li>
            <li>• User A sieht nur seine Transaktionen</li>
            <li>• User B sieht nur seine Transaktionen</li>
            <li>• Die Daten werden niemals vermischt</li>
            <li>• Beim Logout werden keine Daten gelöscht (bleiben im Browser)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserDataDemo;
