



import { useState } from "react";
import { getTransactions } from "../features/getTransactions";
import { Transaction } from "../types/transactions";
import TransactionList from "../components/TransactionList";

function Transactions() {
  const [filterKategorie, setFilterKategorie] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filtered, setFiltered] = useState<Transaction[] | null>(null);

  const allTransactions: Transaction[] = getTransactions();

  // Hilfsfunktion: dd.mm.yyyy zu yyyy-mm-dd
  function toInputDateFormat(dateStr?: string) {
    if (!dateStr) return "";
    const [dd, mm, yyyy] = dateStr.split(".");
    if (!dd || !mm || !yyyy) return dateStr;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }



  const handleFilter = () => {
    const filteredList = allTransactions.filter((t) => {
      const matchKategorie = filterKategorie === "" || t.Kategorie === filterKategorie;
      const matchDate = filterDate === "" || (t.date && toInputDateFormat(t.date) === filterDate);
      return matchKategorie && matchDate;
    });
    setFiltered(filteredList);
  };

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-blue-200 p-4 sm:p-8 rounded-2xl shadow-xl mt-10 mb-10">
      <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-8 tracking-tight">
        📊 Transaktionen & Insights
      </h2>

      <div className="flex flex-col gap-6 bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <select
            id="filter-description"
            className="flex-1 p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-400"
            value={filterKategorie}
            onChange={e => setFilterKategorie(e.target.value)}
          >
            <option value="">Alle Kategorien</option>
            <option value="Miete">🏠 Miete</option>
            <option value="Gehalt">💰 Gehalt</option>
            <option value="Investitionen">📈 Investitionen</option>
            <option value="Lebensmittel">🛒 Lebensmittel</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Freizeit">🎉 Freizeit</option>
            <option value="Sonstiges">🔹 Sonstiges</option>
          </select>
          <input
            type="date"
            id="filter-date"
            className="flex-1 p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-400"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </div>
        <button
          id="filter-button"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 text-lg"
          onClick={handleFilter}
        >
          Filtern
        </button>
      </div>

      {/* Transaktionsliste anzeigen */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <TransactionList transactions={filtered === null ? allTransactions : filtered} />
      </div>
    </div>
  );
}

export default Transactions;