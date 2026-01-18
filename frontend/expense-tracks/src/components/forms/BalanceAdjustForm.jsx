import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const BalanceAdjustForm = ({ onUpdate, modes }) => {
  const [amount, setAmount] = useState('');
  const [selectedMode, setSelectedMode] = useState(modes[0] || 'Cash');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    onUpdate(selectedMode, amount);
    setAmount('');
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 hover:border-slate-600 transition hover:shadow-lg">
      <h3 className="font-bold text-white flex items-center gap-2 text-lg">
        <PlusCircle size={20} className="text-emerald-400" />
        Adjust Balance
      </h3>
      
      <div className="flex gap-2">
        <select 
          className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition cursor-pointer"
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
        >
          {modes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        
        <input 
          type="number" 
          placeholder="Amount" 
          className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      
      <button className="w-full  from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 rounded-lg font-bold transition shadow-lg active:scale-95">
        Update Balance
      </button>
    </div>
  );
};

export default BalanceAdjustForm;