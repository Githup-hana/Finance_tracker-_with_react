import { useState, useEffect } from "react";

function Tracker() {
  const [transaction, setTransaction] = useState({
    Kategorie: "Gehalt",
    amount: "",
    Transaktionstyp: "income",
  });

  const [balance, setBalance] = useState(0);

  // Hilfsfunktion: Guthaben neu berechnen
  const calculateBalance = (transactionsArray: { Transaktionstyp: string; amount: number | string }[]) => {
    return transactionsArray.reduce(
      (sum: number, t) => {
        const amt = Number(t.amount) || 0; // sichere Umwandlung zu Zahl
        return t.Transaktionstyp === "income" ? sum + amt : sum - amt;
      },
      0
    );
  };

  useEffect(() => {
    const transactions = localStorage.getItem("transactions");
    const transactionsArray = transactions ? JSON.parse(transactions) : [];
    setBalance(calculateBalance(transactionsArray));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
const today = new Date();
const dateString = today.toLocaleDateString("de-DE"); // ergibt z.B. 15.08.2025
    const transactions = localStorage.getItem("transactions");
    const transactionsArray = transactions ? JSON.parse(transactions) : [];

    const amountNumber = parseFloat(transaction.amount || "0");

    transactionsArray.push({
      ...transaction,
      amount: amountNumber,
       date: dateString,
    });

    localStorage.setItem("transactions", JSON.stringify(transactionsArray));

    setTransaction({
      Kategorie: "Gehalt",
      amount: "",
      Transaktionstyp: "income",
    });

    setBalance(calculateBalance(transactionsArray));
  };

  return (
    <>
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-blue-200 p-4 sm:p-8 rounded-2xl shadow-xl mt-10 mb-10">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8 tracking-tight">💰 Finance Tracker</h1>
        <form
          id="transaction-form"
          className="flex flex-col gap-6 bg-white rounded-xl shadow-md p-6 sm:p-8"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
              Kategorie
            </label>
            <select
              id="description"
              name="Kategorie"
              value={transaction.Kategorie}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-400"
            >
              <option value="Gehalt">Gehalt</option>
              <option value="Miete">Miete</option>
              <option value="Investitionen">Investitionen</option>
              <option value="Lebensmittel">Lebensmittel</option>
              <option value="Shopping">Shopping</option>
              <option value="Freizeit">Freizeit</option>
              <option value="Sonstiges">Sonstiges  ausgabe</option>
              <option value="Sparen">Sparen</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700">
              Betrag (€)
            </label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={transaction.amount}
              onChange={handleChange}
              placeholder="Betrag (€)"
              required
              className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="type-of-transactions" className="block text-sm font-semibold text-gray-700">
              Transaktionstyp
            </label>
            <select
              id="type-of-transactions"
              name="Transaktionstyp"
              value={transaction.Transaktionstyp}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-400"
            >
              <option value="income">Einnahme</option>
              <option value="expense">Ausgabe</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 text-lg"
            >
              Hinzufügen
            </button>
          </div>
        </form>
        <div className="text-center mt-8">
          <p className="text-base text-gray-600 font-semibold">Aktuelles Guthaben:</p>
          <span id="balance" className="font-extrabold text-3xl text-green-600">
            {balance} €
          </span>
        </div>
      </div>
    </>
  );
}

export default Tracker;
