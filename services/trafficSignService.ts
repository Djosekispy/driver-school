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
import { createLog } from './logService';

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
   await createLog({createdBy : '001', title : `Sinal adicionada`, discription : data.category, type:'signal'});
};

export const updateTrafficSign = async (
  id: string,
  data: Partial<Omit<TrafficSign, 'id'>>
) => {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, data);
  await createLog({createdBy : '001', title : `Sinal ${id} actualizado`, discription : String(data.category), type:'signal'});
};

export const deleteTrafficSign = async (id: string) => {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
   await createLog({createdBy : '001', title : `Sinal  deletado`, discription : `O sinal ${id} foi apagado`, type:'signal'});
};

export const getTrafficSignById = async (
  id: string
): Promise<TrafficSign | null> => {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as TrafficSign;
};
