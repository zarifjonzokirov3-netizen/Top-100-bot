import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Megaphone, ArrowUpRight, Award, BookOpen, Users, Compass } from 'lucide-react';
import { triggerHaptic, getTelegramWebApp } from '../utils/telegram';

interface PromoSlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  bgColor: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DURATION_MS = 4000; // Har bir slayd 4 soniya davomida to'ladi
const TICK_MS = 40; // 25fps ravon to'lish effekti

export const PromoCarousel: React.FC = () => {
  const slides: PromoSlide[] = [
    {
      id: 'slide-1',
      badge: 'Bosh Homiylik',
      title: 'Respublika "Eng Faol Maktab" Grand Tanlovi',
      description: 'G\'olib maktab sardorlari va faollari uchun 50 000 000 so\'mlik grant va noutbuklar jamg\'armasi!',
      buttonText: 'Tanlovda qatnashish',
      bgColor: 'bg-gradient-to-r from-[#0d1d49] via-[#11255c] to-[#0a163a]',
      badgeColor: 'bg-blue-500/25 text-sky-300 border-blue-400/40',
      icon: Award
    },
    {
      id: 'slide-2',
      badge: 'Xalqaro Ta\'lim',
      title: 'Top Universitetlar Ta\'lim Ko\'rgazmasi 2026',
      description: 'Maktab bitiruvchilari va faollari uchun xorijiy OTMlarga 100% grant yutib olish imkoniyati.',
      buttonText: 'Ro\'yxatdan o\'tish',
      bgColor: 'bg-gradient-to-r from-[#0a1840] via-[#0f2152] to-[#071333]',
      badgeColor: 'bg-indigo-500/25 text-indigo-300 border-indigo-400/40',
      icon: BookOpen
    },
    {
      id: 'slide-3',
      badge: 'Yoshlar Ittifoqi',
      title: 'Top 100 Maktab Sardorlari Forumi',
      description: 'Eng faol yoshlar yetakchilari va sardorlar uchun Toshkentda 3 kunlik yozgi innovatsion lager.',
      buttonText: 'Ariza topshirish',
      bgColor: 'bg-gradient-to-r from-[#0c1f4e] via-[#102863] to-[#09173c]',
      badgeColor: 'bg-sky-500/25 text-sky-300 border-sky-400/40',
      icon: Users
    },
    {
      id: 'slide-4',
      badge: 'Olimpiada Hamkorligi',
      title: 'Al-Xorazmiy Aniq Fanlar Sinov Testlari',
      description: 'Maktab o\'quvchilari uchun bepul onlayn diagnostika va xalqaro olimpiada tayyorgarligi.',
      buttonText: 'Testni boshlash',
      bgColor: 'bg-gradient-to-r from-[#09163c] via-[#0d1e50] to-[#071231]',
      badgeColor: 'bg-cyan-500/25 text-cyan-300 border-cyan-400/40',
      icon: Compass
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 dan 100 gacha to'lish foizi
  const [isPaused, setIsPaused] = useState(false);

  // Sekin to'lish va to'lganida keyingisiga avtomatik o'tish taymeri
  useEffect(() => {
    if (isPaused) return;

    const step = (TICK_MS / DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    setProgress(0);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleSelectSlide = (index: number) => {
    triggerHaptic('light');
    setProgress(0);
    setCurrentIndex(index);
  };

  const handleSlideClick = (slide: PromoSlide) => {
    triggerHaptic('medium');
    const tg = getTelegramWebApp();
    const alertMessage = `📢 ${slide.title}\n\n${slide.description}\n\nUshbu reklama loyihasida ishtirok etish uchun telegram kanaldagi rasmiy e'lonlar bilan tanishing.`;
    if (tg?.showAlert) {
      tg.showAlert(alertMessage);
    } else {
      alert(alertMessage);
    }
  };

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Slayderning yondan mayin suriluvchi konteyneri (Horizontal Sliding Carousel) */}
      <div className="overflow-hidden rounded-2xl border border-blue-800/40 shadow-[0_4px_25px_rgba(3,7,18,0.5)] bg-[#0a1538]">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const IconComponent = slide.icon;

            return (
              <div
                key={slide.id}
                onClick={() => handleSlideClick(slide)}
                className={`min-w-full w-full shrink-0 cursor-pointer p-4 sm:p-5 relative overflow-hidden transition-colors border-y border-transparent ${slide.bgColor}`}
              >
                {/* Subtle Decorative Deep Blue Glow */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Top Tag Row */}
                <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shadow-xs ${slide.badgeColor}`}>
                      {slide.badge}
                    </span>
                    <span className="text-xs text-sky-400 font-medium flex items-center gap-1">
                      <Megaphone className="w-3.5 h-3.5 text-sky-400" />
                      Reklama
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-medium text-blue-200/80 bg-[#070e22]/80 px-2.5 py-0.5 rounded-full border border-blue-800/50 shadow-xs">
                    <span>{index + 1}</span>
                    <span>/</span>
                    <span>{slides.length}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="relative z-10 space-y-1.5 pr-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#070e22]/90 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-xs text-sky-400">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {slide.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed line-clamp-2 pl-10.5">
                    {slide.description}
                  </p>
                </div>

                {/* Bottom Action Row */}
                <div className="mt-3.5 pt-2.5 border-t border-blue-800/40 flex items-center justify-between relative z-10">
                  <span className="text-xs font-semibold text-sky-300 hover:text-sky-200 flex items-center gap-1">
                    <span>{slide.buttonText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                  </span>

                  {/* Left/Right Arrows */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrev}
                      className="w-7 h-7 rounded-full bg-[#070e22]/90 hover:bg-[#0c1a40] text-blue-200 hover:text-white flex items-center justify-center border border-blue-800/50 shadow-xs active:scale-95 transition-all"
                      title="Oldingi"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-7 h-7 rounded-full bg-[#070e22]/90 hover:bg-[#0c1a40] text-blue-200 hover:text-white flex items-center justify-center border border-blue-800/50 shadow-xs active:scale-95 transition-all"
                      title="Keyingi"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pastdagi faqat navbati kelgan slaydgina sekin to'luvchi ko'rsatkich */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5 pb-0.5">
        {slides.map((_, index) => {
          const isActive = index === currentIndex;

          return (
            <button
              key={index}
              onClick={() => handleSelectSlide(index)}
              className={`h-2 rounded-full overflow-hidden transition-all duration-300 relative cursor-pointer ${
                isActive
                  ? 'w-10 bg-[#0e1d44] border border-blue-600/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                  : 'w-2 bg-blue-900/60 hover:bg-blue-800'
              }`}
              title={`${index + 1}-slayd`}
            >
              {isActive && (
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all ease-linear shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                  style={{
                    width: `${progress}%`,
                    transitionDuration: `${TICK_MS}ms`
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
