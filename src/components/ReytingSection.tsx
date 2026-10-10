import React, { useState, useMemo } from 'react';
import { Search, X, RefreshCw } from 'lucide-react';
import { School } from '../types/school';
import { triggerHaptic } from '../utils/telegram';
import { SchoolCard } from './SchoolCard';

interface ReytingSectionProps {
  schools: School[];
  isLoading: boolean;
  onSelectSchool: (school: School) => void;
}

export const ReytingSection: React.FC<ReytingSectionProps> = ({
  schools,
  isLoading,
  onSelectSchool
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Barchasi');

  // Regions list
  const regions = useMemo(() => {
    const list = new Set<string>();
    schools.forEach((s) => list.add(s.region));
    return ['Barchasi', ...Array.from(list)];
  }, [schools]);

  // Filtered list
  const filteredSchools = useMemo(() => {
    return schools.filter((s) => {
      const matchesRegion = selectedRegion === 'Barchasi' || s.region === selectedRegion;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q);

      return matchesRegion && matchesSearch;
    });
  }, [schools, selectedRegion, searchQuery]);

  return (
    <div className="space-y-3.5 animate-in fade-in duration-150">
      {/* Qidiruv */}
      <div className="relative">
        <Search className="w-4 h-4 text-blue-300/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Maktab nomi, raqami yoki tuman bo'yicha qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0b1739] border border-[#182d5e] rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-blue-300/50 outline-none focus:border-blue-500 transition-colors shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/60 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Viloyat chiplari */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:text-sm no-scrollbar">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => {
              triggerHaptic('light');
              setSelectedRegion(region);
            }}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl transition-colors ${
              selectedRegion === region
                ? 'bg-blue-600 text-white border border-blue-400/60 font-semibold shadow-xs'
                : 'bg-[#0b1739] text-blue-200/80 hover:text-white border border-[#182d5e] font-normal'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Sanoq */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-blue-200/70 px-1 pt-1">
        <span>
          Ko'rsatilmoqda: <strong className="text-white font-semibold">{filteredSchools.length} ta</strong> maktab
        </span>
        {selectedRegion !== 'Barchasi' && (
          <button
            onClick={() => setSelectedRegion('Barchasi')}
            className="text-sky-400 hover:underline font-semibold"
          >
            Barchasi
          </button>
        )}
      </div>

      {/* Ro'yxat */}
      {isLoading ? (
        <div className="py-16 text-center space-y-2">
          <RefreshCw className="w-6 h-6 text-sky-400 animate-spin mx-auto" />
          <p className="text-xs text-blue-200/50">Top 100 maktablar ro'yxati yuklanmoqda...</p>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="py-12 text-center bg-[#0b1739]/60 border border-[#182d5e] rounded-2xl p-6 space-y-2 shadow-xs">
          <p className="text-sm font-semibold text-white">Maktab topilmadi</p>
          <p className="text-xs text-blue-200/50">Qidiruv so'zini o'zgartirib ko'ring.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSchools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              onSelect={onSelectSchool}
            />
          ))}
        </div>
      )}
    </div>
  );
};
