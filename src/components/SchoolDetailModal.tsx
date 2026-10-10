import React from 'react';
import { X, Star, MapPin, GraduationCap, Award, Users, Zap, Phone, Send } from 'lucide-react';
import { School } from '../types/school';
import { triggerHaptic } from '../utils/telegram';

interface SchoolDetailModalProps {
  school: School | null;
  onClose: () => void;
}

export const SchoolDetailModal: React.FC<SchoolDetailModalProps> = ({ school, onClose }) => {
  if (!school) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg max-h-[90vh] bg-[#08122c] border border-[#1b2f60] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#08122c] px-5 py-4 border-b border-[#14244a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-semibold">
              #{school.rank} - o'rin
            </span>
            <span className="text-xs text-blue-200/80 font-normal">{school.region}</span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#0e1d44] text-blue-200/80 hover:text-white transition-colors border border-blue-800/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-4">
          {/* School Name & Motto */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {school.name}
            </h2>
            {school.motto && (
              <p className="text-xs sm:text-sm italic text-amber-200/90 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20 mt-2 inline-block">
                «{school.motto}»
              </p>
            )}
          </div>

          {/* Rating Banner */}
          <div className="bg-gradient-to-r from-[#0d1d49] via-[#10245b] to-[#0a163a] border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs text-blue-200/80 font-medium block">Umumiy Reyting Bali</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-2xl font-bold text-white">{school.overallScore}</span>
                <span className="text-xs text-blue-200/60 font-medium">/ 100</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-blue-200/60 block">Top 100 dagi o'rni</span>
              <span className="text-lg font-bold text-amber-300">{school.rank}-o'rin</span>
            </div>
          </div>

          {/* Reyting ballari (Yo'nalishlar bo'yicha) */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-200/80">
              Reyting ko'rsatkichlari
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0c183a] border border-[#172b5a] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-sky-400 font-medium mb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>OTMga qabul</span>
                </div>
                <div className="text-base font-bold text-white">{school.universityAdmissionRate}%</div>
              </div>

              <div className="bg-[#0c183a] border border-[#172b5a] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-amber-400 font-medium mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Olimpiada bali</span>
                </div>
                <div className="text-base font-bold text-white">{school.olympiadScore} ball</div>
              </div>

              <div className="bg-[#0c183a] border border-[#172b5a] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-indigo-400 font-medium mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>O'qituvchilar salohiyati</span>
                </div>
                <div className="text-base font-bold text-white">{school.teacherScore} ball</div>
              </div>

              <div className="bg-[#0c183a] border border-[#172b5a] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Faollar faolligi</span>
                </div>
                <div className="text-base font-bold text-white">{school.activismScore} ball</div>
              </div>
            </div>
          </div>

          {/* Rahbariyat va faollar */}
          <div className="bg-[#0c183a] border border-[#172b5a] rounded-2xl p-3.5 space-y-2 text-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-200/80 mb-2">
              Mas'ullar
            </h3>
            <div className="flex items-center justify-between border-b border-[#172b5a] pb-2">
              <span className="text-blue-200/70">Maktab direktori:</span>
              <span className="font-semibold text-white text-right">{school.directorName}</span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-amber-300 font-medium">Yoshlar yetakchisi / faoli:</span>
              <span className="font-semibold text-white text-right">{school.leaderName}</span>
            </div>
          </div>

          {/* Tavsif */}
          {school.description && (
            <div className="text-xs sm:text-sm text-blue-100/85 bg-[#0c183a] p-3 rounded-xl border border-[#172b5a] leading-relaxed">
              {school.description}
            </div>
          )}

          {/* Joylashuv va Aloqa */}
          <div className="space-y-2 text-xs sm:text-sm text-blue-100/90">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400/80 shrink-0" />
              <span>{school.address}</span>
            </div>
            {school.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <a href={`tel:${school.phone}`} className="text-sky-300 font-medium hover:underline">
                  {school.phone}
                </a>
              </div>
            )}
            {school.telegram && (
              <div className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="text-sky-300 font-medium">{school.telegram}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#08122c] border-t border-[#14244a]">
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-[#0e1d44] hover:bg-[#132658] text-white border border-blue-600/40 font-semibold text-xs sm:text-sm transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
