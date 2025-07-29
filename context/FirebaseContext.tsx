import { fetchLogs } from '@/services/logService';
import { createQuizQuestion, createQuizTest, deleteQuizQuestion, deleteQuizTest, fetchQuizQuestionsByTest, fetchQuizTests, fetchResultsByUser, submitQuizResult, updateQuizQuestion, updateQuizTest } from '@/services/quizService';
import { createTrafficSign, deleteTrafficSign, fetchTrafficSigns, getTrafficSignById, updateTrafficSign } from '@/services/trafficSignService';
import { createUser, deleteUser, fetchUsers, findUserByEmail, getUserById, updateUser } from '@/services/userService';
import { createVideoLesson, deleteVideoLesson,fetchVideoLessonsByCategory, fetchVideoLessons, getVideoLesson, updateVideoLesson } from '@/services/videoLessonService';
import {
  createWatchedLesson,
  deleteWatchedLesson,
  fetchWatchedLessonsByUser,
  fetchUnwatchedLessonsByCategory,
  getWatchedLessonByUserAndVideo,
  updateWatchedLesson,
} from '@/services/watcheLessonService';
import { Logs } from '@/types/logs';
import { QuizQuestion } from '@/types/QuizQuestion';
import { QuizResult } from '@/types/QuizResult';
import { QuizTest } from '@/types/TestQuiz';
import { TrafficSign } from '@/types/TrafficSign';
import { User } from '@/types/User';
import { VideoLesson, VideoLessonCategory } from '@/types/VideoLesson';
import { WatchedLesson } from '@/types/WatchedLessons';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface FirebaseContextType {
  // Estado
  videoLessons: VideoLesson[];
  trafficSigns: TrafficSign[];
  quizTests: QuizTest[];
  quizQuestions: QuizQuestion[];
  quizResults: QuizResult[];
  users: User[];
 // Logs
 logs: Logs[];
loadLogs: () => Promise<void>;
createLog: (data: Omit<Logs, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
updateLog: (id: string, data: Partial<Omit<Logs, 'id' | 'createdAt'>>) => Promise<void>;
deleteLog: (id: string) => Promise<void>;
getLogById: (id: string) => Promise<Logs | null>;
 watchedLessons: WatchedLesson[];
  markLessonAsWatched: (data: Omit<WatchedLesson, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWatchedLesson: (id: string, data: Partial<WatchedLesson>) => Promise<void>;
  loadWatchedLessonsByUser: (userId: string) => Promise<void>;
  getUnwatchedLessonsByCategory: (userId: string, category: VideoLessonCategory) => Promise<VideoLesson[]>;
  getVideoLessonsByCategory: (category: VideoLessonCategory) => Promise<VideoLesson[]>;
  checkIfLessonWatched: (userId: string, videoLessonId: string) => Promise<WatchedLesson | null>;

  // Carregamento de dados
  loadInitialData: () => Promise<void>;
  loadQuizQuestionsByTestId: (quizTestId: string) => Promise<void>;
  loadUserResults: (userId: string) => Promise<void>;
  loadTrafficSigns: () => Promise<void>;
  loadVideoLessons: () => Promise<void>;
  loadUsers: () => Promise<void>;

  // Operações de quiz
  submitResult: (result: Omit<QuizResult, 'id'>) => Promise<void>;
  createTest: (data: Omit<QuizTest, 'id'>) => Promise<void>;
  updateTest: (id: string, data: Partial<Omit<QuizTest, 'id'>>) => Promise<void>;
  deleteTest: (id: string) => Promise<void>;
  createQuestion: (data: Omit<QuizQuestion, 'id'>) => Promise<void>;
  updateQuestion: (id: string, data: Partial<Omit<QuizQuestion, 'id'>>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;

  // Operações de placas de trânsito
  createSign: (data: Omit<TrafficSign, 'id'>) => Promise<void>;
  updateSign: (id: string, data: Partial<Omit<TrafficSign, 'id'>>) => Promise<void>;
  deleteSign: (id: string) => Promise<void>;
  getSignById: (id: string) => Promise<TrafficSign | null>;

  // Operações de usuário
  addUser: (data: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  modifyUser: (id: string, data: Partial<User>) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  getUser: (id: string) => Promise<User | null>;
  findUserByEmail: (email: string) => Promise<User | null>;

  // Operações de videoaulas
  addVideoLesson: (data: Omit<VideoLesson, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  modifyVideoLesson: (id: string, data: Partial<VideoLesson>) => Promise<void>;
  removeVideoLesson: (id: string) => Promise<void>;
  getVideoLessonById: (id: string) => Promise<VideoLesson | null>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados
  const [videoLessons, setVideoLessons] = useState<VideoLesson[]>([]);
  const [trafficSigns, setTrafficSigns] = useState<TrafficSign[]>([]);
  const [quizTests, setQuizTests] = useState<QuizTest[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<Logs[]>([]);
  const [watchedLessons, setWatchedLessons] = useState<WatchedLesson[]>([]);

  // Carregamento inicial de dados
  const loadInitialData = async () => {
    const [videos, signs, tests, userList, logs] = await Promise.all([
      fetchVideoLessons(),
      fetchTrafficSigns(),
      fetchQuizTests(),
      fetchUsers(),
      fetchLogs()
    ]);

    setVideoLessons(videos);
    setTrafficSigns(signs);
    setQuizTests(tests);
    setUsers(userList);
    setLogs(logs)
  };

  // Carregamentos individuais
  const loadTrafficSigns = async () => {
    const signs = await fetchTrafficSigns();
    setTrafficSigns(signs);
  };

  const loadVideoLessons = async () => {
    const videos = await fetchVideoLessons();
    setVideoLessons(videos);
  };

  const loadUsers = async () => {
    const userList = await fetchUsers();
    setUsers(userList);
  };

  const loadQuizQuestionsByTestId = async (quizTestId: string) => {
    const questions = await fetchQuizQuestionsByTest(quizTestId);
    setQuizQuestions(questions);
  };

  const loadUserResults = async (userId: string) => {
    const results = await fetchResultsByUser(userId);
    setQuizResults(results);
  };
const markLessonAsWatched = async (data: Omit<WatchedLesson, 'id' | 'createdAt' | 'updatedAt'>) => {
  await createWatchedLesson(data);
  await loadWatchedLessonsByUser(data.userId);
};

const updateWatchedLessonRecord = async (id: string, data: Partial<WatchedLesson>) => {
  await updateWatchedLesson(id, data);
  if (data.userId) {
    await loadWatchedLessonsByUser(data.userId);
  }
};


const loadWatchedLessonsByUser = async (userId: string) => {
  const watched = await fetchWatchedLessonsByUser(userId);
  setWatchedLessons(watched);
};

const getUnwatchedLessonsByCategory = async (userId: string, category: VideoLessonCategory) => {
  return await fetchUnwatchedLessonsByCategory(userId, category);
};

const getVideoLessonsByCategory = async (category: VideoLessonCategory) => {
  return await fetchVideoLessonsByCategory(category);
};

const checkIfLessonWatched = async (userId: string, videoLessonId: string) => {
  return await getWatchedLessonByUserAndVideo(userId, videoLessonId);
};
   // Logs
      const loadLogs = async () => {
      const logList = await fetchLogs();
      setLogs(logList);
    };

const createLog = async (data: Omit<Logs, 'id' | 'createdAt' | 'updatedAt'>) => {
  await createLog(data); // evitar nome duplicado
  await loadLogs();
};

const updateLog = async (id: string, data: Partial<Omit<Logs, 'id' | 'createdAt'>>) => {
  await updateLog(id, data);
  await loadLogs();
};

const deleteLog = async (id: string) => {
  await deleteLog(id);
  await loadLogs();
};

const getLogById = async (id: string): Promise<Logs | null> => {
  return await getLogById(id);
};

  // Operações de quiz
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

  // Operações de placas de trânsito
  const createSign = async (data: Omit<TrafficSign, 'id'>) => {
    await createTrafficSign(data);
    await loadTrafficSigns();
  };

  const updateSign = async (id: string, data: Partial<Omit<TrafficSign, 'id'>>) => {
    await updateTrafficSign(id, data);
    await loadTrafficSigns();
  };

  const deleteSign = async (id: string) => {
    await deleteTrafficSign(id);
    await loadTrafficSigns();
  };

  const getSignById = async (id: string): Promise<TrafficSign | null> => {
    return await getTrafficSignById(id);
  };

  // Operações de usuário
  const addUser = async (data: Omit<User, 'id' | 'createdAt'>) => {
    await createUser(data);
    await loadUsers();
  };

  const modifyUser = async (id: string, data: Partial<User>) => {
    await updateUser(id, data);
    await loadUsers();
  };

  const removeUser = async (id: string) => {
    await deleteUser(id);
    await loadUsers();
  };

  const getUser = async (id: string): Promise<User | null> => {
    return await getUserById(id);
  };

  // Operações de videoaulas
  const addVideoLesson = async (data: Omit<VideoLesson, 'id' | 'createdAt' | 'updatedAt'>) => {
    await createVideoLesson(data);
    await loadVideoLessons();
  };

  const modifyVideoLesson = async (id: string, data: Partial<VideoLesson>) => {
    await updateVideoLesson(id, data);
    await loadVideoLessons();
  };

  const removeVideoLesson = async (id: string) => {
    await deleteVideoLesson(id);
    await loadVideoLessons();
  };

  const getVideoLessonById = async (id: string): Promise<VideoLesson | null> => {
    return await getVideoLesson(id);
  };

  // Efeito inicial
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
        watchedLessons,
        logs,
        loadLogs,
        createLog,
        updateLog,
        deleteLog,
        getLogById,
        loadInitialData,
        loadQuizQuestionsByTestId,
        loadUserResults,
        loadTrafficSigns,
        loadVideoLessons,
        loadUsers,
        
        submitResult,
        createTest,
        updateTest,
        deleteTest,
        createQuestion,
        updateQuestion,
        deleteQuestion,
        
        createSign,
        updateSign,
        deleteSign,
        getSignById,
        
        addUser,
        modifyUser,
        removeUser,
        getUser,
        findUserByEmail,
        
        addVideoLesson,
        modifyVideoLesson,
        removeVideoLesson,
        getVideoLessonById,

         markLessonAsWatched,
      updateWatchedLesson: updateWatchedLessonRecord,
      loadWatchedLessonsByUser,
      getUnwatchedLessonsByCategory,
      getVideoLessonsByCategory,
      checkIfLessonWatched,
      }}
    >
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