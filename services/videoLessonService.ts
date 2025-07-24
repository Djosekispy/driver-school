import { db } from '@/firebase/firebase';
import { VideoLesson } from '@/types/VideoLesson';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';

const COLLECTION = 'videoLessons';

export const fetchVideoLessons = async (): Promise<VideoLesson[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as VideoLesson;
  });
};

export const createVideoLesson = async (data: Omit<VideoLesson, 'id' | 'createdAt' | 'updatedAt'>) => {
  await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const updateVideoLesson = async (id: string, data: Partial<VideoLesson>) => {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteVideoLesson = async (id: string) => {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
};

export const getVideoLesson = async (id: string): Promise<VideoLesson | null> => {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as VideoLesson;
};
