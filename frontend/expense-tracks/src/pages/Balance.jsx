import React, { useEffect, useState, useRef } from "react";
import {
  Wallet,
  Plus,
  Minus,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import api from "../api";

const MODES = [
  {
    key: "cash",
    label: "Cash",
    icon: "💵",
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-800",
    ring: "ring-emerald-400",
  },
  {
    key: "hdfc",
    label: "HDFC",
    icon: "🏦",
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-800",
    ring: "ring-blue-400",
  },
  {
    key: "sbi",
    label: "SBI",
    icon: "🏛️",
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-800",
    ring: "ring-violet-400",
  },
];

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium transition-all animate-[slideIn_0.3s_ease-out] ${
        type === "success"
          ? "bg-white border-emerald-200 text-emerald-800"
          : "bg-white border-red-200 text-red-800"
      }`}
    >
      {type === "success" ? (
        <CheckCircle size={18} className="text-emerald-500 shrink-0" />
      ) : (
        <AlertCircle size={18} className="text-red-500 shrink-0" />
      )}
      {message}
    </div>
  );
}

function BalanceCard({ mode, balance, onAdjust, loading }) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(null); // 'add' | 'remove' | null
  const inputRef = useRef(null);

  const handleAction = async (type) => {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      inputRef.current?.focus();
      return;
    }
    setSubmitting(type);
    await onAdjust(mode.key === "hdfc" ? "HDFC" : mode.key === "sbi" ? "SBI" : "cash", parsed, type);
    setAmount("");
    setSubmitting(null);
  };

  const displayBalance = typeof balance === "number" ? balance : 0;
  const isNegative = displayBalance < 0;

  return (
    <div
      className={`relative bg-white rounded-2xl border ${mode.border} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group`}
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${mode.gradient}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl ${mode.lightBg} flex items-center justify-center text-2xl shadow-inner`}
            >
              {mode.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{mode.label}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${mode.badge}`}>
                Wallet
              </span>
            </div>
          </div>
          {loading ? (
            <Loader2 size={20} className="text-slate-400 animate-spin" />
          ) : null}
        </div>

        {/* Balance Display */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Current Balance
          </p>
          <p
            className={`text-4xl font-extrabold tracking-tight ${
              isNegative ? "text-red-600" : "text-slate-900"
            }`}
          >
            {isNegative ? "-" : ""}₹{Math.abs(displayBalance).toLocaleString("en-IN")}
          </p>
          {isNegative && (
            <p className="text-xs text-red-500 mt-1 font-medium">⚠ Balance is negative</p>
          )}
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Enter Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              ₹
            </span>
            <input
              ref={inputRef}
              type="number"
              min="1"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAction("add");
              }}
              className={`w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 ${mode.ring} focus:border-transparent transition-all`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            id={`add-${mode.key}`}
            onClick={() => handleAction("add")}
            disabled={submitting !== null || !amount}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {submitting === "add" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Add Money
          </button>

          <button
            id={`remove-${mode.key}`}
            onClick={() => handleAction("remove")}
            disabled={submitting !== null || !amount}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting === "remove" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Minus size={16} />
            )}
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryRow({ entry }) {
  const isAdd = entry.type === "add";
  const modeInfo = MODES.find((m) => m.key === entry.mode.toLowerCase()) || MODES[0];

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-4 -mx-4 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isAdd ? "bg-emerald-100" : "bg-red-100"
          }`}
        >
          {isAdd ? (
            <TrendingUp size={14} className="text-emerald-600" />
          ) : (
            <TrendingDown size={14} className="text-red-600" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {isAdd ? "Added to" : "Removed from"}{" "}
            <span className={`${modeInfo.text} font-bold`}>{entry.mode.toUpperCase()}</span>
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <Clock size={10} />
            {new Date(entry.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <span
        className={`text-sm font-extrabold ${isAdd ? "text-emerald-600" : "text-red-600"}`}
      >
        {isAdd ? "+" : "-"}₹{entry.amount.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

function Balance() {
  const [balances, setBalances] = useState({ cash: 0, hdfc: 0, sbi: 0 });
  const [history, setHistory] = useState([]);
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchBalances = async () => {
    try {
      setLoadingBalances(true);
      const res = await api.get("/balance/current");
      setBalances(res);
    } catch (err) {
      console.error("Error fetching balances:", err);
      showToast("Failed to load balances", "error");
    } finally {
      setLoadingBalances(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await api.get("/balance/history");
      setHistory(res);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchBalances();
    fetchHistory();
  }, []);

  const handleAdjust = async (mode, amount, type) => {
    try {
      await api.post("/balance/adjust", { mode, amount, type });
      await fetchBalances();
      await fetchHistory();
      showToast(
        `₹${amount.toLocaleString("en-IN")} ${type === "add" ? "added to" : "removed from"} ${mode.toUpperCase()} successfully!`,
        "success"
      );
    } catch (err) {
      console.error("Error adjusting balance:", err);
      showToast("Failed to update balance. Please try again.", "error");
    }
  };

  const totalBalance =
    (balances.cash || 0) + (balances.hdfc || 0) + (balances.sbi || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-4 overflow-x-hidden">
      <div className="min-h-screen bg-slate-50">
        <div className="p-4 sm:p-8">

          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Wallet className="text-indigo-600" size={32} />
                Balance Manager
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Add or remove money from your Cash, HDFC and SBI wallets
              </p>
            </div>
            <button
              id="refresh-balances"
              onClick={() => { fetchBalances(); fetchHistory(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:shadow transition-all cursor-pointer"
            >
              <RefreshCw size={15} className={loadingBalances ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Total Balance Banner */}
          <div className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-indigo-200 text-sm font-semibold uppercase tracking-wider mb-1">
              Total Across All Wallets
            </p>
            <p className="text-5xl font-extrabold tracking-tight">
              ₹{totalBalance.toLocaleString("en-IN")}
            </p>
            <div className="flex items-center gap-6 mt-4 text-sm">
              {MODES.map((m) => (
                <span key={m.key} className="text-white/80 font-medium">
                  {m.icon} {m.label}:{" "}
                  <span className="text-white font-bold">
                    ₹{(balances[m.key] || 0).toLocaleString("en-IN")}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Wallet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {MODES.map((mode) => (
              <BalanceCard
                key={mode.key}
                mode={mode}
                balance={balances[mode.key] || 0}
                onAdjust={handleAdjust}
                loading={loadingBalances}
              />
            ))}
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock size={18} className="text-slate-400" />
                  Transaction History
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">All balance adjustments</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                {history.length} entries
              </span>
            </div>

            <div className="p-6">
              {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={28} className="animate-spin text-indigo-500" />
                  <span className="ml-3 text-slate-400 text-sm">Loading history...</span>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Clock size={22} className="text-slate-300" />
                  </div>
                  <p className="text-slate-400 text-sm">No transactions yet. Add money to a wallet to get started.</p>
                </div>
              ) : (
                <div>
                  {history.map((entry) => (
                    <HistoryRow key={entry._id} entry={entry} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default Balance;
