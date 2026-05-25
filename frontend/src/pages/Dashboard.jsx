import { useEffect, useState } from "react";
import { fetchTransactions, fetchFrauds } from "../services/api";
import TransactionForm from "../components/TransactionForm";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [frauds, setFrauds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];

  const loadData = async () => {
    try {
      const txData = await fetchTransactions();
      const fraudData = await fetchFrauds();

      setTransactions([...txData].reverse());
      setFrauds(fraudData.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const categoryMap = {};

  transactions.forEach((tx) => {
    categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
  });

  const categoryData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  const fraudCountMap = {};

  frauds.forEach((fraud) => {
    fraudCountMap[fraud.merchant] = (fraudCountMap[fraud.merchant] || 0) + 1;
  });

  const fraudChartData = Object.keys(fraudCountMap).map((merchant) => ({
    merchant,
    count: fraudCountMap[merchant],
  }));

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchingFraud = frauds.find(
      (fraud) => fraud.merchant === tx.merchant && fraud.amount === tx.amount,
    );

    const matchesRisk =
      riskFilter === "ALL" ? true : matchingFraud?.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (riskLevel) => {
    if (riskLevel === "CRITICAL") {
      return "bg-purple-700 text-white";
    }

    if (riskLevel === "HIGH") {
      return "bg-red-500 text-white";
    }

    if (riskLevel === "MEDIUM") {
      return "bg-yellow-400 text-black";
    }

    return "bg-slate-500 text-white";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-3 py-2">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-3">FinFlow Dashboard</h1>

        {/* FORM */}
        <div className="mb-3">
          <TransactionForm onTransactionAdded={loadData} />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div className="bg-slate-900 rounded-xl p-3">
            <h2 className="text-sm text-slate-400 mb-1">Total Transactions</h2>

            <p className="text-3xl font-bold">{transactions.length}</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-3">
            <h2 className="text-sm text-slate-400 mb-1">Fraud Alerts</h2>

            <p className="text-3xl font-bold text-red-400">{frauds.length}</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-3">
            <h2 className="text-sm text-slate-400 mb-1">Total Spending</h2>

            <p className="text-3xl font-bold">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          {/* PIE CHART */}
          <div className="bg-slate-900 rounded-xl p-3 h-[280px]">
            <h2 className="text-lg mb-2">Spending Categories</h2>

            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" outerRadius={80}>
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* BAR CHART */}
          <div className="bg-slate-900 rounded-xl p-3 h-[280px]">
            <h2 className="text-lg mb-2">Fraud Monitoring</h2>

            {frauds.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={fraudChartData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="merchant" tick={{ fontSize: 11 }} />

                  <YAxis tick={{ fontSize: 11 }} />

                  <Tooltip />

                  <Bar dataKey="count" fill="#EF4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                No fraud alerts detected
              </div>
            )}
          </div>
        </div>

        {/* TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* FRAUD TABLE */}
          <div className="bg-slate-900 rounded-xl p-3">
            <h2 className="text-lg text-red-400 mb-3">Recent Fraud Alerts</h2>

            {frauds.length > 0 ? (
              <div className="overflow-auto max-h-[320px]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2">Merchant</th>

                      <th className="text-left py-2">Amount</th>

                      <th className="text-left py-2">Risk</th>
                    </tr>
                  </thead>

                  <tbody>
                    {frauds.slice(0, 6).map((fraud) => (
                      <tr key={fraud.id} className="border-b border-slate-800">
                        <td className="py-2">{fraud.merchant}</td>

                        <td>₹{fraud.amount.toLocaleString()}</td>

                        <td>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getRiskColor(
                              fraud.riskLevel,
                            )}`}
                          >
                            {fraud.riskLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No fraud alerts detected</p>
            )}
          </div>

          {/* TRANSACTION TABLE */}
          <div className="bg-slate-900 rounded-xl p-3">
            <h2 className="text-lg mb-3">Recent Transactions</h2>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 px-3 py-2 rounded-lg flex-1 text-sm"
              />

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-slate-800 px-3 py-2 rounded-lg text-sm"
              >
                <option value="ALL">All</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="overflow-auto max-h-[320px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2">Merchant</th>

                    <th className="text-left py-2">Category</th>

                    <th className="text-left py-2">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.slice(0, 10).map((tx) => {
                    const matchingFraud = frauds.find(
                      (fraud) =>
                        fraud.merchant === tx.merchant &&
                        fraud.amount === tx.amount,
                    );

                    return (
                      <tr key={tx.id} className="border-b border-slate-800">
                        <td className="py-2">{tx.merchant}</td>

                        <td>{tx.category}</td>

                        <td>
                          ₹{tx.amount.toLocaleString()}
                          {matchingFraud && (
                            <span
                              className={`ml-2 text-xs px-2 py-1 rounded-full ${getRiskColor(
                                matchingFraud.riskLevel,
                              )}`}
                            >
                              {matchingFraud.riskLevel}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
