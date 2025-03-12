function Transactions() {
    return (<> <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          📊 Get Personalized Insights
        </h2>
      
        
        <div className="mb-4 pt-2.5">
          <select
            id="filter-description"
            className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Alle Kategorien</option>
            <option value="Miete">🏠 Miete</option>
            <option value="Gehalt">💰 Gehalt</option>
            <option value="investments">📈 Investments</option>
            <option value="Lebensmittel">🛒 Lebensmittel</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Freizeit">🎉 Freizeit</option>
            <option value="Sonstiges">🔹 Sonstiges</option>
          </select>
          
          <div className="filter-container mt-4">
            <input type="date" id="filter-date" className="block w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            id="filter-button"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
          >
            Filtern
          </button>
        </div>
      
        <div id="transaction-list" className="mt-4 bg-gray-50 p-4 rounded-lg shadow-md"></div>
      
        
      </div>
      </>
       );
}

export default Transactions;