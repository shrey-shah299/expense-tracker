import React, { useState } from 'react';
import { TrendingDown } from 'lucide-react';

const ExpenseForm = ({ onAdd, modes }) => {
  const [form, setForm] = useState({ amount: '', date: '', mode: modes[0] || 'Cash', note: '' });

  const submit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.date) return;
    onAdd({ ...form, id: Date.now(), type: 'expense' });
    setForm({ amount: '', date: '', mode: modes[0] || 'Cash', note: '' });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 hover:border-slate-600 transition hover:shadow-lg">
      <h3 className="font-bold text-white flex items-center gap-2 text-lg">
        <TrendingDown size={20} className="text-red-400" />
        Add Expense
      </h3>
      
      <input type="number" placeholder="Amount" required className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition" 
        value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
      
      <input type="date" required className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition" 
        value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
      
      <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition cursor-pointer" 
        value={form.mode} onChange={e => setForm({...form, mode: e.target.value})}>
        {modes.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      
      <input type="text" placeholder="Note (e.g., Lunch)" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition" 
        value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
      
      <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-bold transition shadow-lg active:scale-95">
        Record Expense
      </button>
    </div>
  );
};

export default ExpenseForm;