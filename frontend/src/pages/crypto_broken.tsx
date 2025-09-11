import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { cryptoService, CoinData, PriceAlert } from "../services/cryptoService";

interface Investment {
  crypto: string;
  amount: number;
  priceAtInvestment: number;
  currency: string;
  date: string;
}

const POPULAR_COINS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC" },
  { id: "ripple", name: "Ripple", symbol: "XRP" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK" },
  { id: "binancecoin", name: "Binance Coin", symbol: "BNB" },
];

function Crypto() {
  const { user, loading: authLoading } = useAuth();
  const [topCoins, setTopCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'eur' | 'usd'>('eur');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [investResult, setInvestResult] = useState<string | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);

  // Show loading while checking auth
  if (authLoading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchTopCoins();
  }, [currency]);

  useEffect(() => {
    if (user) {
      loadPriceAlerts();
      calculatePortfolioValue();
      // Prüfe Alerts alle 30 Sekunden
      const alertInterval = setInterval(checkAlerts, 30000);
      return () => clearInterval(alertInterval);
    }
  }, [user]);

  const loadPriceAlerts = () => {
    if (!user) return;
    const alerts = cryptoService.getPriceAlerts(user.id);
    setPriceAlerts(alerts);
  };

  const calculatePortfolioValue = async () => {
    if (!user) return;
    try {
      const investments = getInvestments();
      const portfolioData = investments.map(inv => ({
        coinId: inv.crypto,
        amount: inv.amount
      }));
      
      if (portfolioData.length > 0) {
        const result = await cryptoService.calculatePortfolioValue(portfolioData, currency);
        setPortfolioValue(result.totalValue);
      }
    } catch (error) {
      console.error('Fehler bei Portfolio-Berechnung:', error);
    }
  };

  const checkAlerts = async () => {
    if (!user) return;
    try {
      const triggeredAlerts = await cryptoService.checkPriceAlerts(user.id);
      if (triggeredAlerts.length > 0) {
        const currencySymbol = currency === 'eur' ? '€' : '$';
        triggeredAlerts.forEach(alert => {
          setInvestResult(`🚨 Preis-Alert: ${alert.coinName} ist ${alert.condition === 'above' ? 'über' : 'unter'} ${currencySymbol}${alert.targetPrice}!`);
        });
        loadPriceAlerts(); // Reload alerts after checking
      }
    } catch (error) {
      console.error('Fehler beim Prüfen der Alerts:', error);
    }
  };

  const getInvestments = (): Investment[] => {
    const saved = localStorage.getItem(`investments_${user?.id || 'default'}`);
    return saved ? JSON.parse(saved) : [];
  };

  const fetchTopCoins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cryptoService.getTopCoins(currency, 50);
      setTopCoins(data);
    } catch (error) {
      setError("Fehler beim Laden der Krypto-Preise. API könnte überlastet sein.");
      console.error('Crypto API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!selectedCoin || !investAmount) {
      setInvestResult("Bitte alle Felder ausfüllen.");
      return;
    }

    try {
      // Verwende den aktuellen Preis von der API automatisch
      const newInvestment: Investment = {
        crypto: selectedCoin.id,
        amount: parseFloat(investAmount),
        priceAtInvestment: selectedCoin.current_price, // Automatischer Preis von API
        currency,
        date: new Date().toLocaleDateString("de-DE"),
      };

      const oldInvestments = localStorage.getItem(`investments_${user?.id || 'default'}`);
      const investments: Investment[] = oldInvestments ? JSON.parse(oldInvestments) : [];
      investments.push(newInvestment);
      localStorage.setItem(`investments_${user?.id || 'default'}`, JSON.stringify(investments));

      const currencySymbol = currency === 'eur' ? '€' : '$';
      setInvestResult(`Investment von ${investAmount} ${selectedCoin.symbol.toUpperCase()} zum aktuellen Preis von ${currencySymbol}${selectedCoin.current_price.toLocaleString()} erfolgreich gespeichert!`);
      setInvestAmount("");
      setShowInvestModal(false);
      setSelectedCoin(null);
      calculatePortfolioValue(); // Update portfolio value
    } catch (error) {
      setInvestResult("Fehler beim Speichern des Investments.");
    }
  };

  const handleCreateAlert = () => {
    if (!selectedCoin || !alertPrice || !user) {
      setInvestResult("Bitte alle Felder für den Alert ausfüllen.");
      return;
    }

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      targetPrice: parseFloat(alertPrice),
      condition: alertCondition,
      currency,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const currencySymbol = currency === 'eur' ? '€' : '$';
    cryptoService.savePriceAlert(newAlert, user.id);
    setInvestResult(`✅ Preis-Alert für ${selectedCoin.name} bei ${currencySymbol}${alertPrice} erstellt!`);
    setAlertPrice("");
    setShowAlertModal(false);
    setSelectedCoin(null);
    loadPriceAlerts();
  };

  const filteredCoins = topCoins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currencySymbol = currency === 'eur' ? '€' : '$';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Portfolio Value */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl">
            ₿ Krypto-Markt
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Verfolge die neuesten Kryptowährungspreise und füge sie zu deinem Investment-Portfolio hinzu
          </p>
          {portfolioValue > 0 && (
            <div className="mt-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 inline-block border border-white/20">
              <h3 className="text-white/80 text-sm">Dein Portfolio-Wert</h3>
              <p className="text-2xl font-bold text-green-400">{currencySymbol}{portfolioValue.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Active Alerts */}
        {priceAlerts.filter(alert => alert.isActive).length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">
              📊 Aktive Preis-Alerts ({priceAlerts.filter(alert => alert.isActive).length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {priceAlerts.filter(alert => alert.isActive).map(alert => (
                <div key={alert.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold">{alert.coinName}</h3>
                      <p className="text-white/70 text-sm">
                        {alert.condition === 'above' ? '📈' : '📉'} {alert.condition === 'above' ? 'Über' : 'Unter'} {currencySymbol}{alert.targetPrice}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        cryptoService.removePriceAlert(alert.id, user!.id);
                        loadPriceAlerts();
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <label className="block text-white/80 text-sm font-medium mb-2">Coin suchen</label>
              <input
                type="text"
                placeholder="Bitcoin, Ethereum, Solana..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Währung</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'eur' | 'usd')}
                className="p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="eur" className="text-black">EUR (€)</option>
                <option value="usd" className="text-black">USD ($)</option>
              </select>
            </div>

            <button
              onClick={fetchTopCoins}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Aktualisieren
            </button>
          </div>
        </div>

        {/* Popular Coins Quick Access */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Beliebte Coins</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_COINS.map(coin => (
              <button
                key={coin.id}
                onClick={() => setSearchTerm(coin.name)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm border border-white/20 transition-all"
              >
                {coin.symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner />
            <p className="text-white/80 mt-4">Lade Krypto-Preise...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
            <p className="text-red-200 text-center">{error}</p>
          </div>
        )}

        {investResult && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-8">
            <p className="text-green-200 text-center">{investResult}</p>
            <button
              onClick={() => setInvestResult(null)}
              className="mt-2 text-green-300 hover:text-green-100 text-sm underline"
            >
              Schließen
            </button>
          </div>
        )}

        {/* Coins List */}
        {!loading && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white">
                Top Kryptowährungen
                <span className="text-white/60 text-lg ml-2">({filteredCoins.length} von {topCoins.length})</span>
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-4 text-white/80 font-semibold">Rang</th>
                    <th className="text-left p-4 text-white/80 font-semibold">Coin</th>
                    <th className="text-right p-4 text-white/80 font-semibold">Preis</th>
                    <th className="text-right p-4 text-white/80 font-semibold">24h</th>
                    <th className="text-right p-4 text-white/80 font-semibold">7d</th>
                    <th className="text-right p-4 text-white/80 font-semibold">30d</th>
                    <th className="text-right p-4 text-white/80 font-semibold">Marktkapital</th>
                    <th className="text-center p-4 text-white/80 font-semibold">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoins.map((coin) => (
                    <tr key={coin.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-white/80">#{coin.market_cap_rank}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="text-white font-semibold">{coin.name}</div>
                            <div className="text-white/60 text-sm">{coin.symbol.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right text-white font-mono">
                        {currencySymbol}{coin.current_price.toLocaleString()}
                      </td>
                      <td className={`p-4 text-right font-semibold ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </td>
                      <td className={`p-4 text-right font-semibold ${coin.price_change_percentage_7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.price_change_percentage_7d?.toFixed(2)}%
                      </td>
                      <td className={`p-4 text-right font-semibold ${(coin.price_change_percentage_30d || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.price_change_percentage_30d?.toFixed(2) || 'N/A'}%
                      </td>
                      <td className="p-4 text-right text-white/80 font-mono">
                        {currencySymbol}{(coin.market_cap / 1e9).toFixed(1)}B
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setSelectedCoin(coin);
                              setShowInvestModal(true);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            💰 Investieren
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCoin(coin);
                              setShowAlertModal(true);
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            🔔 Alert
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCoins.length === 0 && !loading && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <h3 className="mt-2 text-lg font-medium text-white">Keine Coins gefunden</h3>
                <p className="mt-1 text-white/60">
                  Versuche einen anderen Suchbegriff.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Investment Modal */}
        {showInvestModal && selectedCoin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Investment hinzufügen</h3>
                <button
                  onClick={() => setShowInvestModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-lg border">
                <img src={selectedCoin.image} alt={selectedCoin.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="text-gray-800 font-semibold text-lg">{selectedCoin.name}</div>
                  <div className="text-gray-600">{selectedCoin.symbol.toUpperCase()}</div>
                  <div className="text-blue-600 font-bold">
                    Aktueller Preis: {currencySymbol}{selectedCoin.current_price.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Preis wird automatisch von der API geholt
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-medium mb-2">
                  Anzahl {selectedCoin.symbol.toUpperCase()}
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="z.B. 0.1"
                />
                {investAmount && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-green-800 font-semibold">
                      Gesamtwert: {currencySymbol}{(parseFloat(investAmount) * selectedCoin.current_price).toFixed(2)}
                    </div>
                    <div className="text-sm text-green-600">
                      Du kaufst {investAmount} {selectedCoin.symbol.toUpperCase()} zum aktuellen Marktpreis
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleInvest}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Investment speichern
                </button>
                <button
                  onClick={() => setShowInvestModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Price Alert Modal */}
        {showAlertModal && selectedCoin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Preis-Alert erstellen</h3>
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-lg border">
                <img src={selectedCoin.image} alt={selectedCoin.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="text-gray-800 font-semibold text-lg">{selectedCoin.name}</div>
                  <div className="text-gray-600">{selectedCoin.symbol.toUpperCase()}</div>
                  <div className="text-blue-600 font-bold">
                    Aktueller Preis: {currencySymbol}{selectedCoin.current_price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-medium mb-2">Alert-Bedingung</label>
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as 'above' | 'below')}
                  className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="above">📈 Preis steigt über</option>
                  <option value="below">📉 Preis fällt unter</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-medium mb-2">
                  Zielpreis ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder={`z.B. ${selectedCoin.current_price}`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateAlert}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Alert erstellen
                </button>
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Crypto;
