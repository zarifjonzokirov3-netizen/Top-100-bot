import React from 'react';
import { Trophy, Users, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { School, TabType } from '../types/school';
import { triggerHaptic, getTelegramUser } from '../utils/telegram';
import { PromoCarousel } from './PromoCarousel';

interface AsosiySectionProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
  onChangeTab: (tab: TabType) => void;
  userPoints: number;
  referralCount: number;
}

export const AsosiySection: React.FC<AsosiySectionProps> = ({
  schools,
  onSelectSchool,
  onChangeTab,
  userPoints,
  referralCount
}) => {
  const tgUser = getTelegramUser();
  const top3 = schools.slice(0, 3);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Welcome Banner - Deep Blue Dark */}
      <div className="bg-gradient-to-br from-[#0a183d] via-[#0d2050] to-[#071330] border border-blue-600/30 rounded-2xl p-4 shadow-[0_4px_25px_rgba(3,7,18,0.5)] relative overflow-hidden">
        {/* Subtle luminous blue ambient glow */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-blue-500/20 text-sky-300 border border-blue-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
              Maktab Faollari Portali
            </span>
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1 bg-[#070e22]/80 px-2.5 py-0.5 rounded-full border border-amber-400/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {userPoints} ball
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {tgUser ? `Salom, ${tgUser.first_name}! 👋` : "Salom, Maktab Faoli! 👋"}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/85 mt-1.5 leading-relaxed">
            Respublika bo'yicha eng ilg'or 100 ta maktablar reytingi va yoshlar faolligi platformasiga xush kelibsiz.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-blue-800/40">
            <div className="bg-[#070e22]/70 rounded-xl p-2.5 text-center border border-blue-900/50 shadow-xs">
              <span className="text-sm font-bold text-sky-400 block">100 ta</span>
              <span className="text-xs text-blue-200/70 block mt-0.5">Maktab</span>
            </div>
            <div className="bg-[#070e22]/70 rounded-xl p-2.5 text-center border border-blue-900/50 shadow-xs">
              <span className="text-sm font-bold text-amber-400 block">{userPoints}</span>
              <span className="text-xs text-blue-200/70 block mt-0.5">Sizning ball</span>
            </div>
            <div className="bg-[#070e22]/70 rounded-xl p-2.5 text-center border border-blue-900/50 shadow-xs">
              <span className="text-sm font-bold text-emerald-400 block">{referralCount} ta</span>
              <span className="text-xs text-blue-200/70 block mt-0.5">Do'stlar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Avtomatik o'tuvchi Reklama Sharxpalagi (Carousel) */}
      <PromoCarousel />

      {/* Top 3 Peshqadam Maktablar */}
      <div className="bg-[#0b1739] border border-[#182d5e] rounded-2xl p-4 space-y-3 shadow-[0_4px_20px_rgba(3,7,18,0.4)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Reyting Yetakchilari
            </h3>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onChangeTab('reyting');
            }}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
          >
            <span>Barchasi (100 ta)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {top3.map((school) => (
            <div
              key={school.id}
              onClick={() => {
                triggerHaptic('light');
                onSelectSchool(school);
              }}
              className="cursor-pointer group flex items-center justify-between p-2.5 rounded-xl bg-[#070e22]/60 hover:bg-[#0e1d44] border border-[#172b5a] transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                  school.rank === 1
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    : school.rank === 2
                    ? 'bg-slate-300/20 text-slate-200 border-slate-300/40'
                    : 'bg-orange-500/20 text-orange-300 border-orange-400/40'
                }`}>
                  {school.rank === 1 ? '🥇' : school.rank === 2 ? '🥈' : '🥉'}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                    {school.name}
                  </h4>
                  <p className="text-xs text-blue-200/70 line-clamp-1 mt-0.5">{school.region}</p>
                </div>
              </div>

              <div className="bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-lg text-amber-300 font-bold text-xs shrink-0 ml-2">
                {school.overallScore} ball
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div
          onClick={() => {
            triggerHaptic('medium');
            onChangeTab('referal');
          }}
          className="cursor-pointer group bg-[#0b1739] border border-[#182d5e] hover:border-blue-500/50 rounded-2xl p-3.5 transition-all shadow-xs active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-sky-400 flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
            Referal Dasturi
          </h4>
          <p className="text-xs text-blue-200/70 mt-1 leading-normal">
            Do'stlarni taklif qilib ball yig'ing
          </p>
        </div>

        <div
          onClick={() => {
            triggerHaptic('medium');
            onChangeTab('reyting');
          }}
          className="cursor-pointer group bg-[#0b1739] border border-[#182d5e] hover:border-blue-500/50 rounded-2xl p-3.5 transition-all shadow-xs active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 flex items-center justify-center mb-2">
            <Trophy className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
            Top 100 Reyting
          </h4>
          <p className="text-xs text-blue-200/70 mt-1 leading-normal">
            Maktablar tahlili va ko'rsatkichlari
          </p>
        </div>
      </div>

      {/* Faollar uchun eslatma */}
      <div className="bg-[#0b1739]/60 border border-[#182d5e]/70 rounded-2xl p-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="text-xs sm:text-sm">
          <h4 className="font-semibold text-white">Maktab faollari diqqatiga:</h4>
          <p className="text-blue-100/80 mt-1 leading-relaxed">
            Reyting ko'rsatkichlari har bir maktabning OTMga kirish foizi, fan olimpiadalari va sardorlar faolligi asosida tuzilgan.
          </p>
        </div>
      </div>
    </div>
  );
};
