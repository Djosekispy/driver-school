// types/admin.ts
export interface Test {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  order: number;
  passingScore: number;
  questions: Question[];
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
}

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  points: number;
}

export interface TestCategory {
  id: string;
  name: string;
}