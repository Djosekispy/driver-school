import { Feather } from "@expo/vector-icons";


interface AdminItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AdminUser extends AdminItem {
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'instructor' | 'admin';
  licenseType?: string[];
  lastAccess?: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  categoryId: string;
}

export interface AdminTest extends AdminItem {
  title: string;
  description: string;
  categoryId: string;
  questionsCount: number;
  timeLimit?: number;
  passingScore: number; 
  difficulty: 'easy' | 'medium' | 'hard';
  attempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

export interface TrafficSign extends AdminItem {
  name: string;
  image: string;
  categoryId: string;
  description: string;
  meaning: string;
  rules: string[];
  commonMistakes: string[];
}

export interface VideoLesson extends AdminItem {
  title: string;
  url: string;
  thumbnail: string;
  duration: number; 
  views: number;
  instructorId: string;
  categoryId: string;
  description: string;
  transcript?: string;
  resources?: string[];
}


export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Test {
  id?: string;
  title: string;
  description: string;
  categoryId: string;
  passingScore: number;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  questions?: Question[];
}

export interface AdminTestBuilderProps {
  test?: Test;
  categories: Category[];
  onSave: (test: Test) => void;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuestionEditorProps {
  visible: boolean;
  question: Question;
  categories: Category[];
  onSave: (question: Question) => void;
  onClose: () => void;
}

export interface ActivityItem {
  id: string;
  type: 'user' | 'test' | 'video' | 'sign';
  action: string;
  name: string;
  time: string;
}


