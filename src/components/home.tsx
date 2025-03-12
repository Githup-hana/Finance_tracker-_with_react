function Home() {
  return (
    <>
     
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-14">
          <h1 className="text-3xl font-bold text-center text-blue-600">
            💰 Finance Tracker
          </h1>

          <form
            id="transaction-form"
            className="mt-6 flex flex-col w-full space-y-4"
          >
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Kategorie
              </label>
              <select
                id="description"
                required
                className="w-full p-3 border rounded-md mt-2 bg-gray-50 text-gray-800"
              >
                <option value="Gehalt">Gehalt</option>
                <option value="Miete">Miete</option>
                <option value="investments">Investitionen</option>
                <option value="Lebensmittel">Lebensmittel</option>
                <option value="Shopping">Shopping</option>
                <option value="Freizeit">Freizeit</option>
                <option value="Sonstiges">Sonstiges</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Betrag (€)
              </label>
              <input
                id="amount"
                type="number"
                placeholder="Betrag (€)"
                required
                className="w-full p-3 border rounded-md mt-2 bg-gray-50 text-gray-800"
              />
            </div>

            <div>
              <label
                htmlFor="type-of-transactions"
                className="block text-sm font-medium text-gray-700"
              >
                Transaktionstyp
              </label>
              <select
                id="type-of-transactions"
                className="w-full p-3 border rounded-md mt-2 bg-gray-50 text-gray-800"
              >
                <option value="income">Einnahme</option>
                <option value="expense">Ausgabe</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300"
              >
                Hinzufügen
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Aktuelles Guthaben:</p>
            <span id="balance" className="font-bold text-2xl text-green-600">
              0 €
            </span>
          </div>
        </div>

       
    
    </>
  );
}

export default Home;
