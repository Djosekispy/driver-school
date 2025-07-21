export type Question = {
  id: string;
  question: string;
  image?: string;
  options: string[];
  correctAnswer: number; // Índice da opção correta
  category: string;
  points: number;
  timeLimit?: number; // Em segundos (opcional)
};

export type TestConfig = {
  title: string;
  description: string;
  totalQuestions: number;
  categories: string[];
  isTimed: boolean;
  totalTime?: number; // Tempo total em segundos (se isTimed = true)
};

export type TestResult = {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // Em segundos
  passed: boolean;
};