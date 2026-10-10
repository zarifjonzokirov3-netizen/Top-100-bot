import {
  collection,
  doc,
  getDocs,
  getDocFromServer,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { School } from '../types/school';
import { INITIAL_SCHOOLS } from '../data/initialSchools';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

const LOCAL_STORAGE_KEY = 'maktablar_reytingi_top100_cache';

export function getLocalSchools(): School[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Local storage read error:', e);
  }
  return INITIAL_SCHOOLS;
}

export function saveLocalSchools(schools: School[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(schools));
  } catch (e) {
    console.warn('Local storage save error:', e);
  }
}

// Recalculate ranks 1 to N based on overallScore descending
export function recalculateRanks(schoolsList: School[]): School[] {
  const sorted = [...schoolsList].sort((a, b) => b.overallScore - a.overallScore);
  return sorted.map((s, index) => ({
    ...s,
    rank: index + 1
  }));
}

// Fetch all schools from Firestore or local fallback
export async function fetchAllSchools(): Promise<School[]> {
  const pathForGetDocs = 'schools';
  try {
    const querySnapshot = await getDocs(collection(db, pathForGetDocs));
    if (!querySnapshot.empty) {
      const docsData: School[] = [];
      querySnapshot.forEach(docSnap => {
        docsData.push({ id: docSnap.id, ...docSnap.data() } as School);
      });
      const ranked = recalculateRanks(docsData);
      saveLocalSchools(ranked);
      return ranked;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, pathForGetDocs);
  }

  // If Firestore is empty or not populated yet, initialize from local or seed
  const fallback = getLocalSchools();
  // Attempt background sync to Firestore so data persists in cloud
  seedSchoolsToFirestore(fallback).catch(() => {});
  return fallback;
}

// Seed or batch save schools to Firestore
export async function seedSchoolsToFirestore(schools: School[]): Promise<boolean> {
  try {
    // Firestore batch limit is 500 operations
    const batch = writeBatch(db);
    // Write the top 50 in first batch to seed quickly
    const toSeed = schools.slice(0, 50);
    toSeed.forEach(school => {
      const ref = doc(db, 'schools', school.id);
      batch.set(ref, school);
    });
    await batch.commit();
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'schools');
    return false;
  }
}

// Save or update a single school in Firestore and local storage
export async function updateSchoolData(updatedSchool: School, currentList: School[]): Promise<School[]> {
  // Update local list and recalculate ranks
  const updatedList = currentList.map(s => (s.id === updatedSchool.id ? { ...updatedSchool, updatedAt: new Date().toISOString() } : s));
  const reRanked = recalculateRanks(updatedList);
  saveLocalSchools(reRanked);

  const targetDoc = reRanked.find(s => s.id === updatedSchool.id) || updatedSchool;
  const pathForWrite = `schools/${targetDoc.id}`;

  try {
    await setDoc(doc(db, 'schools', targetDoc.id), targetDoc, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, pathForWrite);
  }

  return reRanked;
}

// Reset data to default Top 100
export async function resetToDefaultSchools(): Promise<School[]> {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  const reRanked = recalculateRanks(INITIAL_SCHOOLS);
  saveLocalSchools(reRanked);
  seedSchoolsToFirestore(reRanked).catch(() => {});
  return reRanked;
}
