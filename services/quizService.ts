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
import { createLog } from './logService';

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
  
     await createLog({createdBy : '001', title : `Novo Teste Adicionado`, discription : data.category , type:'test'});
};

export const updateQuizTest = async (
  id: string,
  data: Partial<Omit<QuizTest, 'id'>>
) => {
  await updateDoc(doc(db, testCollection, id), data);
  
     await createLog({createdBy : '001', title : `Teste ${id} actualizado`, discription : String(data.category) , type:'test'});
};

export const deleteQuizTest = async (id: string) => {
  await deleteDoc(doc(db, testCollection, id));
   await createLog({createdBy : '001', title : `Teste ${id} deletado`, discription : 'Seu Teste foi deletado com sucesso' , type:'test'});
};

// Quiz Question
export const fetchQuizQuestionsByTest = async (quizTestId: string): Promise<QuizQuestion[]> => {
  const q = query(collection(db, questionCollection), where('quizTestId', '==', quizTestId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuizQuestion[];
};

export const createQuizQuestion = async (data: Omit<QuizQuestion, 'id'>) => {
  await addDoc(collection(db, questionCollection), data);
   await createLog({createdBy : '001', title : `Nova questão adicionada`, discription : String(data.category) , type:'test'});
};

export const updateQuizQuestion = async (
  id: string,
  data: Partial<Omit<QuizQuestion, 'id'>>
) => {
  await updateDoc(doc(db, questionCollection, id), data);
  
   await createLog({createdBy : '001', title : `Questão ${id} actualizada`, discription : String(data.category) , type:'test'});
};

export const deleteQuizQuestion = async (id: string) => {
  await deleteDoc(doc(db, questionCollection, id));
  await createLog({createdBy : '001', title : `Questão ${id} deletada`, discription : 'Questão foi deletada com sucesso' , type:'test'});
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
