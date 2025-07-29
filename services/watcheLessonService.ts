import { db } from '@/firebase/firebase';
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
import { createLog } from './logService';
import { WatchedLesson } from '@/types/WatchedLessons';
import { VideoLesson, VideoLessonCategory } from '@/types/VideoLesson';

const COLLECTION = 'watchedLessons';

export const fetchWatchedLessons = async (): Promise<WatchedLesson[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      watchedAt: data.watchedAt?.toDate?.() ?? new Date(),
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as WatchedLesson;
  });
};

export const fetchWatchedLessonsByUser = async (email: string): Promise<WatchedLesson[]> => {
  const q = query(collection(db, COLLECTION), where('email', '==', email));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      watchedAt: data.watchedAt?.toDate?.() ?? new Date(),
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as WatchedLesson;
  });
};

export const createWatchedLesson = async (data: Omit<WatchedLesson, 'id' | 'createdAt' | 'updatedAt'>) => {
  await addDoc(collection(db, COLLECTION), {
    ...data,
    watchedAt: data.watchedAt ?? Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  await createLog({
    createdBy: data.userId,
    title: 'Aula assistida registrada',
    discription: `Aula ${data.videoLessonId} marcada como assistida`,
    type: 'video'
  });
};

export const updateWatchedLesson = async (id: string, data: Partial<WatchedLesson>) => {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });
  
  await createLog({
    createdBy: 'system',
    title: `Registro de aula assistida atualizado`,
    discription: `ID: ${id}`,
    type: 'video'
  });
};

export const deleteWatchedLesson = async (id: string, userId: string) => {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
  await createLog({
    createdBy: userId,
    title: `Registro de aula assistida removido`,
    discription: `ID: ${id}`,
    type: 'video'
  });
};

export const getWatchedLesson = async (id: string): Promise<WatchedLesson | null> => {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    watchedAt: data.watchedAt?.toDate?.() ?? new Date(),
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as WatchedLesson;
};

export const getWatchedLessonByUserAndVideo = async (email: string, videoLessonId: string): Promise<WatchedLesson | null> => {
  const q = query(
    collection(db, COLLECTION),
    where('email', '==', email),
    where('videoLessonId', '==', videoLessonId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    watchedAt: data.watchedAt?.toDate?.() ?? new Date(),
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as WatchedLesson;
};

export const fetchUnwatchedLessonsByCategory = async (
  email: string,
  category: VideoLessonCategory
): Promise<VideoLesson[]> => {
  // Primeiro buscamos todas as aulas da categoria
  const videoLessonsQuery = query(
    collection(db, 'videoLessons'),
    where('category', '==', category)
  );
  const videoLessonsSnapshot = await getDocs(videoLessonsQuery);
  
  // Depois buscamos todas as aulas assistidas pelo usuário
  const watchedLessonsQuery = query(
    collection(db, COLLECTION),
    where('email', '==', email)
  );
  const watchedLessonsSnapshot = await getDocs(watchedLessonsQuery);

  // Criamos um Set com os IDs das aulas já assistidas
  const watchedLessonIds = new Set(
    watchedLessonsSnapshot.docs.map(doc => doc.data().videoLessonId)
  );

  // Filtramos as aulas da categoria, removendo as já assistidas
  return videoLessonsSnapshot.docs
    .filter(doc => !watchedLessonIds.has(doc.id))
    .map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
      } as VideoLesson;
    });
};