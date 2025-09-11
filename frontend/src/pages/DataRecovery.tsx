import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { TransactionService } from "../services/transactionService";

function DataRecovery() {
  const { user } = useAuth();
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<{
    success: boolean;
    migrated: number;
    errors: string[];
  } | null>(null);

  const [showLocalStorageData, setShowLocalStorageData] = useState(false);
  const [localStorageContent, setLocalStorageContent] = useState<string>("");

  const checkLocalStorage = () => {
    if (!user?.email) return;
    
    const localStorageKey = `transactions_${user.email}`;
    const data = localStorage.getItem(localStorageKey);
    
    if (data) {
      setLocalStorageContent(data);
      setShowLocalStorageData(true);
    } else {
      alert("Keine localStorage-Daten für diesen Benutzer gefunden.");
    }
  };

  const migrateData = async () => {
    if (!user?.email) {
      alert("Benutzer nicht eingeloggt!");
      return;
    }

    setIsRecovering(true);
    setRecoveryResult(null);

    try {
      const result = await TransactionService.migrateLocalStorageToDatabase(user.email);
      setRecoveryResult(result);
    } catch (error) {
      setRecoveryResult({
        success: false,
        migrated: 0,
        errors: [`Migrationsfehler: ${error}`]
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const exportData = async () => {
    try {
      const data = await TransactionService.exportTransactions();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Export-Fehler: ${error}`);
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = await TransactionService.importTransactions(text);
      
      if (result.success) {
        alert(`✅ ${result.imported} Transaktionen erfolgreich importiert!`);
      } else {
        alert(`❌ Import-Fehler: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      alert(`Import-Fehler: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          💾 Daten-Wiederherstellung
        </h1>

        <div className="space-y-6">
          {/* LocalStorage Check */}
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              1. LocalStorage Daten prüfen
            </h2>
            <p className="text-blue-700 mb-4">
              Überprüfe, ob noch Transaktionen im Browser-Speicher vorhanden sind.
            </p>
            <button
              onClick={checkLocalStorage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              LocalStorage prüfen
            </button>
          </div>

          {/* LocalStorage Inhalt anzeigen */}
          {showLocalStorageData && (
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                ✅ LocalStorage Daten gefunden!
              </h3>
              <details className="mb-4">
                <summary className="cursor-pointer text-green-700 font-medium">
                  Daten anzeigen (klicken zum aufklappen)
                </summary>
                <pre className="mt-2 bg-white p-4 rounded border text-sm overflow-auto max-h-40">
                  {JSON.stringify(JSON.parse(localStorageContent), null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Migration */}
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <h2 className="text-xl font-semibold text-orange-800 mb-3">
              2. Daten zur Datenbank migrieren
            </h2>
            <p className="text-orange-700 mb-4">
              Übertrage deine localStorage-Transaktionen sicher in die Datenbank.
            </p>
            <button
              onClick={migrateData}
              disabled={isRecovering}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {isRecovering ? "Migriere..." : "Daten migrieren"}
            </button>
          </div>

          {/* Migration Ergebnis */}
          {recoveryResult && (
            <div className={`border rounded-lg p-4 ${
              recoveryResult.success 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                recoveryResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {recoveryResult.success ? '✅ Migration erfolgreich!' : '❌ Migration fehlgeschlagen'}
              </h3>
              
              {recoveryResult.success && (
                <p className="text-green-700 mb-2">
                  🎉 {recoveryResult.migrated} Transaktionen erfolgreich wiederhergestellt!
                </p>
              )}
              
              {recoveryResult.errors.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-red-800 mb-2">Fehler:</h4>
                  <ul className="list-disc list-inside text-red-700 text-sm">
                    {recoveryResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Backup & Import */}
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <h2 className="text-xl font-semibold text-purple-800 mb-3">
              3. Backup & Import
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-purple-700 mb-2">Backup erstellen:</h3>
                <button
                  onClick={exportData}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  📤 Transaktionen exportieren
                </button>
              </div>
              
              <div>
                <h3 className="font-medium text-purple-700 mb-2">Backup importieren:</h3>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="block w-full text-sm text-purple-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                />
              </div>
            </div>
          </div>

          {/* Hinweis */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              ℹ️ Wichtige Hinweise
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              <li>Nach der Migration werden deine Transaktionen sicher in der Datenbank gespeichert</li>
              <li>LocalStorage-Daten werden nach erfolgreicher Migration automatisch gelöscht</li>
              <li>Erstelle regelmäßig Backups deiner Transaktionen</li>
              <li>Die Migration kann nur einmal pro Benutzer durchgeführt werden</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataRecovery;
