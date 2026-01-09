import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Navbar = ({ hideBalances, setHideBalances }) => {
  return (
    <nav className="bg-slate-800/50 backdrop-blur border-b border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Financial Dashboard</h1>
      <button onClick={() => setHideBalances(!hideBalances)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition">
        {hideBalances ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </nav>
  );
};

export default Navbar;