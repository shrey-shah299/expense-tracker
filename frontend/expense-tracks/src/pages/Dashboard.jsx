import React from "react";
import { Wallet, TrendingDown, PieChart, Settings, Bell, Search, Menu, X, ShoppingCart, Utensils } from "lucide-react";
import SpendingHeatmap from "../components/dashboard/SpendingHeatmap";
import Expenseadder from "./Expenseadder";
import { Navigate, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate=useNavigate();

  const sampleTransactions = [
    { type: 'expense', date: 'Dec 28', amount: 85.50 },
    { type: 'expense', date: 'Dec 27', amount: 45.00 },
    { type: 'expense', date: 'Dec 26', amount: 120.75 },
    { type: 'expense', date: 'Dec 25', amount: 156.30 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 lg:px-16 py-4">
    <div className="flex h-screen bg-slate-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Welcome */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Expense Tracker</h1>
              <p className="text-slate-500 mt-1 text-sm">Manage and track your spending</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: Wallet, label: "Total Spent", value: "$3,245.50", change: "+8.2%", bgColor: "bg-red-50", textColor: "text-red-600" },
                { icon: TrendingDown, label: "This Month", value: "$1,120.00", change: "-2.5%", bgColor: "bg-orange-50", textColor: "text-orange-600" },
                { icon: ShoppingCart, label: "Cash", value: "8", change: "2 new", bgColor: "bg-blue-50", textColor: "text-blue-600" },
                { icon: ShoppingCart, label: "HDFC", value: "$456.20", change: "+15.3%", bgColor: "bg-green-50", textColor: "text-green-600" },
                { icon: ShoppingCart, label: "SBI", value: "$456.20", change: "+15.3%", bgColor: "bg-green-50", textColor: "text-green-600" }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow hover:-translate-y-0.5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-600 font-medium text-sm">{stat.label}</h3>
                    <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.textColor}`}>
                      <stat.icon size={18} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className={`text-sm mt-2 ${stat.change.startsWith("-") ? "text-green-600" : "text-red-600"}`}>{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Spending Trend</h2>
                <SpendingHeatmap transactions={sampleTransactions} />
              </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recent Expenses</h2>
                <button 
                 onClick={() => navigate("/expenseform")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium border-none cursor-pointer">
                  + Add Expense
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { desc: "Grocery Shopping", cat: "Food & Dining", amount: "$85.50", date: "Dec 28", status: "Completed" },
                      { desc: "Gas Station", cat: "Transport", amount: "$45.00", date: "Dec 27", status: "Completed" },
                      { desc: "Restaurant Dinner", cat: "Food & Dining", amount: "$120.75", date: "Dec 26", status: "Pending" },
                      { desc: "Electric Bill", cat: "Utilities", amount: "$156.30", date: "Dec 25", status: "Completed" }
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">{row.desc}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{row.cat}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-red-600">{row.amount}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{row.date}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            row.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;