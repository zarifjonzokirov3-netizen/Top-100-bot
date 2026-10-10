/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { School, TabType } from './types/school';
import { fetchAllSchools, updateSchoolData, getLocalSchools } from './services/schoolService';
import { initTelegramWebApp, getTelegramStartParam, getTelegramWebApp } from './utils/telegram';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AsosiySection } from './components/AsosiySection';
import { ReferalSection } from './components/ReferalSection';
import { ReytingSection } from './components/ReytingSection';
import { MaktabRoyxatdanOtishSection } from './components/MaktabRoyxatdanOtishSection';
import { SovgalarSection } from './components/SovgalarSection';
import { SchoolDetailModal } from './components/SchoolDetailModal';

const USER_POINTS_KEY = 'maktab_app_user_points';
const REFERRALS_COUNT_KEY = 'maktab_app_referrals_count';

export default function App() {
  const [schools, setSchools] = useState<School[]>(() => getLocalSchools());
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('asosiy');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // User stats & profile
  const [userPoints, setUserPoints] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(USER_POINTS_KEY);
      return stored ? parseInt(stored, 10) : 50; // Boshlang'ich 50 ball
    } catch {
      return 50;
    }
  });

  const [referralCount, setReferralCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(REFERRALS_COUNT_KEY);
      return stored ? parseInt(stored, 10) : 1;
    } catch {
      return 1;
    }
  });

  useEffect(() => {
    initTelegramWebApp();

    // Check for incoming referral start parameter
    const startParam = getTelegramStartParam();
    if (startParam) {
      const processedRef = localStorage.getItem('maktab_processed_start_param');
      if (!processedRef) {
        localStorage.setItem('maktab_processed_start_param', startParam);
        setUserPoints((prev) => {
          const updated = prev + 10;
          try {
            localStorage.setItem(USER_POINTS_KEY, updated.toString());
          } catch {}
          return updated;
        });
        const tg = getTelegramWebApp();
        const welcomeMsg = "🎉 Xush kelibsiz!\n\nDo'stingizning taklif havolasi orqali kirdingiz va sizga +10 bonus ball taqdim etildi!";
        if (tg?.showAlert) {
          tg.showAlert(welcomeMsg);
        }
      }
    }

    async function syncData() {
      try {
        const data = await fetchAllSchools();
        if (data && data.length > 0) {
          setSchools(data);
        }
      } catch (err) {
        console.warn('Background sync failed:', err);
      }
    }
    syncData();
  }, []);

  const handleAddReferralDemo = () => {
    const newCount = referralCount + 1;
    const newPoints = userPoints + 25;
    setReferralCount(newCount);
    setUserPoints(newPoints);
    try {
      localStorage.setItem(REFERRALS_COUNT_KEY, newCount.toString());
      localStorage.setItem(USER_POINTS_KEY, newPoints.toString());
    } catch {}
  };

  const handleAddSchool = async (newSchool: School) => {
    // Add to list and recalculate rankings, persist to Firestore
    const updatedList = await updateSchoolData(newSchool, schools);
    setSchools(updatedList);
    // Award 50 bonus points
    const newPoints = userPoints + 50;
    setUserPoints(newPoints);
    try {
      localStorage.setItem(USER_POINTS_KEY, newPoints.toString());
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#070e22] text-blue-50 flex flex-col font-sans pb-20 selection:bg-blue-600 selection:text-white">
      {/* Yuqori panel */}
      <Navbar />

      {/* Asosiy kontent maydoni */}
      <main className="max-w-2xl mx-auto w-full px-4 py-4 flex-1">
        {activeTab === 'asosiy' && (
          <AsosiySection
            schools={schools}
            onSelectSchool={(s) => setSelectedSchool(s)}
            onChangeTab={(tab) => setActiveTab(tab)}
            userPoints={userPoints}
            referralCount={referralCount}
          />
        )}

        {activeTab === 'referal' && (
          <ReferalSection
            userPoints={userPoints}
            referralCount={referralCount}
            onAddReferralDemo={handleAddReferralDemo}
          />
        )}

        {activeTab === 'reyting' && (
          <ReytingSection
            schools={schools}
            isLoading={isLoading}
            onSelectSchool={(s) => setSelectedSchool(s)}
          />
        )}

        {activeTab === 'maktab_qoshish' && (
          <MaktabRoyxatdanOtishSection
            onAddSchool={handleAddSchool}
            onChangeTab={(tab) => setActiveTab(tab)}
            onSelectSchool={(s) => setSelectedSchool(s)}
          />
        )}

        {activeTab === 'sovgalar' && (
          <SovgalarSection
            userPoints={userPoints}
            onChangeTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Telegram pastki navigatsiya paneli (Asosiy, Referal, Reyting, Maktab qo'shish, Sovg'alar) */}
      <BottomNav activeTab={activeTab} onChangeTab={(tab) => setActiveTab(tab)} />

      {/* Maktab haqida batafsil ma'lumot modali */}
      <SchoolDetailModal
        school={selectedSchool}
        onClose={() => setSelectedSchool(null)}
      />
    </div>
  );
}
