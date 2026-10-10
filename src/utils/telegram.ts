// Telegram Web App API helper utilities

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          query_id?: string;
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
          };
          start_param?: string;
          auth_date?: number;
          hash?: string;
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          secondary_bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          header_bg_color?: string;
          accent_text_color?: string;
          section_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor?: string;
        backgroundColor?: string;
        BackButton: {
          isVisible: boolean;
          onClick(cb: () => void): void;
          offClick(cb: () => void): void;
          show(): void;
          hide(): void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText(text: string): void;
          onClick(cb: () => void): void;
          offClick(cb: () => void): void;
          show(): void;
          hide(): void;
          enable(): void;
          disable(): void;
        };
        HapticFeedback: {
          impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
          notificationOccurred(type: 'error' | 'success' | 'warning'): void;
          selectionChanged(): void;
        };
        ready(): void;
        expand(): void;
        close(): void;
        openLink(url: string, options?: { try_instant_view?: boolean }): void;
        openTelegramLink(url: string): void;
        showAlert(message: string, callback?: () => void): void;
        showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
      };
    };
  }
}

export function isTelegramWebApp(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp?.initData;
}

export function getTelegramWebApp() {
  if (typeof window !== 'undefined') {
    return window.Telegram?.WebApp;
  }
  return undefined;
}

export function initTelegramWebApp(): void {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      if (tg.themeParams?.bg_color) {
        document.documentElement.style.setProperty('--tg-bg-color', tg.themeParams.bg_color);
      }
      if (tg.themeParams?.text_color) {
        document.documentElement.style.setProperty('--tg-text-color', tg.themeParams.text_color);
      }
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e);
    }
  }
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'selection' = 'light') {
  const tg = getTelegramWebApp();
  if (!tg?.HapticFeedback) return;
  try {
    if (type === 'success' || type === 'warning') {
      tg.HapticFeedback.notificationOccurred(type);
    } else if (type === 'selection') {
      tg.HapticFeedback.selectionChanged();
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  } catch (err) {
    // silently ignore if not supported
  }
}

export function getTelegramUser() {
  const tg = getTelegramWebApp();
  return tg?.initDataUnsafe?.user || null;
}

export function getTelegramStartParam(): string | null {
  const tg = getTelegramWebApp();
  if (tg?.initDataUnsafe?.start_param) {
    return tg.initDataUnsafe.start_param;
  }
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('tgWebAppStartParam') || urlParams.get('start_param') || urlParams.get('startapp') || urlParams.get('ref') || urlParams.get('start');
    if (searchParam) return searchParam;

    // Telegram also passes parameters in window.location.hash (e.g. #tgWebAppData=...&tgWebAppStartParam=...)
    if (window.location.hash) {
      const hashString = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
      const hashParams = new URLSearchParams(hashString);
      const hashStartParam = hashParams.get('tgWebAppStartParam') || hashParams.get('start_param') || hashParams.get('startapp') || hashParams.get('ref');
      if (hashStartParam) return hashStartParam;
    }
  }
  return null;
}

export function shareSchoolToTelegram(schoolName: string, rank: number, score: number, region: string) {
  triggerHaptic('medium');
  const text = encodeURIComponent(
    `🏫 ${schoolName}\n🏆 O'zbekiston Top 100 maktablar reytingida ${rank}-o'rinda!\n⭐ Umumiy reyting bali: ${score} ball\n📍 Hudud: ${region}\n\n📲 Maktab faollari va reytingini kuzatib boring:`
  );
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`;
  
  const tg = getTelegramWebApp();
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, '_blank');
  }
}
