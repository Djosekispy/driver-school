export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number; 
  explanation?: string; 
  category?: string; 
  quizTestId : number
}
