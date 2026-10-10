export interface School {
  id: string;
  rank: number;
  name: string;
  region: string;
  district: string;
  category: 'Prezident' | 'Ixtisoslashtirilgan' | 'IDUM' | 'Umumta\'lim';
  overallScore: number;
  academicScore: number;
  olympiadScore: number;
  teacherScore: number;
  activismScore: number;
  infrastructureScore: number;
  studentsCount: number;
  teachersCount: number;
  graduatesCount: number;
  universityAdmissionRate: number;
  directorName: string;
  leaderName: string;
  motto: string;
  description: string;
  phone: string;
  telegram: string;
  address: string;
  updatedAt?: string;
}

export type TabType = 'asosiy' | 'referal' | 'reyting' | 'maktab_qoshish' | 'sovgalar';

export interface UserProfile {
  name: string;
  username: string;
  telegramId: string;
  points: number;
  mySchoolId?: string;
  role: string;
  invitedCount: number;
}
