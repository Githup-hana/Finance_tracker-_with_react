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
    <section className="w-full flex flex-col items-center justify-center px-4 pt-12 pb-16">
      <h1 className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-2xl mb-10 text-center flex items-center gap-3">
        <span className="inline-block bg-blue-700/80 rounded-full p-3 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </span>
        Finance Tracker
      </h1>
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-4xl items-start justify-center">
        <form
          id="transaction-form"
          className="flex-1 flex flex-col gap-6 bg-black/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10 min-w-[320px]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="block text-sm font-semibold text-white/90">
              Kategorie
            </label>
            <select
              id="description"
              name="Kategorie"
              value={transaction.Kategorie}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-white/10 rounded-lg bg-white/10 text-white focus:ring-2 focus:ring-blue-400"
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
            <label htmlFor="amount" className="block text-sm font-semibold text-white/90">
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
              className="w-full p-3 border-2 border-white/10 rounded-lg bg-white/10 text-white focus:ring-2 focus:ring-blue-400 placeholder:text-white/60"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="type-of-transactions" className="block text-sm font-semibold text-white/90">
              Transaktionstyp
            </label>
            <select
              id="type-of-transactions"
              name="Transaktionstyp"
              value={transaction.Transaktionstyp}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-white/10 rounded-lg bg-white/10 text-white focus:ring-2 focus:ring-blue-400"
            >
              <option value="income">Einnahme</option>
              <option value="expense">Ausgabe</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-900 transition-colors duration-300 text-lg"
            >
              Hinzufügen
            </button>
          </div>
        </form>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 min-w-[260px]">
          <div className="bg-black/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 px-8 py-10 flex flex-col items-center">
            <span className="text-base text-white/80 font-semibold mb-2">Aktuelles Guthaben</span>
            <span id="balance" className="font-extrabold text-4xl sm:text-5xl text-green-300 drop-shadow-lg">
              {balance} €
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Tracker;
