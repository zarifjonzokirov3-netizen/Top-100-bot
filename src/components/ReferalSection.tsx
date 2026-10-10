import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Copy, Check, Share2, Gift, UserPlus, ExternalLink } from 'lucide-react';
import { triggerHaptic, getTelegramUser, getTelegramWebApp } from '../utils/telegram';

interface ReferalSectionProps {
  userPoints: number;
  referralCount: number;
  onAddReferralDemo: () => void;
}

export const ReferalSection: React.FC<ReferalSectionProps> = ({
  referralCount,
  onAddReferralDemo
}) => {
  const tgUser = getTelegramUser();
  const [copied, setCopied] = useState(false);

  const [botUsername, setBotUsername] = useState(() => {
    try {
      return localStorage.getItem('maktab_bot_username') || 'FaolMaktab_uzbot';
    } catch {
      return 'FaolMaktab_uzbot';
    }
  });
  const [appShortName, setAppShortName] = useState(() => {
    try {
      return localStorage.getItem('maktab_app_short_name') || 'FaolMaktabUz';
    } catch {
      return 'FaolMaktabUz';
    }
  });
  const [isEditingBot, setIsEditingBot] = useState(false);
  const [tempBotName, setTempBotName] = useState(botUsername);
  const [tempShortName, setTempShortName] = useState(appShortName);

  const [linkType, setLinkType] = useState<'startapp' | 'start'>('startapp');
  const [copiedAppUrl, setCopiedAppUrl] = useState(false);

  const userId = tgUser?.id || '77890123';
  // Both Telegram Mini App format and Telegram Bot format
  const referralLink = linkType === 'startapp'
    ? `https://t.me/${botUsername}/${appShortName}?startapp=ref_${userId}`
    : `https://t.me/${botUsername}?start=ref_${userId}`;

  const currentAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-ymlgtgevgybmqinhodxkji-126488632617.asia-southeast1.run.app';

  const handleCopyAppUrl = () => {
    triggerHaptic('medium');
    try {
      navigator.clipboard.writeText(currentAppUrl);
      setCopiedAppUrl(true);
      setTimeout(() => setCopiedAppUrl(false), 2500);
    } catch {}
  };

  const handleSaveBotName = () => {
    const cleanBot = tempBotName.replace('@', '').trim() || 'FaolMaktab_uzbot';
    const cleanShort = tempShortName.trim() || 'FaolMaktabUz';
    setBotUsername(cleanBot);
    setAppShortName(cleanShort);
    setIsEditingBot(false);
    try {
      localStorage.setItem('maktab_bot_username', cleanBot);
      localStorage.setItem('maktab_app_short_name', cleanShort);
    } catch {}
  };

  const handleOpenTelegramApp = () => {
    triggerHaptic('medium');
    const directUrl = `https://t.me/${botUsername}/${appShortName}`;
    const tg = getTelegramWebApp();
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(directUrl);
    } else {
      window.open(directUrl, '_blank');
    }
  };

  const handleCopyLink = () => {
    triggerHaptic('medium');
    try {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleShareTelegram = () => {
    triggerHaptic('heavy');
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    const shareText = encodeURIComponent(
      `🏫 Salom! Maktab faollari uchun Top 100 maktablar reytingi web appiga qo'shiling va o'z maktabingiz ko'rsatkichlarini ko'ring!\n\n🎁 Havola orqali kirsangiz sizga darhol +10 ball beriladi:\n`
    );
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${shareText}`;

    const tg = getTelegramWebApp();
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const sampleFriends = [
    { name: "Alisher Rustamov", date: "Bugun, 14:20", points: "+25 ball" },
    { name: "Madina Qodirova", date: "Kecha, 18:45", points: "+25 ball" },
    { name: "Javohir Ergashev", date: "2 kun oldin", points: "+25 ball" }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Referral Hero Card - Deep Blue */}
      <div className="bg-gradient-to-br from-[#0a183d] via-[#0d2050] to-[#071330] border border-blue-600/30 rounded-2xl p-4 relative overflow-hidden shadow-[0_4px_25px_rgba(3,7,18,0.5)]">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-sky-400 flex items-center justify-center border border-blue-500/30">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 block">
                Bonus Dasturi
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">Do'stlaringizni taklif qiling</h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed mt-1">
            Har bir taklif qilingan maktab faoli uchun sizga <strong className="text-amber-300 font-bold">+25 ball</strong> va do'stingizga <strong className="text-sky-300 font-bold">+10 ball</strong> beriladi!
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-blue-800/40">
            <div className="bg-[#070e22]/70 rounded-xl p-2.5 text-center border border-blue-900/50 shadow-xs">
              <span className="text-xs text-blue-200/70 block">Taklif qilinganlar</span>
              <span className="text-base sm:text-lg font-bold text-white mt-0.5 block">{referralCount} nafar</span>
            </div>
            <div className="bg-[#070e22]/70 rounded-xl p-2.5 text-center border border-blue-900/50 shadow-xs">
              <span className="text-xs text-blue-200/70 block">Ishlangan ball</span>
              <span className="text-base sm:text-lg font-bold text-amber-400 mt-0.5 block">{referralCount * 25} ball</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link Box & Actions */}
      <div className="bg-[#0b1739] border border-[#182d5e] rounded-2xl p-4 space-y-3 shadow-[0_4px_20px_rgba(3,7,18,0.4)]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            Sizning shaxsiy referal havolangiz
          </h3>
          <button
            onClick={() => setIsEditingBot(!isEditingBot)}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            {isEditingBot ? 'Yopish' : "Botni o'zgartirish"}
          </button>
        </div>

        {/* Link format toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-[#070e22] rounded-xl border border-blue-900/60">
          <button
            type="button"
            onClick={() => setLinkType('startapp')}
            className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-all ${
              linkType === 'startapp'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-200/70 hover:text-white'
            }`}
          >
            ⚡ Mini App havola (To'g'ridan-to'g'ri ochadi)
          </button>
          <button
            type="button"
            onClick={() => setLinkType('start')}
            className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-all ${
              linkType === 'start'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-200/70 hover:text-white'
            }`}
          >
            🤖 Bot chat havola (/start)
          </button>
        </div>

        {/* Connected Mini App status badge */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-950/60 border border-blue-600/30 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <div className="truncate">
              <span className="text-blue-300 block text-[11px]">Telegram Web App manzili:</span>
              <span className="font-semibold text-white truncate block">t.me/{botUsername}/{appShortName}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenTelegramApp}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ochish</span>
          </button>
        </div>

        {/* Optional Bot Username Configurator & BotFather Guide */}
        {isEditingBot && (
          <div className="p-3.5 rounded-xl bg-[#070e22] border border-blue-600/40 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-blue-200/90 font-medium block mb-1">
                  Telegram Bot Username:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-xs font-medium">@</span>
                  <input
                    type="text"
                    value={tempBotName}
                    onChange={(e) => setTempBotName(e.target.value)}
                    placeholder="FaolMaktab_uzbot"
                    className="w-full bg-[#0a1535] border border-blue-700/50 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-blue-200/90 font-medium block mb-1">
                  Web App Short Name:
                </label>
                <input
                  type="text"
                  value={tempShortName}
                  onChange={(e) => setTempShortName(e.target.value)}
                  placeholder="FaolMaktabUz"
                  className="w-full bg-[#0a1535] border border-blue-700/50 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveBotName}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
              >
                Saqlash
              </button>
            </div>

            {/* App URL for BotFather */}
            <div className="p-2.5 rounded-lg bg-[#0a1738] border border-blue-800/60 space-y-1.5">
              <span className="text-[11px] text-sky-300 font-semibold uppercase tracking-wider block">
                📋 Web App URL manzili:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentAppUrl}
                  className="w-full bg-[#060e22] border border-blue-900/80 rounded px-2 py-1 text-xs text-blue-200 select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyAppUrl}
                  className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-medium shrink-0 flex items-center gap-1"
                >
                  {copiedAppUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAppUrl ? 'Olindi' : 'Nusxa'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 bg-[#070e22] border border-[#192f63] rounded-xl p-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full bg-transparent text-xs sm:text-sm text-blue-100 outline-none select-all truncate px-1"
          />
          <button
            onClick={handleCopyLink}
            className={`py-2 px-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 shrink-0 transition-colors ${
              copied
                ? 'bg-blue-600 text-white'
                : 'bg-[#0f214e] border border-blue-700/50 text-blue-100 hover:bg-[#152c66]'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Nusxalandi' : 'Nusxa'}</span>
          </button>
        </div>

        {/* Telegram Share Button */}
        <button
          onClick={handleShareTelegram}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Telegram orqali do'stlarga yuborish</span>
        </button>

        {/* Demo Invite button */}
        <button
          onClick={() => {
            triggerHaptic('success');
            onAddReferralDemo();
            confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
          }}
          className="w-full py-2 rounded-xl bg-[#0e1d44] hover:bg-[#122557] text-sky-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-blue-800/60"
        >
          <UserPlus className="w-3.5 h-3.5 text-sky-400" />
          <span>Do'st taklifini sinab ko'rish (+25 ball)</span>
        </button>
      </div>

      {/* Oddiy Tushuntirish: Referal nima va u qanday ishlaydi? */}
      <div className="bg-[#0b1739] border border-[#182d5e] rounded-2xl p-4 space-y-3 shadow-[0_4px_20px_rgba(3,7,18,0.4)]">
        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
          <span>💡</span>
          <span>Referal o'zi nima va u qanday ishlaydi?</span>
        </h3>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-3 rounded-xl bg-[#070e22] border border-[#172b5a] space-y-1">
            <h4 className="font-semibold text-sky-300">1. Har bir odamning o'z maxsus havolasi bo'ladi</h4>
            <p className="text-blue-100/80 leading-relaxed">
              Telegramda har bir kishining o'z <strong>ID raqami</strong> bor. Yuqoridagi havolaning oxirida <code className="bg-[#0e1d44] px-1.5 py-0.5 rounded text-sky-200">ref_{userId}</code> kodi qo'shilgan. Bu xuddi: <em>"Bu mehmon mening taklifim bilan keldi"</em> degan shaxsiy tamg'a.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#070e22] border border-[#172b5a] space-y-1">
            <h4 className="font-semibold text-emerald-300">2. Do'stingiz havolani bosganda nima bo'ladi?</h4>
            <p className="text-blue-100/80 leading-relaxed">
              Do'stingiz ushbu havolani bosishi bilanoq Telegram avtomatik tarzda botga: <em>"Uni {userId} taklif qildi"</em> deb bildiradi.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#070e22] border border-[#172b5a] space-y-1">
            <h4 className="font-semibold text-amber-300">3. Ikkala tomonga ham mukofot beriladi</h4>
            <p className="text-blue-100/80 leading-relaxed">
              • <strong>Sizga:</strong> Har bir do'stingiz uchun <strong>+25 ball</strong>;<br />
              • <strong>Do'stingizga:</strong> Birinchi kirgani uchun <strong>+10 bonus ball</strong>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#070e22] border border-[#172b5a] space-y-1">
            <h4 className="font-semibold text-purple-300">4. Nega bu juda foydali?</h4>
            <p className="text-blue-100/80 leading-relaxed">
              Siz bir so'm ham reklama sarflamaysiz! O'quvchilar va maktab faollari sovg'alar (noutbuk, ryukzak, aqlli soat) olish uchun o'z sinfdoshlarini chaqirishadi va ilovangiz o'z-o'zidan mashhur bo'lib ketadi.
            </p>
          </div>
        </div>
      </div>

      {/* Taklif qilingan do'stlar ro'yxati */}
      <div className="bg-[#0b1739] border border-[#182d5e] rounded-2xl p-4 space-y-2.5 shadow-[0_4px_20px_rgba(3,7,18,0.4)]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            Oxirgi takliflar
          </h3>
          <span className="text-xs text-blue-200/70">{referralCount} ta a'zo</span>
        </div>

        <div className="space-y-1.5">
          {sampleFriends.slice(0, Math.max(1, referralCount)).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#070e22]/80 border border-[#172b5a] text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 text-sky-300 flex items-center justify-center text-xs font-semibold border border-blue-500/40">
                  {item.name[0]}
                </div>
                <div>
                  <span className="font-medium text-white block">{item.name}</span>
                  <span className="text-xs text-blue-200/60">{item.date}</span>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-sky-400">{item.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
