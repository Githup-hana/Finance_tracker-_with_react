// Service für Kryptowährung API Calls
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d?: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
}

export interface CoinDetails extends CoinData {
  description: {
    en: string;
    de?: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: number | null;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
}

export interface HistoricalPrice {
  price: number;
  market_cap: number;
  total_volume: number;
  timestamp: number;
}

export interface PriceAlert {
  id: string;
  coinId: string;
  coinName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  currency: 'eur' | 'usd';
  isActive: boolean;
  createdAt: string;
}

class CryptoService {
  // Hole Top Kryptowährungen
  async getTopCoins(currency: 'eur' | 'usd' = 'eur', limit: number = 50): Promise<CoinData[]> {
    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h,7d,30d`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fehler beim Laden der Top Coins:', error);
      throw new Error('Fehler beim Laden der Krypto-Preise');
    }
  }

  // Hole spezifische Coin Details
  async getCoinDetails(coinId: string): Promise<CoinDetails> {
    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fehler beim Laden der Coin Details:', error);
      throw new Error('Fehler beim Laden der Coin-Details');
    }
  }

  // Hole historische Preise
  async getHistoricalPrices(
    coinId: string, 
    currency: 'eur' | 'usd' = 'eur', 
    days: number = 7
  ): Promise<HistoricalPrice[]> {
    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Formatiere die Daten
      const historicalData: HistoricalPrice[] = data.prices.map((price: [number, number], index: number) => ({
        timestamp: price[0],
        price: price[1],
        market_cap: data.market_caps[index] ? data.market_caps[index][1] : 0,
        total_volume: data.total_volumes[index] ? data.total_volumes[index][1] : 0,
      }));
      
      return historicalData;
    } catch (error) {
      console.error('Fehler beim Laden der historischen Preise:', error);
      throw new Error('Fehler beim Laden der historischen Preisdaten');
    }
  }

  // Suche nach Coins
  async searchCoins(query: string): Promise<Array<{id: string, name: string, symbol: string, thumb: string}>> {
    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/search?query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.coins || [];
    } catch (error) {
      console.error('Fehler bei der Coin-Suche:', error);
      throw new Error('Fehler bei der Suche');
    }
  }

  // Hole aktuelle Preise für spezifische Coins
  async getCurrentPrices(
    coinIds: string[], 
    currency: 'eur' | 'usd' = 'eur'
  ): Promise<Record<string, number>> {
    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=${coinIds.join(',')}&vs_currencies=${currency}`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Konvertiere zu flachem Objekt
      const prices: Record<string, number> = {};
      Object.entries(data).forEach(([coinId, priceData]: [string, any]) => {
        prices[coinId] = priceData[currency];
      });
      
      return prices;
    } catch (error) {
      console.error('Fehler beim Laden der aktuellen Preise:', error);
      throw new Error('Fehler beim Laden der Preise');
    }
  }

  // Portfolio-Wert berechnen
  async calculatePortfolioValue(
    investments: Array<{coinId: string, amount: number}>, 
    currency: 'eur' | 'usd' = 'eur'
  ): Promise<{totalValue: number, coins: Array<{coinId: string, amount: number, value: number, price: number}>}> {
    try {
      const coinIds = investments.map(inv => inv.coinId);
      const currentPrices = await this.getCurrentPrices(coinIds, currency);
      
      let totalValue = 0;
      const coins = investments.map(inv => {
        const price = currentPrices[inv.coinId] || 0;
        const value = inv.amount * price;
        totalValue += value;
        
        return {
          coinId: inv.coinId,
          amount: inv.amount,
          value,
          price
        };
      });
      
      return { totalValue, coins };
    } catch (error) {
      console.error('Fehler bei der Portfolio-Berechnung:', error);
      throw new Error('Fehler bei der Portfolio-Berechnung');
    }
  }

  // Preis-Alerts verwalten
  savePriceAlert(alert: PriceAlert, userId: string): void {
    const alerts = this.getPriceAlerts(userId);
    alerts.push(alert);
    localStorage.setItem(`price_alerts_${userId}`, JSON.stringify(alerts));
  }

  getPriceAlerts(userId: string): PriceAlert[] {
    const alerts = localStorage.getItem(`price_alerts_${userId}`);
    return alerts ? JSON.parse(alerts) : [];
  }

  removePriceAlert(alertId: string, userId: string): void {
    const alerts = this.getPriceAlerts(userId);
    const filteredAlerts = alerts.filter(alert => alert.id !== alertId);
    localStorage.setItem(`price_alerts_${userId}`, JSON.stringify(filteredAlerts));
  }

  // Prüfe Preis-Alerts
  async checkPriceAlerts(userId: string): Promise<PriceAlert[]> {
    const alerts = this.getPriceAlerts(userId).filter(alert => alert.isActive);
    if (alerts.length === 0) return [];

    try {
      const coinIds = [...new Set(alerts.map(alert => alert.coinId))];
      const currentPrices = await this.getCurrentPrices(coinIds, 'eur');
      
      const triggeredAlerts: PriceAlert[] = [];
      
      alerts.forEach(alert => {
        const currentPrice = currentPrices[alert.coinId];
        if (!currentPrice) return;
        
        const isTriggered = 
          (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
          (alert.condition === 'below' && currentPrice <= alert.targetPrice);
        
        if (isTriggered) {
          triggeredAlerts.push(alert);
          // Deaktiviere den Alert
          alert.isActive = false;
        }
      });
      
      // Speichere aktualisierte Alerts
      if (triggeredAlerts.length > 0) {
        localStorage.setItem(`price_alerts_${userId}`, JSON.stringify(alerts));
      }
      
      return triggeredAlerts;
    } catch (error) {
      console.error('Fehler beim Prüfen der Preis-Alerts:', error);
      return [];
    }
  }

  // Trend-Analyse
  analyzeTrend(historicalPrices: HistoricalPrice[]): {
    trend: 'bullish' | 'bearish' | 'sideways';
    strength: number;
    priceChange: number;
    priceChangePercent: number;
  } {
    if (historicalPrices.length < 2) {
      return {
        trend: 'sideways',
        strength: 0,
        priceChange: 0,
        priceChangePercent: 0
      };
    }

    const firstPrice = historicalPrices[0].price;
    const lastPrice = historicalPrices[historicalPrices.length - 1].price;
    const priceChange = lastPrice - firstPrice;
    const priceChangePercent = (priceChange / firstPrice) * 100;

    let trend: 'bullish' | 'bearish' | 'sideways' = 'sideways';
    if (Math.abs(priceChangePercent) > 2) {
      trend = priceChangePercent > 0 ? 'bullish' : 'bearish';
    }

    const strength = Math.min(Math.abs(priceChangePercent) / 10, 1);

    return {
      trend,
      strength,
      priceChange,
      priceChangePercent
    };
  }
}

export const cryptoService = new CryptoService();
