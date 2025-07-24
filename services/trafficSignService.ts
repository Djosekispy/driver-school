import { db } from '@/firebase/firebase';
import { TrafficSign } from '@/types/TrafficSign';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

const COLLECTION = 'trafficSigns';

export const fetchTrafficSigns = async (): Promise<TrafficSign[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as TrafficSign[];
};

export const createTrafficSign = async (data: Omit<TrafficSign, 'id'>) => {
  await addDoc(collection(db, COLLECTION), data);
};

export const updateTrafficSign = async (
  id: string,
  data: Partial<Omit<TrafficSign, 'id'>>
) => {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, data);
};

export const deleteTrafficSign = async (id: string) => {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
};

export const getTrafficSignById = async (
  id: string
): Promise<TrafficSign | null> => {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as TrafficSign;
};
