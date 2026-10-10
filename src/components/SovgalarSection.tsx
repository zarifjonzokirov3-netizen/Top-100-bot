import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, Headphones, Watch, Book, Laptop, Backpack, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { triggerHaptic, getTelegramWebApp } from '../utils/telegram';
import { TabType } from '../types/school';

interface SovgalarSectionProps {
  userPoints: number;
  onDeductPoints?: (points: number) => void;
  onChangeTab: (tab: TabType) => void;
}

interface PrizeItem {
  id: string;
  name: string;
  category: string;
  requiredPoints: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  tag?: string;
}

export const SovgalarSection: React.FC<SovgalarSectionProps> = ({
  userPoints,
  onChangeTab
}) => {
  const [claimedIds, setClaimedIds] = useState<string[]>([]);

  const prizes: PrizeItem[] = [
    {
      id: 'prize-1',
      name: 'Maktab Faoli Brend Ryukzaki',
      category: 'Aksessuar',
      requiredPoints: 100,
      description: 'Noutbuk uchun maxsus qulay ryukzak, sardorlar brend kundaligi va maxsus ruchka to\'plami.',
      icon: Backpack,
      iconBg: 'bg-blue-600/20',
      iconColor: 'text-sky-300',
      tag: 'Ommabop'
    },
    {
      id: 'prize-2',
      name: 'Simsiz Quloqchinlar (Wireless Earbuds)',
      category: 'Texnika',
      requiredPoints: 250,
      description: 'Darslar, audiokitoblar va onlayn ma\'ruzalar eshitish uchun sifatli shovqinsiz simsiz quloqchin.',
      icon: Headphones,
      iconBg: 'bg-indigo-600/20',
      iconColor: 'text-indigo-300'
    },
    {
      id: 'prize-3',
      name: 'Smart Aqlli Soat (Fitness Watch)',
      category: 'Gadjet',
      requiredPoints: 500,
      description: 'Kunlik faollik, qadamlar va salomatlik ko\'rsatkichlarini nazorat qiluvchi zamonaviy aqlli soat.',
      icon: Watch,
      iconBg: 'bg-cyan-600/20',
      iconColor: 'text-cyan-300',
      tag: 'Tavsiya'
    },
    {
      id: 'prize-4',
      name: 'Elektron Kitob (E-Reader)',
      category: 'Ta\'lim',
      requiredPoints: 1000,
      description: 'Ko\'zga qulay ekranli elektron kitob, 5 000 dan ortiq eng sara jahon va milliy adabiyotlar to\'plami bilan.',
      icon: Book,
      iconBg: 'bg-amber-600/20',
      iconColor: 'text-amber-300'
    },
    {
      id: 'prize-5',
      name: 'Grand Sovg\'a: Noutbuk / Planshet',
      category: 'Super Mukofot',
      requiredPoints: 2500,
      description: 'Eng faol sardorlar va respublika bo\'yicha eng ko\'p do\'stlarini taklif qilgan liderlar uchun zamonaviy noutbuk.',
      icon: Laptop,
      iconBg: 'bg-sky-600/25',
      iconColor: 'text-sky-300',
      tag: 'Grand Sovg\'a'
    }
  ];

  const handleClaim = (prize: PrizeItem) => {
    if (userPoints < prize.requiredPoints) {
      triggerHaptic('warning');
      const diff = prize.requiredPoints - userPoints;
      const tg = getTelegramWebApp();
      const msg = `Ushbu sovg'ani olish uchun sizga yana ${diff} ball kerak. Do'stlaringizni taklif qilib ball to'plashingiz mumkin!`;
      if (tg?.showAlert) {
        tg.showAlert(msg);
      } else {
        alert(msg);
      }
      return;
    }

    triggerHaptic('heavy');
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    setClaimedIds(prev => [...prev, prize.id]);

    const tg = getTelegramWebApp();
    const successMsg = `🎉 Tabriklaymiz!\n\nSiz «${prize.name}» sovg'asini olish uchun yetarli ball to'pladingiz.\n\nSovg'ani yetkazib berish va tasdiqlash uchun tez orada koordinatordan xabar olasiz!`;
    if (tg?.showAlert) {
      tg.showAlert(successMsg);
    } else {
      alert(successMsg);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Sovg'alar Hero Banner - Deep Blue */}
      <div className="bg-gradient-to-br from-[#0a183d] via-[#0d2050] to-[#071330] border border-blue-600/30 rounded-2xl p-4 relative overflow-hidden shadow-[0_4px_25px_rgba(3,7,18,0.5)]">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-blue-500/20 text-sky-300 border border-blue-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Sovg'alar Do'koni
            </span>
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1 bg-[#070e22]/80 px-2.5 py-0.5 rounded-full border border-amber-400/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {userPoints} ball mavjud
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
            Maktab Faollari Uchun Sovg'alar 🎁
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/85 mt-1.5 leading-relaxed">
            Ilovada faol bo'ling, do'stlaringizni taklif qiling, ball yig'ing va qimmatbaho mukofotlarni bepul qo'lga kiriting!
          </p>

          {/* Quick Action to get more points */}
          <div className="mt-3 pt-3 border-t border-blue-800/40 flex items-center justify-between">
            <span className="text-xs text-blue-200/70">Ballarni ko'paytirishni xohlaysizmi?</span>
            <button
              onClick={() => {
                triggerHaptic('light');
                onChangeTab('referal');
              }}
              className="text-xs font-semibold text-sky-300 hover:text-sky-200 flex items-center gap-1 bg-[#070e22] px-2.5 py-1 rounded-lg border border-blue-800/60 shadow-xs"
            >
              <span>Referal orqali ball olish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sovg'alar Katalogi */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            Mavjud Mukofotlar ({prizes.length} ta)
          </h3>
          <span className="text-xs text-blue-200/70">Ball evaziga bepul</span>
        </div>

        {prizes.map((prize) => {
          const Icon = prize.icon;
          const isEnough = userPoints >= prize.requiredPoints;
          const isClaimed = claimedIds.includes(prize.id);
          const percent = Math.min(100, Math.round((userPoints / prize.requiredPoints) * 100));

          return (
            <div
              key={prize.id}
              className="bg-[#0b1739] border border-[#182d5e] rounded-2xl p-4 shadow-[0_4px_20px_rgba(3,7,18,0.4)] space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-2xl ${prize.iconBg} ${prize.iconColor} border border-blue-500/20 flex items-center justify-center shrink-0 shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-blue-200/70 uppercase">
                      {prize.category}
                    </span>
                    {prize.tag && (
                      <span className="bg-blue-500/20 text-sky-300 border border-blue-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {prize.tag}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-white leading-snug">
                    {prize.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-100/80 mt-1 leading-relaxed">
                    {prize.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar & Cost */}
              <div className="bg-[#070e22] rounded-xl p-2.5 border border-[#182d5e] space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-blue-200/70 font-normal">Kerakli ball:</span>
                  <div className="flex items-center gap-1 font-bold text-white">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-amber-300">{prize.requiredPoints} ball</span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-[#0d1c44] rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isEnough ? 'bg-gradient-to-r from-blue-500 to-sky-400' : 'bg-blue-800'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-blue-200/70 pt-0.5">
                  <span>To'plangan: {userPoints} / {prize.requiredPoints}</span>
                  <span className="font-semibold text-sky-400">{percent}%</span>
                </div>
              </div>

              {/* Action Button */}
              {isClaimed ? (
                <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Arizangiz qabul qilindi</span>
                </div>
              ) : (
                <button
                  onClick={() => handleClaim(prize)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] ${
                    isEnough
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                      : 'bg-[#0e1d44] hover:bg-[#122557] text-blue-200/60 border border-blue-900/40'
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span>
                    {isEnough
                      ? "Sovg'ani olish 🎉"
                      : `Yana ${prize.requiredPoints - userPoints} ball kerak`}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Ball ishlash bo'yicha qo'llanma */}
      <div className="bg-[#0b1739] border border-[#182d5e] rounded-2xl p-4 space-y-2.5 shadow-[0_4px_20px_rgba(3,7,18,0.4)]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Ballarni qanday yig'ish mumkin?
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#070e22] border border-[#172b5a]">
            <div className="flex items-center gap-2">
              <span className="text-base">👥</span>
              <div>
                <span className="font-bold text-white block">Do'stlarni taklif qilish</span>
                <span className="text-[10px] text-blue-200/50">Har bir faol do'stingiz uchun</span>
              </div>
            </div>
            <span className="font-black text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30">
              +25 ball
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#070e22] border border-[#172b5a]">
            <div className="flex items-center gap-2">
              <span className="text-base">🏫</span>
              <div>
                <span className="font-bold text-white block">Maktabni ro'yxatdan o'tkazish</span>
                <span className="text-[10px] text-blue-200/50">Arizangiz tasdiqlanganda</span>
              </div>
            </div>
            <span className="font-black text-sky-300 bg-blue-600/20 px-2 py-0.5 rounded-lg border border-blue-500/30">
              +50 ball
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#070e22] border border-[#172b5a]">
            <div className="flex items-center gap-2">
              <span className="text-base">⭐</span>
              <div>
                <span className="font-bold text-white block">Kunlik kirish bonusi</span>
                <span className="text-[10px] text-blue-200/50">Ilovani ochganingiz uchun</span>
              </div>
            </div>
            <span className="font-black text-blue-200 bg-[#0e1d44] px-2 py-0.5 rounded-lg border border-blue-800/60">
              +5 ball
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
