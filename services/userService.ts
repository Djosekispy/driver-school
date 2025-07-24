import { db } from '@/firebase/firebase';
import { User } from '@/types/User';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  Timestamp,
  query,
  where,
} from 'firebase/firestore';

const COLLECTION = 'users';

export const fetchUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
    } as User;
  });
};

export const createUser = async (data: Omit<User, 'id' | 'createdAt'>) => {
  await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
  });
};

export const updateUser = async (id: string, data: Partial<User>) => {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...data,
  });
};

export const deleteUser = async (id: string) => {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
};

export const getUserById = async (id: string): Promise<User | null> => {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  } as User;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const q = query(collection(db, COLLECTION), where('email', '==', email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  } as User;
};
