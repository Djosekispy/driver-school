export interface QuizResult {
  id: string;
  userId: string;
  quizDate: Date;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  quizTestId: string;
  wrongAnswers: number;
  answers: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
}
