

import { useEffect, useState } from "react";

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
}

function InvestmentPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [coinData, setCoinData] = useState<Record<string, CoinData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("investments");
    const arr: Investment[] = data ? JSON.parse(data) : [];
    setInvestments(arr);
    // Hole aktuelle Preise für alle investierten Coins
    const uniqueCoins = Array.from(new Set(arr.map((t) => t.crypto.toLowerCase())));
    if (uniqueCoins.length === 0) return;
    setLoading(true);
    setError(null);
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=${uniqueCoins.join(",")}`
    )
      .then((res) => res.json())
      .then((data: CoinData[]) => {
        const map: Record<string, CoinData> = {};
        data.forEach((coin) => {
          map[coin.id] = coin;
        });
        setCoinData(map);
        setLoading(false);
      })
      .catch(() => {
        setError("Fehler beim Laden der Krypto-Preise.");
        setLoading(false);
      });
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-2 sm:px-6 py-12">
      {/* Motivations-/Werbe-Bereich mit Bild */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-10 mb-12">
        <img
          src="/assets/finance-tracker-notion_4d470f76dc99e18ad75087b1b8410ea9.png"
          alt="Finance Tracker Auswertung Beispiel"
          className="w-full max-w-md rounded-2xl shadow-2xl border-4 border-white/30 object-cover"
          style={{maxHeight:'340px'}}
        />
        <div className="max-w-xl text-white/95 text-lg sm:text-xl flex flex-col gap-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-yellow-300 drop-shadow">So sieht deine Investment-Auswertung aus!</h2>
          <p>
            Behalte deine Investments, Gewinne und Verluste immer im Blick – übersichtlich, modern und motivierend. Visualisiere deine Fortschritte und lass dich von echten Zahlen inspirieren!
          </p>
          <p>
            <span className="font-semibold text-green-300">Tipp:</span> Nutze die Auswertungen, um deine Strategie zu optimieren und deine Ziele schneller zu erreichen.
          </p>
        </div>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-2xl text-center mb-8 tracking-tight">📈 Investitionen</h1>
      {loading && <div className="text-center text-blue-200 animate-pulse">Lade Preise...</div>}
      {error && <div className="text-center text-red-300 font-semibold">{error}</div>}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-lg font-semibold text-white/90">Gesamt investiert:</p>
        <p className="text-3xl text-green-300 font-extrabold bg-white/10 px-4 py-2 rounded-xl shadow-inner">
          {investments.reduce((acc, inv) => acc + (inv.amount * inv.priceAtInvestment), 0).toFixed(2)} €
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-100">Deine Investments</h2>
        {investments.length === 0 ? (
          <p className="text-white/60 text-center">Keine Investments gefunden.</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {investments.map((inv, idx) => {
              const coinId = inv.crypto.toLowerCase();
              const coin = coinData[coinId];
              const investAmount = Number(inv.amount) || 0;
              const investPrice = inv.priceAtInvestment || 0;
              let currentValue = 0;
              let diff = 0;
              let diffPercent = 0;
              if (coin) {
                currentValue = investAmount * coin.current_price;
                diff = currentValue - (investAmount * investPrice);
                diffPercent = investPrice > 0 ? (diff / (investAmount * investPrice)) * 100 : 0;
              }
              const coinOption = COIN_OPTIONS.find(c => c.id === inv.crypto);
              return (
                <li key={idx} className="bg-black/70 backdrop-blur-lg rounded-xl shadow-2xl p-6 flex flex-col gap-2 hover:shadow-blue-900/40 transition-shadow duration-200 border border-white/10">
                  <div className="flex items-center gap-4 mb-2">
                    {coin && <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full border border-blue-400" />} 
                    <div>
                      <div className="font-bold text-lg text-white flex items-center gap-2">
                        {coinOption ? coinOption.name : (coin ? coin.name : inv.crypto)}
                        {coin && (
                          <span className="ml-2 text-xs text-blue-200/90">({coin.symbol.toUpperCase()})</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-300">{inv.date}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-between text-sm">
                    <span className="text-gray-200">Menge: <span className="font-semibold">{investAmount}</span></span>
                    <span className="text-gray-200">Kaufpreis: <span className="font-semibold">{investPrice} {inv.currency.toUpperCase()}</span></span>
                  </div>
                  {coin && (
                    <div className="mt-2 text-right">
                      <div className="text-blue-200">Aktueller Preis: <span className="font-bold">{coin.current_price} {inv.currency.toUpperCase()}</span></div>
                      <div className="text-blue-200">Wert jetzt: <span className="font-bold">{currentValue.toFixed(2)} {inv.currency.toUpperCase()}</span></div>
                      <div className={diff >= 0 ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                        {diff >= 0 ? "Gewinn" : "Verlust"}: {diff.toFixed(2)} {inv.currency.toUpperCase()} ({diffPercent.toFixed(2)}%)
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default InvestmentPage;
