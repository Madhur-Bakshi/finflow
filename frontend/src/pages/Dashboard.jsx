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
  Legend,
} from "recharts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [frauds, setFrauds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const COLORS = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
  ];

  const loadData = async () => {
    try {
      const txData = await fetchTransactions();
      const fraudData = await fetchFrauds();

      setTransactions([...txData].reverse());
      setFrauds(fraudData);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      await loadData();
    };

    initializeDashboard();

    const interval = setInterval(async () => {
      await loadData();
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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-10">FinFlow AI Dashboard</h1>

      <TransactionForm onTransactionAdded={loadData} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-xl mb-3">Total Transactions</h2>

          <p className="text-4xl font-bold">{transactions.length}</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-xl mb-3">Fraud Alerts</h2>

          <p className="text-4xl font-bold text-red-400">{frauds.length}</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-xl mb-3">Total Spending</h2>

          <p className="text-4xl font-bold">₹{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-slate-900 rounded-2xl p-6 h-[400px]">
          <h2 className="text-2xl mb-5">Spending Categories</h2>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Legend />
              <Pie data={categoryData} dataKey="value" outerRadius={120}>
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "none",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 h-[400px]">
          <h2 className="text-2xl mb-5">Fraud Monitoring</h2>

          {frauds.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fraudChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                <XAxis
                    dataKey="merchant"
                    stroke="#CBD5E1"
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                    height={60}
                  />

                <YAxis stroke="#CBD5E1" />

                <Tooltip />

                <Bar dataKey="count" fill="#EF4444" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-400 text-lg">No fraud alerts detected</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 mb-10">
        <h2 className="text-2xl mb-5 text-red-400">Recent Fraud Alerts</h2>

        {frauds.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3">Merchant</th>

                  <th className="text-left py-3">Amount</th>

                  <th className="text-left py-3">Reason</th>

                  <th className="text-left py-3">Risk</th>
                </tr>
              </thead>

              <tbody>
                {frauds
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((fraud) => (
                    <tr key={fraud.id} className="border-b border-slate-800">
                      <td className="py-3">{fraud.merchant}</td>

                      <td>₹{fraud.amount.toLocaleString()}</td>

                      <td>{fraud.reason}</td>

                      <td>
                        <span
                          className={`text-white text-xs px-2 py-1 rounded-full
                          ${
                            fraud.riskLevel === "CRITICAL"
                              ? "bg-purple-700"
                              : fraud.riskLevel === "HIGH"
                                ? "bg-red-500"
                                : "bg-yellow-500 text-black"
                          }`}
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
          <p className="text-slate-400">No fraud alerts detected</p>
        )}
      </div>

      <div className="bg-slate-900 rounded-2xl p-6">
        <h2 className="text-2xl mb-5">Recent Transactions</h2>

        <div className="overflow-x-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search merchant or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 p-3 rounded-lg flex-1"
            />

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-800 p-3 rounded-lg"
            >
              <option value="ALL">All Risks</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3">Merchant</th>

                <th className="text-left py-3">Category</th>

                <th className="text-left py-3">Amount</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.slice(0, 10).map((tx) => (
                <tr key={tx.id} className="border-b border-slate-800">
                  <td className="py-3">{tx.merchant}</td>

                  <td>{tx.category}</td>

                  <td>
                    <td>
                      ₹{tx.amount.toLocaleString()}
                      {(() => {
                        const matchingFraud = frauds.find(
                          (fraud) =>
                            fraud.merchant === tx.merchant &&
                            fraud.amount === tx.amount,
                        );

                        if (!matchingFraud) return null;

                        return (
                          <span
                            className={`ml-3 text-white px-2 py-1 rounded-full text-xs
        ${
          matchingFraud.riskLevel === "CRITICAL"
            ? "bg-purple-700"
            : matchingFraud.riskLevel === "HIGH"
              ? "bg-red-500"
              : "bg-yellow-500 text-black"
        }`}
                          >
                            {matchingFraud.riskLevel}
                          </span>
                        );
                      })()}
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}