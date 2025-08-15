
import { useState } from "react";

interface Investment {
  crypto: string;
  amount: number;
  priceAtInvestment: number;
  currency: string;
  date: string;
}

const COIN_OPTIONS = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "litecoin", name: "Litecoin" },
  { id: "ripple", name: "Ripple (XRP)" },
  { id: "cardano", name: "Cardano" },
  { id: "solana", name: "Solana" },
  { id: "dogecoin", name: "Dogecoin" },
  { id: "polkadot", name: "Polkadot" },
  { id: "tron", name: "TRON" },
  { id: "chainlink", name: "Chainlink" },
  { id: "uniswap", name: "Uniswap" },
  { id: "avalanche-2", name: "Avalanche" },
  { id: "matic-network", name: "Polygon (MATIC)" },
  { id: "binancecoin", name: "Binance Coin (BNB)" },
  { id: "stellar", name: "Stellar" },
  { id: "vechain", name: "VeChain" },
  { id: "monero", name: "Monero" },
  { id: "the-graph", name: "The Graph" },
  { id: "aptos", name: "Aptos" },
  { id: "arbitrum", name: "Arbitrum" },
];

function Crypto() {
  // Für Preisabfrage
  const [searchCoin, setSearchCoin] = useState("");
  const [searchCurrency, setSearchCurrency] = useState("eur");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Für Investment-Formular
  const [crypto, setCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("eur");
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  // Preisabfrage
  const handleSearch = async () => {
    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${searchCurrency}&ids=${searchCoin.toLowerCase()}`
      );
      const data = await res.json();
      if (data && data[0]) {
        setSearchResult(data[0]);
      } else {
        setSearchError("Coin nicht gefunden.");
      }
    } catch {
      setSearchError("Fehler bei der Preisabfrage.");
    }
    setSearchLoading(false);
  };

  // Investment speichern
  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultMsg(null);
    if (!crypto || !amount) {
      setResultMsg("Bitte alle Felder ausfüllen.");
      return;
    }
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${crypto.toLowerCase()}`
      );
      const data = await res.json();
      if (!data || !data[0]) {
        setResultMsg("Coin nicht gefunden oder Preis nicht verfügbar.");
        return;
      }
      const priceAtInvestment = data[0].current_price;
      const newInvestment: Investment = {
        crypto: crypto.toLowerCase(),
        amount: parseFloat(amount),
        priceAtInvestment,
        currency,
        date: new Date().toLocaleDateString("de-DE"),
      };
      const old = localStorage.getItem("investments");
      const arr: Investment[] = old ? JSON.parse(old) : [];
      arr.push(newInvestment);
      localStorage.setItem("investments", JSON.stringify(arr));
      setResultMsg("Investment gespeichert!");
      setCrypto("");
      setAmount("");
      setCurrency("eur");
    } catch {
      setResultMsg("Fehler beim Speichern. Bitte versuche es erneut.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-100 to-blue-300 p-4 sm:p-8 rounded-2xl shadow-xl mt-10 mb-10">
      <h1 className="text-4xl font-extrabold mt-6 text-center text-blue-800 mb-8 tracking-tight">Krypto-Preise</h1>
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:gap-8 gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
          <input
            type="text"
            list="coin-list-search"
            value={searchCoin}
            onChange={e => setSearchCoin(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="z.B. bitcoin, ethereum, litecoin"
          />
          <datalist id="coin-list-search">
            {COIN_OPTIONS.map((coin) => (
              <option key={coin.id} value={coin.id}>{coin.name}</option>
            ))}
          </datalist>
          <select
            value={searchCurrency}
            onChange={e => setSearchCurrency(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
          <button
            onClick={handleSearch}
            className="w-full p-4 rounded-lg bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition-colors duration-200"
            disabled={searchLoading}
          >
            {searchLoading ? "Lade..." : "Suchen"}
          </button>
          {searchError && <div className="text-red-600 text-center font-semibold">{searchError}</div>}
          {searchResult && (
            <div className="w-full bg-blue-50 p-6 rounded-lg shadow-inner space-y-2 text-center mt-2">
              <img src={searchResult.image} alt={searchResult.name} className="w-16 h-16 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{searchResult.name} ({searchResult.symbol.toUpperCase()})</div>
              <div className="text-lg">Aktueller Preis: <span className="font-bold">{searchResult.current_price} {searchCurrency.toUpperCase()}</span></div>
            </div>
          )}
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 mt-10 md:mt-0">
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">Krypto-Investition</h2>
          <form onSubmit={handleInvest} className="flex flex-col gap-4">
            <input
              list="coin-list"
              value={crypto}
              onChange={e => setCrypto(e.target.value)}
              placeholder="Krypto-Name wählen oder selbst eingeben"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
              required
            />
            <datalist id="coin-list">
              {COIN_OPTIONS.map((coin) => (
                <option key={coin.id} value={coin.id}>{coin.name}</option>
              ))}
            </datalist>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800">
              <option value="eur">Euro (EUR)</option>
              <option value="usd">US Dollar (USD)</option>
            </select>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Menge an Krypto"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
              required
              step="any"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              Investieren
            </button>
          </form>
          {resultMsg && <div className="mt-4 text-center text-green-600 font-semibold">{resultMsg}</div>}
        </div>
      </div>
    </div>
  );
}

export default Crypto;