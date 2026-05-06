import React, { useEffect, useState } from "react";
import { Wallet, TrendingDown, ShoppingCart } from "lucide-react";
import SpendingHeatmap from "../components/dashboard/SpendingHeatmap";
import Expenseadder from "./Expenseadder";
import api from "../api";
import { Navigate, useNavigate } from "react-router-dom";


function Dashboard() {
  const navigate=useNavigate();

  const [expenses ,setexpenses]=useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [totalspent ,settotalspent]=useState(0);
  const [spentthismonth ,setSpentthismonth]=useState(0);
  const [bymode ,setbymode]=useState({});
  useEffect(()=>{
    const fetchexpenses=async()=>{
      try{
        const res = await api.get("/allexpenses");
        if(res.length >0){
          setexpenses(res);
        }
      }
      catch(err){
        console.log(err);
      }
    }
    fetchexpenses();

    const fetchspent=async()=>{
      // Each call is independent so one failure doesn't block the others
      try{
        const res = await api.get("/total-spent");
        settotalspent(res.totalSpent);
      } catch(err){
        console.error("Error fetching total spent:", err);
      }

      try{
        const spentbymonth = await api.get("/spent-this-month");
        setSpentthismonth(spentbymonth.monthlySpent);
      } catch(err){
        console.error("Error fetching monthly spent:", err);
      }

      try{
        const modeRes = await api.get("/spent-by-mode");
        const byMode = {};
        modeRes.forEach(item => {
          byMode[item._id.toLowerCase()] = item.total;
        });
        setbymode(byMode);
      } catch(err){
        console.error("Error fetching spent by mode:", err);
      }

      try{
        const monthlyRes = await api.get("/expenses-by-month");
        console.log("Monthly expenses data:", monthlyRes);
        setMonthlyExpenses(monthlyRes);
      } catch(err){
        console.error("Error fetching expenses by month:", err);
      }
    }
    fetchspent();
  },[]);

  // Sort expenses by date ascending
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));

  // Group expenses by month for the monthly breakdown
  const expensesByMonth = sortedExpenses.reduce((acc, exp) => {
    const month = exp.month || 'Unknown';
    if (!acc[month]) acc[month] = [];
    acc[month].push(exp);
    return acc;
  }, {});


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-4 overflow-x-hidden">
    <div className="flex min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col ">
        {/* Header */}

        {/* Content Area */}
        <div className="min-h-screen ">
          <div className="p-8">
            {/* Welcome */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Expense Tracker</h1>
              <p className="text-slate-500 mt-1 text-sm">Manage and track your spending</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: Wallet, label: "Total Spent", value: `₹ ${totalspent}`, bgColor: "bg-red-50", textColor: "text-red-600" },
                { icon: TrendingDown, label: "This Month", value: `₹ ${spentthismonth}`, bgColor: "bg-orange-50", textColor: "text-orange-600" },
                { icon: ShoppingCart, label: "Cash", value: `₹${bymode.cash || 0}`, bgColor: "bg-blue-50", textColor: "text-blue-600" },
                { icon: ShoppingCart, label: "HDFC", value: `₹${bymode.hdfc || 0}`, bgColor: "bg-green-50", textColor: "text-green-600" },
                { icon: ShoppingCart, label: "SBI", value:  `₹${bymode.sbi || 0}` }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow hover:-translate-y-0.5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-600 font-medium text-sm">{stat.label}</h3>
                    <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.textColor}`}>
                      <stat.icon size={18} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
              <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Spending Trend</h2>
                <SpendingHeatmap transactions={expenses} />
              </div>

            {/* Monthly Expenses Breakdown */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow mt-8">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Monthly Expenses Breakdown</h2>
              </div>
              {monthlyExpenses.length > 0 ? (
                monthlyExpenses.map((row, i) => (
                  <div key={i} className="border-b border-slate-200 last:border-b-0">
                    {/* Month header */}
                    <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">{row._id}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500">{row.count} expenses</span>
                        <span className="text-sm font-bold text-red-600">₹{row.total}</span>
                      </div>
                    </div>
                    {/* Expenses for this month */}
                    {expensesByMonth[row._id] && expensesByMonth[row._id].length > 0 && (
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="px-6 py-2 text-left text-xs font-semibold text-slate-500">Date</th>
                              <th className="px-6 py-2 text-left text-xs font-semibold text-slate-500">Description</th>
                              <th className="px-6 py-2 text-left text-xs font-semibold text-slate-500">Spent On</th>
                              <th className="px-6 py-2 text-left text-xs font-semibold text-slate-500">Amount</th>
                              <th className="px-6 py-2 text-left text-xs font-semibold text-slate-500">Mode</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expensesByMonth[row._id].map((exp, j) => (
                              <tr key={j} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3 text-sm text-slate-600">{exp.CreatedAt.split('T')[0]}</td>
                                <td className="px-6 py-3 text-sm text-slate-900 font-medium">{exp.description}</td>
                                <td className="px-6 py-3 text-sm text-slate-600">{exp.spent}</td>
                                <td className="px-6 py-3 text-sm font-semibold text-red-600">₹{exp.amount}</td>
                                <td className="px-6 py-3 text-sm">
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{exp.mode}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {/* Mobile view for expenses */}
                    {expensesByMonth[row._id] && expensesByMonth[row._id].length > 0 && (
                      <div className="md:hidden p-4 space-y-3">
                        {expensesByMonth[row._id].map((exp, j) => (
                          <div key={j} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg">
                            <div>
                              <p className="font-medium text-sm text-slate-900">{exp.description}</p>
                              <p className="text-xs text-slate-500">{exp.CreatedAt.split('T')[0]} · {exp.spent}</p>
                            </div>
                            <p className="text-sm font-bold text-red-600">₹{exp.amount}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-600">No monthly data available</div>
              )}
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
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">SpentOn</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedExpenses.map((row, i) => (
                      <tr key={i} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">{row.description}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{row.spent}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-red-600">{row.amount}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{row.CreatedAt.split('T')[0]}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold`}>
                            {row.mode}
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