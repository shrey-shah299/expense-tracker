import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const Transferform = ({ onTransfer, modes }) => {
  const [data, setData] = useState({ from: modes[0] || 'Cash', to: modes[1] || 'HDFC', amount: '' });

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!data.amount || data.from === data.to) return;
    onTransfer(data.from, data.to, data.amount);
    setData({ from: modes[0] || 'Cash', to: modes[1] || 'HDFC', amount: '' });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 hover:border-slate-600 transition hover:shadow-lg">
      <h3 className="font-bold text-white flex items-center gap-2 text-lg">
        <ArrowRightLeft size={20} className="text-purple-400" />
        Transfer Money
      </h3>
      
      <div className="flex gap-2">
        <select className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition cursor-pointer" 
          value={data.from} onChange={e => setData({...data, from: e.target.value})}>
          {modes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition cursor-pointer" 
          value={data.to} onChange={e => setData({...data, to: e.target.value})}>
          {modes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      
      <input type="number" placeholder="Transfer Amount" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition" 
        value={data.amount} onChange={e => setData({...data, amount: e.target.value})} />
      
      <button className="w-full  from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-lg font-bold transition shadow-lg active:scale-95">
        Move Funds
      </button>
    </div>
  );
};

export default Transferform;
