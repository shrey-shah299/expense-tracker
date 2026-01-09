import React from 'react';
import { Wallet, Landmark, LandmarkIcon } from 'lucide-react';

const BalanceCard = ({ title, amount, hideBalances }) => {
  const getIcon = () => {
    if (title === 'Cash') return <Wallet className="text-orange-400" size={24} />;
    if (title === 'HDFC') return <Landmark className="text-blue-400" size={24} />;
    return <LandmarkIcon className="text-emerald-400" size={24} />;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition group hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2 group-hover:text-cyan-400 transition">
            {hideBalances ? '••••' : `$${amount.toLocaleString()}`}
          </h3>
        </div>
        <div className="p-4 bg-slate-700/50 rounded-xl group-hover:bg-slate-700 transition">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;