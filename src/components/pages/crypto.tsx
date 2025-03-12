function Crypto() {
    return ( <div className="max-w-lg mx-auto bg-blue-400  p-6 rounded-lg shadow-lg mt-10">
        <h1 className="text-4xl font-bold mt-6 text-center text-gray-900">
          Krypto-Preise
        </h1>
      
      
        <input
          type="text"
          id="crypto-input"
          className="w-full max-w-xs p-4 border-2 border-gray-300 rounded-md shadow-md mb-6 mx-auto block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Z.B. Bitcoin, Ethereum, Litecoin"
        />
      
        <select
          id="currency-select"
          className="w-full max-w-xs p-4 border-2 border-gray-300 rounded-md shadow-md mb-6 mx-auto block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
        </select>
      
        <button
          id="crypto-but"
          className="w-full max-w-xs p-4 border-2 border-blue-500 rounded-md shadow-md mb-6 mx-auto block bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Suchen
        </button>
      
       
        <div
          id="crypto-price-display"
          className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6"
        ></div>
      
        
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Krypto-Investition</h2>
        
          <div className="mb-4">
            <input
              type="text"
              id="crypto-input-invest"
              placeholder="Gib den Krypto-Namen ein (z.B. bitcoin)"
              className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
            />
          </div>
        
          <div className="mb-4">
            <select id="currency-select-invest" className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800">
              <option value="eur">Euro (EUR)</option>
              <option value="usd">US Dollar (USD)</option>
            </select>
          </div>
        
          <div className="mb-4">
            <input
              type="number"
              id="investment-amount"
              placeholder="Menge an Krypto, die du investieren möchtest"
              className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
            />
          </div>
        
          <button
            id="invest-button"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
          >
            Investieren
          </button>
      
          
          <div id="investment-result" className="mt-6"></div>
        </div>
        </div>
      );
}

export default Crypto;