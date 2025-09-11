


import { Transaction } from "../types/transactions";


interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <div className="text-center text-gray-500">Keine Transaktionen vorhanden.</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">Transaktionen</h2>
      <ul className="divide-y divide-gray-200">
        {transactions.map((t, idx) => (
          <li key={idx} className="py-3 flex justify-between items-center">
            <div>
              <span className="font-semibold">{t.Kategorie}</span>
              {t.date && <span className="ml-2 text-xs text-gray-400">({t.date})</span>}
              <span className="ml-2 text-xs text-gray-400">[{t.Transaktionstyp === "income" ? "Einnahme" : "Ausgabe"}]</span>
            </div>
            <span className={t.Transaktionstyp === "income" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {t.Transaktionstyp === "income" ? "+" : "-"}{t.amount} €
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
