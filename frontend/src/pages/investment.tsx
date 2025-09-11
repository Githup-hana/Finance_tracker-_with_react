

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const COIN_OPTIONS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC" },
  { id: "ripple", name: "Ripple", symbol: "XRP" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "tron", name: "TRON", symbol: "TRX" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK" },
  { id: "uniswap", name: "Uniswap", symbol: "UNI" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX" },
  { id: "matic-network", name: "Polygon", symbol: "MATIC" },
  { id: "binancecoin", name: "Binance Coin", symbol: "BNB" },
  { id: "stellar", name: "Stellar", symbol: "XLM" },
  { id: "vechain", name: "VeChain", symbol: "VET" },
  { id: "monero", name: "Monero", symbol: "XMR" },
  { id: "the-graph", name: "The Graph", symbol: "GRT" },
  { id: "aptos", name: "Aptos", symbol: "APT" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB" },
];

interface Investment {
  crypto: string;
  amount: number;
  priceAtInvestment: number;
  currency: string;
  date: string;
}

interface CoinData {
  id: string;
  name: string;
  image: string;
  current_price: number;
  symbol: string;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

function InvestmentPage() {
  const { user, loading: authLoading } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [coinData, setCoinData] = useState<Record<string, CoinData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    crypto: "",
    amount: "",
    priceAtInvestment: "",
    currency: "eur",
    date: new Date().toISOString().split('T')[0]
  });

  // Show loading while checking auth
  if (authLoading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const data = localStorage.getItem(`investments_${user?.id || 'default'}`);
    const arr: Investment[] = data ? JSON.parse(data) : [];
    setInvestments(arr);
    
    // Hole aktuelle Preise für alle investierten Coins
    const uniqueCoins = Array.from(new Set(arr.map((t) => t.crypto.toLowerCase())));
    if (uniqueCoins.length === 0) return;
    
    fetchCoinPrices(uniqueCoins);
  }, [user]);

  const fetchCoinPrices = async (coinIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${coinIds.join(",")}&price_change_percentage=24h`
      );
      const data: CoinData[] = await response.json();
      const map: Record<string, CoinData> = {};
      data.forEach((coin) => {
        map[coin.id] = coin;
      });
      setCoinData(map);
    } catch (error) {
      setError("Fehler beim Laden der Krypto-Preise.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvestment = () => {
    if (!newInvestment.crypto || !newInvestment.amount || !newInvestment.priceAtInvestment) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    const investment: Investment = {
      crypto: newInvestment.crypto,
      amount: parseFloat(newInvestment.amount),
      priceAtInvestment: parseFloat(newInvestment.priceAtInvestment),
      currency: newInvestment.currency,
      date: newInvestment.date
    };

    const updatedInvestments = [...investments, investment];
    setInvestments(updatedInvestments);
    localStorage.setItem(`investments_${user?.id || 'default'}`, JSON.stringify(updatedInvestments));
    
    // Reset form
    setNewInvestment({
      crypto: "",
      amount: "",
      priceAtInvestment: "",
      currency: "eur",
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);

    // Refresh prices
    const uniqueCoins = Array.from(new Set(updatedInvestments.map((t) => t.crypto.toLowerCase())));
    fetchCoinPrices(uniqueCoins);
  };

  const removeInvestment = (index: number) => {
    if (confirm("Möchtest du dieses Investment wirklich löschen?")) {
      const updatedInvestments = investments.filter((_, i) => i !== index);
      setInvestments(updatedInvestments);
      localStorage.setItem(`investments_${user?.id || 'default'}`, JSON.stringify(updatedInvestments));
    }
  };

  const totalInvested = investments.reduce((acc, inv) => acc + (inv.amount * inv.priceAtInvestment), 0);
  const currentValue = investments.reduce((acc, inv) => {
    const coin = coinData[inv.crypto.toLowerCase()];
    return acc + (coin ? inv.amount * coin.current_price : inv.amount * inv.priceAtInvestment);
  }, 0);
  const totalGainLoss = currentValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl">
            📈 Investment Portfolio
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Verwalte deine Krypto-Investments professionell und behalte deine Performance im Blick
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Gesamt Investiert</p>
                <p className="text-2xl font-bold text-white">€{totalInvested.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Aktueller Wert</p>
                <p className="text-2xl font-bold text-white">€{currentValue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Gewinn/Verlust</p>
                <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalGainLoss >= 0 ? '+' : ''}€{totalGainLoss.toFixed(2)}
                </p>
                <p className={`text-sm ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ({totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%)
                </p>
              </div>
              <div className={`p-3 ${totalGainLoss >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-full`}>
                <svg className={`w-6 h-6 ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={totalGainLoss >= 0 ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V6"}></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {showAddForm ? "Formular schließen" : "+ Neues Investment hinzufügen"}
          </button>
        </div>

        {/* Add Investment Form */}
        {showAddForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Neues Investment hinzufügen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Kryptowährung</label>
                <select
                  value={newInvestment.crypto}
                  onChange={(e) => setNewInvestment({...newInvestment, crypto: e.target.value})}
                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="">Auswählen...</option>
                  {COIN_OPTIONS.map(coin => (
                    <option key={coin.id} value={coin.id} className="text-black">
                      {coin.name} ({coin.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Menge</label>
                <input
                  type="number"
                  step="0.00000001"
                  value={newInvestment.amount}
                  onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})}
                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="z.B. 0.5"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Kaufpreis (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newInvestment.priceAtInvestment}
                  onChange={(e) => setNewInvestment({...newInvestment, priceAtInvestment: e.target.value})}
                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="z.B. 45000"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Kaufdatum</label>
                <input
                  type="date"
                  value={newInvestment.date}
                  onChange={(e) => setNewInvestment({...newInvestment, date: e.target.value})}
                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddInvestment}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Investment hinzufügen
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <LoadingSpinner />
            <p className="text-white/80 mt-4">Lade aktuelle Preise...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
            <p className="text-red-200 text-center">{error}</p>
          </div>
        )}

        {/* Investments List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Deine Investments</h2>
            <span className="text-white/70">{investments.length} Investment{investments.length !== 1 ? 's' : ''}</span>
          </div>

          {investments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-white">Noch keine Investments</h3>
              <p className="mt-1 text-white/60">
                Füge dein erstes Investment hinzu, um dein Portfolio zu starten.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {investments.map((inv, idx) => {
                const coinId = inv.crypto.toLowerCase();
                const coin = coinData[coinId];
                const coinOption = COIN_OPTIONS.find(c => c.id === inv.crypto);
                const investAmount = Number(inv.amount) || 0;
                const investPrice = inv.priceAtInvestment || 0;
                const totalInvestValue = investAmount * investPrice;
                
                let currentValue = totalInvestValue;
                let diff = 0;
                let diffPercent = 0;
                
                if (coin) {
                  currentValue = investAmount * coin.current_price;
                  diff = currentValue - totalInvestValue;
                  diffPercent = totalInvestValue > 0 ? (diff / totalInvestValue) * 100 : 0;
                }

                return (
                  <div key={idx} className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {coin && (
                          <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full border-2 border-white/20" />
                        )}
                        <div>
                          <h3 className="font-bold text-white text-lg">
                            {coinOption?.name || coin?.name || inv.crypto}
                          </h3>
                          <p className="text-white/60 text-sm">
                            {coinOption?.symbol || coin?.symbol?.toUpperCase() || inv.crypto}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeInvestment(idx)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Investment Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Menge:</span>
                        <span className="text-white font-medium">{investAmount.toFixed(8)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Kaufpreis:</span>
                        <span className="text-white font-medium">€{investPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Investiert:</span>
                        <span className="text-white font-medium">€{totalInvestValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Datum:</span>
                        <span className="text-white font-medium">{inv.date}</span>
                      </div>

                      {coin && (
                        <>
                          <hr className="border-white/20" />
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Aktueller Preis:</span>
                            <span className="text-white font-medium">€{coin.current_price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Aktueller Wert:</span>
                            <span className="text-white font-medium">€{currentValue.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Gewinn/Verlust:</span>
                            <span className={`font-bold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {diff >= 0 ? '+' : ''}€{diff.toFixed(2)} ({diff >= 0 ? '+' : ''}{diffPercent.toFixed(2)}%)
                            </span>
                          </div>
                          {coin.price_change_percentage_24h && (
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">24h Änderung:</span>
                              <span className={`font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvestmentPage;
