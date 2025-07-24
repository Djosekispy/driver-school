import { createQuizQuestion, createQuizTest, deleteQuizQuestion, deleteQuizTest, fetchQuizQuestionsByTest, fetchQuizTests, fetchResultsByUser, submitQuizResult, updateQuizQuestion, updateQuizTest } from '@/services/quizService';
import { fetchTrafficSigns } from '@/services/trafficSignService';
import { fetchUsers } from '@/services/userService';
import { fetchVideoLessons } from '@/services/videoLessonService';
import { QuizQuestion } from '@/types/QuizQuestion';
import { QuizResult } from '@/types/QuizResult';
import { QuizTest } from '@/types/TestQuiz';
import { TrafficSign } from '@/types/TrafficSign';
import { User } from '@/types/User';
import { VideoLesson } from '@/types/VideoLesson';
import React, { createContext, useContext, useEffect, useState } from 'react';


interface FirebaseContextType {
  videoLessons: VideoLesson[];
  trafficSigns: TrafficSign[];
  quizTests: QuizTest[];
  quizQuestions: QuizQuestion[];
  quizResults: QuizResult[];
  users: User[];

  loadInitialData: () => Promise<void>;
  loadQuizQuestionsByTestId: (quizTestId: number) => Promise<void>;
  loadUserResults: (userId: string) => Promise<void>;

  submitResult: (result: Omit<QuizResult, 'id'>) => Promise<void>;

  createTest: (data: Omit<QuizTest, 'id'>) => Promise<void>;
  updateTest: (id: string, data: Partial<Omit<QuizTest, 'id'>>) => Promise<void>;
  deleteTest: (id: string) => Promise<void>;

  createQuestion: (data: Omit<QuizQuestion, 'id'>) => Promise<void>;
  updateQuestion: (id: string, data: Partial<Omit<QuizQuestion, 'id'>>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videoLessons, setVideoLessons] = useState<VideoLesson[]>([]);
  const [trafficSigns, setTrafficSigns] = useState<TrafficSign[]>([]);
  const [quizTests, setQuizTests] = useState<QuizTest[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const loadInitialData = async () => {
    const [videos, signs, tests, userList] = await Promise.all([
      fetchVideoLessons(),
      fetchTrafficSigns(),
      fetchQuizTests(),
      fetchUsers()
    ]);

    setVideoLessons(videos);
    setTrafficSigns(signs);
    setQuizTests(tests);
    setUsers(userList);
  };

  const loadQuizQuestionsByTestId = async (quizTestId: number) => {
    const questions = await fetchQuizQuestionsByTest(quizTestId);
    setQuizQuestions(questions);
  };

  const loadUserResults = async (userId: string) => {
    const results = await fetchResultsByUser(userId);
    setQuizResults(results);
  };

  const submitResult = async (result: Omit<QuizResult, 'id'>) => {
    await submitQuizResult(result);
    await loadUserResults(result.userId);
  };

  const createTest = async (data: Omit<QuizTest, 'id'>) => {
    await createQuizTest(data);
    await loadInitialData();
  };

  const updateTest = async (id: string, data: Partial<Omit<QuizTest, 'id'>>) => {
    await updateQuizTest(id, data);
    await loadInitialData();
  };

  const deleteTest = async (id: string) => {
    await deleteQuizTest(id);
    await loadInitialData();
  };

  const createQuestion = async (data: Omit<QuizQuestion, 'id'>) => {
    await createQuizQuestion(data);
  };

  const updateQuestion = async (id: string, data: Partial<Omit<QuizQuestion, 'id'>>) => {
    await updateQuizQuestion(id, data);
  };

  const deleteQuestion = async (id: string) => {
    await deleteQuizQuestion(id);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        videoLessons,
        trafficSigns,
        quizTests,
        quizQuestions,
        quizResults,
        users,
        loadInitialData,
        loadQuizQuestionsByTestId,
        loadUserResults,
        submitResult,
        createTest,
        updateTest,
        deleteTest,
        createQuestion,
        updateQuestion,
        deleteQuestion,
      }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return context;
};
