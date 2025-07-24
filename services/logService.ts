import { db } from '@/firebase/firebase';
import { Logs } from '@/types/logs';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

const logsCollection = collection(db, 'logs');

export const createLog = async (data: Omit<Logs, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  const now = new Date();
  await addDoc(logsCollection, {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
};

export const fetchLogs = async (): Promise<Logs[]> => {
  const snapshot = await getDocs(logsCollection);
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Logs, 'id'>),
  }));
};

export const updateLog = async (id: string, data: Partial<Omit<Logs, 'id' | 'createdAt'>>): Promise<void> => {
  const ref = doc(db, 'logs', id);
  await updateDoc(ref, {
    ...data,
    updatedAt: new Date(),
  });
};

export const deleteLog = async (id: string): Promise<void> => {
  const ref = doc(db, 'logs', id);
  await deleteDoc(ref);
};

export const getLogById = async (id: string): Promise<Logs | null> => {
  const ref = doc(db, 'logs', id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Logs, 'id'>),
  };
};
