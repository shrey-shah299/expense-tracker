import React from 'react';
import { TrendingDown, TrendingUp, ArrowRightLeft, Trash2 } from 'lucide-react';

const TransactionList = ({ transactions, onDelete }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'expense': return <TrendingDown size={18} className="text-red-400" />;
      case 'income': return <TrendingUp size={18} className="text-emerald-400" />;
      case 'transfer': return <ArrowRightLeft size={18} className="text-purple-400" />;
      default: return null;
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition hover:shadow-lg">
      <h3 className="font-bold text-white text-lg mb-4">Recent Transactions</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No transactions yet</p>
        ) : (
          transactions.map(tx => (
            <div key={tx.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex items-center justify-between group hover:bg-slate-700 transition">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-slate-600 rounded-lg">
                  {getIcon(tx.type)}
                </div>
                <div>
                  <p className="text-white font-medium">{tx.mode}</p>
                  <p className="text-slate-400 text-sm">{tx.note || tx.date}</p>
                </div>
              </div>
              <div className="text-right mr-4">
                <p className={`font-bold ${tx.type === 'expense' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {tx.type === 'expense' ? '-' : '+'} ${Number(tx.amount).toLocaleString()}
                </p>
              </div>
              <button onClick={() => onDelete(tx.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition p-2 hover:bg-slate-600 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;