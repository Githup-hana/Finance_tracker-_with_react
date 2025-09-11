import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface Transaction {
  id?: string;
  Kategorie: string;
  amount: number;
  Transaktionstyp: "income" | "expense";
  date: string;
  description?: string;
}

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  thisMonthIncome: number;
  thisMonthExpenses: number;
}

function Dashboard() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
    thisMonthIncome: 0,
    thisMonthExpenses: 0,
  });

  useEffect(() => {
    // Load transactions from localStorage
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions);
      setTransactions(parsedTransactions);
      calculateStats(parsedTransactions);
    }
  }, []);

  const calculateStats = (transactionList: Transaction[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const calculatedStats = transactionList.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount) || 0;
        const transactionDate = transaction.date ? new Date(transaction.date.split('.').reverse().join('-')) : new Date();
        const isCurrentMonth = transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;

        if (transaction.Transaktionstyp === "income") {
          acc.totalIncome += amount;
          acc.balance += amount;
          if (isCurrentMonth) acc.thisMonthIncome += amount;
        } else {
          acc.totalExpenses += amount;
          acc.balance -= amount;
          if (isCurrentMonth) acc.thisMonthExpenses += amount;
        }

        acc.transactionCount += 1;
        return acc;
      },
      {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        transactionCount: 0,
        thisMonthIncome: 0,
        thisMonthExpenses: 0,
      }
    );

    setStats(calculatedStats);
  };

  const getRecentTransactions = () => {
    return transactions
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date.split('.').reverse().join('-')) : new Date(0);
        const dateB = b.date ? new Date(b.date.split('.').reverse().join('-')) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);
  };

  const getBalanceColor = () => {
    if (stats.balance > 0) return "text-green-600";
    if (stats.balance < 0) return "text-red-600";
    return "text-gray-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white">
            Willkommen zurück, {user?.firstName}!
          </h1>
          <p className="text-blue-100 mt-2">
            Hier ist dein Finanz-Dashboard mit allen wichtigen Informationen auf einen Blick.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Balance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Aktueller Saldo</dt>
                  <dd className={`text-2xl font-bold ${getBalanceColor()}`}>
                    €{stats.balance.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Total Income */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Gesamte Einnahmen</dt>
                  <dd className="text-2xl font-bold text-green-600">
                    €{stats.totalIncome.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Gesamte Ausgaben</dt>
                  <dd className="text-2xl font-bold text-red-600">
                    €{stats.totalExpenses.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Transaction Count */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Transaktionen</dt>
                  <dd className="text-2xl font-bold text-purple-600">
                    {stats.transactionCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Letzte Transaktionen</h3>
                <Link
                  to="/transactions"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  Alle anzeigen
                </Link>
              </div>
            </div>
            <div className="px-6 py-4">
              {getRecentTransactions().length > 0 ? (
                <div className="space-y-3">
                  {getRecentTransactions().map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          transaction.Transaktionstyp === "income" ? "bg-green-500" : "bg-red-500"
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.Kategorie}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${
                        transaction.Transaktionstyp === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.Transaktionstyp === "income" ? "+" : "-"}€{transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Noch keine Transaktionen vorhanden.</p>
                  <Link
                    to="/tracker"
                    className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Erste Transaktion hinzufügen
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Schnellzugriff</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/tracker"
                  className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-sm font-medium text-blue-900">Transaktion hinzufügen</p>
                  </div>
                </Link>

                <Link
                  to="/transactions"
                  className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm font-medium text-green-900">Alle Transaktionen</p>
                  </div>
                </Link>

                <Link
                  to="/investment"
                  className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <p className="text-sm font-medium text-purple-900">Investments</p>
                  </div>
                </Link>

                <Link
                  to="/crypto"
                  className="flex items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <p className="text-sm font-medium text-yellow-900">Krypto</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="mt-8 bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Dieser Monat</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">€{stats.thisMonthIncome.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Einnahmen</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">€{stats.thisMonthExpenses.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Ausgaben</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${
                  (stats.thisMonthIncome - stats.thisMonthExpenses) >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  €{(stats.thisMonthIncome - stats.thisMonthExpenses).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Netto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
