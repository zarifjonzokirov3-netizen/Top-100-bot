import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { School as SchoolIcon, PlusCircle, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { School, TabType } from '../types/school';
import { triggerHaptic } from '../utils/telegram';

interface MaktabRoyxatdanOtishSectionProps {
  onAddSchool: (school: School) => Promise<void>;
  onChangeTab: (tab: TabType) => void;
  onSelectSchool: (school: School) => void;
}

const REGIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Samarqand viloyati",
  "Farg'ona viloyati",
  "Andijon viloyati",
  "Namangan viloyati",
  "Buxoro viloyati",
  "Qashqadaryo viloyati",
  "Surxondaryo viloyati",
  "Xorazm viloyati",
  "Navoiy viloyati",
  "Jizzax viloyati",
  "Sirdaryo viloyati",
  "Qoraqalpog'iston Respublikasi"
];

export const MaktabRoyxatdanOtishSection: React.FC<MaktabRoyxatdanOtishSectionProps> = ({
  onAddSchool,
  onSelectSchool
}) => {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Toshkent shahri');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState<School['category']>('Umumta\'lim');
  const [studentsCount, setStudentsCount] = useState('850');
  const [teachersCount, setTeachersCount] = useState('65');
  const [admissionRate, setAdmissionRate] = useState('92');
  const [directorName, setDirectorName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [telegram, setTelegram] = useState('');
  const [motto, setMotto] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSchool, setSubmittedSchool] = useState<School | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      triggerHaptic('warning');
      alert("Iltimos, maktab nomini kiriting!");
      return;
    }

    if (!district.trim()) {
      triggerHaptic('warning');
      alert("Iltimos, tuman yoki shahar nomini kiriting!");
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('medium');

    try {
      const admRateNum = Math.min(100, Math.max(50, parseFloat(admissionRate) || 90));
      const calculatedOverall = Math.round((admRateNum * 0.95 + 4) * 10) / 10;
      const academic = admRateNum;
      const olympiad = Math.round((calculatedOverall - 0.5) * 10) / 10;
      const teacher = Math.round((calculatedOverall + 0.2) * 10) / 10;
      const activism = Math.round((calculatedOverall + 0.5) * 10) / 10;
      const infra = Math.round((calculatedOverall - 0.3) * 10) / 10;

      const newSchool: School = {
        id: `school-custom-${Date.now()}`,
        rank: 999,
        name: name.trim(),
        region: region,
        district: district.trim(),
        category: category,
        overallScore: Math.min(99.9, calculatedOverall),
        academicScore: Math.min(100, academic),
        olympiadScore: Math.min(100, olympiad),
        teacherScore: Math.min(100, teacher),
        activismScore: Math.min(100, activism),
        infrastructureScore: Math.min(100, infra),
        studentsCount: parseInt(studentsCount, 10) || 850,
        teachersCount: parseInt(teachersCount, 10) || 60,
        graduatesCount: Math.round((parseInt(studentsCount, 10) || 850) * 0.1),
        universityAdmissionRate: admRateNum,
        directorName: directorName.trim() || "Direktor kiritilmagan",
        leaderName: leaderName.trim() || "Faollar yetakchisi kiritilmagan",
        motto: motto.trim() || "Ilm va odob — kelajak poydevori",
        description: description.trim() || `${region}, ${district} hududidagi maktab. Ro'yxatdan o'tgan yangi ta'lim muassasasi.`,
        phone: phone.trim() || "+998 71 200-00-00",
        telegram: telegram.trim() || `@maktab_${district.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        address: `${region}, ${district.trim()}, Markaziy ko'cha`
      };

      await onAddSchool(newSchool);
      setSubmittedSchool(newSchool);

      triggerHaptic('heavy');
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Hero Banner - Deep Blue */}
      {/* Hero Banner - Deep Blue */}
      <div className="bg-gradient-to-br from-[#0a183d] via-[#0d2050] to-[#071330] border border-blue-600/30 rounded-2xl p-4 relative overflow-hidden shadow-[0_4px_25px_rgba(3,7,18,0.5)]">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-blue-500/20 text-sky-300 border border-blue-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Ariza Topshirish
            </span>
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1 bg-[#070e22]/80 px-2.5 py-0.5 rounded-full border border-amber-400/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              +50 ball bonus
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
            Maktabni Ro'yxatdan O'tkazish 🏫
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/85 mt-1.5 leading-relaxed">
            O'z maktabingizni respublika reyting tizimiga kiritish uchun ma'lumotlarni to'ldiring. Maktabingiz tekshirilib, umumiy reytingda aks etadi!
          </p>
        </div>
      </div>

      {/* If School was just submitted successfully */}
      {submittedSchool ? (
        <div className="bg-[#0b1739] border border-emerald-500/40 rounded-2xl p-5 text-center space-y-3.5 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/40">
              Muvaffaqiyatli Qo'shildi!
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-2 leading-snug">
              «{submittedSchool.name}»
            </h3>
            <p className="text-xs sm:text-sm text-blue-200/70 mt-1">
              Reyting bali: <strong className="text-amber-300 font-bold">{submittedSchool.overallScore} ball</strong> | {submittedSchool.region}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed bg-[#070e22] p-3 rounded-xl border border-[#172b5a]">
            Maktab muvaffaqiyatli ro'yxatdan o'tdi va reytingdagi o'rni qayta hisoblandi. Hisobingizga <strong>+50 ball</strong> qo'shildi!
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                triggerHaptic('light');
                onSelectSchool(submittedSchool);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <span>Maktabni ko'rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setSubmittedSchool(null);
                setName('');
                setDistrict('');
              }}
              className="py-2.5 px-3.5 rounded-xl bg-[#0e1d44] hover:bg-[#14285b] text-blue-200 font-medium text-xs sm:text-sm transition-colors border border-blue-800/50"
            >
              Yana qo'shish
            </button>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit} className="bg-[#0b1739] border border-[#182d5e] rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_4px_20px_rgba(3,7,18,0.4)]">
          <div className="flex items-center justify-between pb-2 border-b border-[#14244a]">
            <div className="flex items-center gap-2">
              <SchoolIcon className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                Maktab Ma'lumotlari Anketi
              </h3>
            </div>
            <span className="text-xs text-blue-300/50">* Majburiy maydonlar</span>
          </div>

          {/* Maktab Nomi */}
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium text-blue-100 block">
              Maktabning to'liq nomi *
            </label>
            <input
              type="text"
              required
              placeholder="Masalan: 45-sonli ixtisoslashtirilgan davlat maktabi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#070e22] border border-[#192f63] rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-blue-300/40 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Viloyat & Tuman */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-blue-100 block">
                Viloyat / Hudud *
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-[#070e22] border border-[#192f63] rounded-xl px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r} className="bg-[#070e22] text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-blue-100 block">
                Tuman / Shahar nomi *
              </label>
              <input
                type="text"
                required
                placeholder="Masalan: Mirzo Ulug'bek tumani"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#070e22] border border-[#192f63] rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-blue-300/40 outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Toifasi */}
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium text-blue-100 block">
              Maktab toifasi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {(['Umumta\'lim', 'IDUM', 'Ixtisoslashtirilgan', 'Prezident'] as School['category'][]).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    triggerHaptic('light');
                    setCategory(cat);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    category === cat
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-[#070e22] text-blue-200/70 border-[#192f63] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Ko'rsatkichlar */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-normal text-blue-200/70 block">
                O'quvchilar soni
              </label>
              <input
                type="number"
                value={studentsCount}
                onChange={(e) => setStudentsCount(e.target.value)}
                className="w-full bg-[#070e22] border border-[#192f63] rounded-xl px-2.5 py-1.5 text-xs sm:text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-blue-200/70 block">
                O'qituvchilar soni
              </label>
              <input
                type="number"
                value={teachersCount}
                onChange={(e) => setTeachersCount(e.target.value)}
                className="w-full bg-[#070e22] border border-[#192f63] rounded-xl px-2.5 py-1.5 text-xs sm:text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-blue-200/70 block">
                OTMga kirish foizi
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={admissionRate}
                onChange={(e) => setAdmissionRate(e.target.value)}
                className="w-full bg-[#070e22] border border-[#192f63] rounded-xl px-2.5 py-1.5 text-xs sm:text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Mas'ullar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-blue-100 block">
                Maktab direktori F.I.Sh
              </label>
              <input
                type="text"
                placeholder="Masalan: Qodirov Alisher Rustamovich"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                className="w-full bg-[#070e22] border border-[#192f63] rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-blue-300/40 outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-blue-100 block">
                Yoshlar yetakchisi / Faoli F.I.Sh
              </label>
              <input
                type="text"
                placeholder="Masalan: Karimova Dilnoza Farrux qizi"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="w-full bg-[#070e22] border border-[#192f63] rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-blue-300/40 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Aloqa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-blue-100 block">
                Telefon raqami
              </label>
              <input
                type="text"
                placeholder="+998 71 200-00-00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#070e22] border border-[#192f63] rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-blue-300/40 outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-blue-100 block">
                Telegram kanal yoki guruh
              </label>
              <input
                type="text"
                placeholder="@maktab_rasmiy_kanali"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="w-full bg-[#070e22] border border-[#192f63] rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-blue-300/40 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Shior */}
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium text-blue-100 block">
              Maktab shiori yoki qisqacha tavsif
            </label>
            <input
              type="text"
              placeholder="Masalan: «Ilm — najot, odob — fazilat»"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              className="w-full bg-[#070e22] border border-[#192f63] rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-blue-300/40 outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? "Ro'yxatdan o'tkazilmoqda..." : "Maktabni Ro'yxatdan O'tkazish (+50 ball)"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Info Card */}
      <div className="bg-[#0b1739] border border-[#182d5e] rounded-2xl p-4 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Ro'yxatdan o'tish afzalliklari:</span>
        </div>
        <ul className="text-xs sm:text-sm text-blue-100/80 space-y-1.5 pl-6 list-disc leading-relaxed">
          <li>Maktabingiz respublika Top 100 maktablar reytingi bazasiga kiritiladi;</li>
          <li>Maktab faollari uchun qo'shimcha 50 ball beriladi;</li>
          <li>Respublika tanlovlari va grantlarida ishtirok etish imkoniyati yaratiladi.</li>
        </ul>
      </div>
    </div>
  );
};
