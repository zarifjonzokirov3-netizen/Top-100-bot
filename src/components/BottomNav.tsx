import React from 'react';
import { Home, Users, Trophy, PlusCircle, Gift } from 'lucide-react';
import { TabType } from '../types/school';
import { triggerHaptic } from '../utils/telegram';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'asosiy', label: 'Asosiy', icon: Home },
    { id: 'referal', label: 'Referal', icon: Users },
    { id: 'reyting', label: 'Reyting', icon: Trophy },
    { id: 'maktab_qoshish', label: "Maktab qo'shish", icon: PlusCircle },
    { id: 'sovgalar', label: "Sovg'alar", icon: Gift },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#070e22]/95 backdrop-blur-lg border-t border-[#182a57] px-2 py-2 telegram-safe-bottom shadow-[0_-4px_25px_rgba(3,7,18,0.5)]">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                onChangeTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-sky-400 font-semibold'
                  : 'text-blue-200/60 hover:text-blue-100 font-normal'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-blue-600/25 border border-blue-500/30' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-sky-400' : 'text-blue-300/60'}`} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-normal truncate w-full text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
