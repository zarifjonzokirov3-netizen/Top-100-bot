import React from 'react';
import { Star, MapPin, ChevronRight } from 'lucide-react';
import { School } from '../types/school';
import { triggerHaptic } from '../utils/telegram';

interface SchoolCardProps {
  school: School;
  onSelect: (school: School) => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onSelect }) => {
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
          🥇 1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-8 h-8 rounded-xl bg-slate-300/20 border border-slate-300/40 text-slate-200 font-bold flex items-center justify-center text-xs shrink-0">
          🥈 2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-400/50 text-orange-300 font-bold flex items-center justify-center text-xs shrink-0">
          🥉 3
        </span>
      );
    }
    return (
      <span className="w-8 h-8 rounded-xl bg-[#070e22] border border-[#1b2f60] text-blue-200/90 font-semibold flex items-center justify-center text-xs shrink-0">
        #{rank}
      </span>
    );
  };

  return (
    <div
      onClick={() => {
        triggerHaptic('light');
        onSelect(school);
      }}
      className="cursor-pointer group bg-[#0b1739]/90 hover:bg-[#10204d] active:scale-[0.99] border border-[#182d5e] rounded-2xl p-3.5 transition-all flex items-center justify-between gap-3 shadow-[0_4px_15px_rgba(3,7,18,0.3)]"
    >
      <div className="flex items-center gap-3 min-w-0">
        {getRankBadge(school.rank)}

        <div className="min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-sky-300 transition-colors line-clamp-1 leading-snug">
            {school.name}
          </h3>
          <p className="text-xs text-blue-200/70 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400/70 shrink-0" />
            <span className="truncate">{school.region}, {school.district}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-xl text-right">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs sm:text-sm font-bold text-amber-300">{school.overallScore}</span>
          </div>
          <span className="text-[11px] text-blue-200/60 block -mt-0.5">ball</span>
        </div>
        <ChevronRight className="w-4 h-4 text-blue-300/50 group-hover:text-sky-300 transition-colors" />
      </div>
    </div>
  );
};
