import React from 'react';
import { Award } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 bg-[#070e22]/90 backdrop-blur-md border-b border-[#182a57] px-4 py-3 shadow-[0_4px_20px_rgba(3,7,18,0.4)]">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600/30 to-sky-400/10 border border-blue-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            <Award className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white">
              Top 100 Maktablar
            </h1>
            <p className="text-xs text-blue-200/75">Maktab faollari reytingi</p>
          </div>
        </div>

        <div className="bg-[#0e1d44] border border-blue-500/30 rounded-full px-3 py-1 text-xs font-semibold text-sky-300 shadow-xs">
          100 ta maktab
        </div>
      </div>
    </header>
  );
};
