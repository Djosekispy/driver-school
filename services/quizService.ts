import { db } from '@/firebase/firebase';
import { QuizQuestion } from '@/types/QuizQuestion';
import { QuizResult } from '@/types/QuizResult';
import { QuizTest } from '@/types/TestQuiz';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';

const testCollection = 'quizTests';
const questionCollection = 'quizQuestions';
const resultCollection = 'quizResults';

// Quiz Test
export const fetchQuizTests = async (): Promise<QuizTest[]> => {
  const snapshot = await getDocs(collection(db, testCollection));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuizTest[];
};

export const createQuizTest = async (data: Omit<QuizTest, 'id'>) => {
  await addDoc(collection(db, testCollection), data);
};

export const updateQuizTest = async (
  id: string,
  data: Partial<Omit<QuizTest, 'id'>>
) => {
  await updateDoc(doc(db, testCollection, id), data);
};

export const deleteQuizTest = async (id: string) => {
  await deleteDoc(doc(db, testCollection, id));
};

// Quiz Question
export const fetchQuizQuestionsByTest = async (quizTestId: number): Promise<QuizQuestion[]> => {
  const q = query(collection(db, questionCollection), where('quizTestId', '==', quizTestId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuizQuestion[];
};

export const createQuizQuestion = async (data: Omit<QuizQuestion, 'id'>) => {
  await addDoc(collection(db, questionCollection), data);
};

export const updateQuizQuestion = async (
  id: string,
  data: Partial<Omit<QuizQuestion, 'id'>>
) => {
  await updateDoc(doc(db, questionCollection, id), data);
};

export const deleteQuizQuestion = async (id: string) => {
  await deleteDoc(doc(db, questionCollection, id));
};

// Quiz Result
export const fetchResultsByUser = async (userId: string): Promise<QuizResult[]> => {
  const q = query(collection(db, resultCollection), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuizResult[];
};

export const submitQuizResult = async (data: Omit<QuizResult, 'id'>) => {
  await addDoc(collection(db, resultCollection), {
    ...data,
    quizDate: new Date(data.quizDate),
  });
};
