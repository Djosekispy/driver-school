// Tipos para os dados do usuário
export type UserData = {
  id: string;
  name: string;
  avatar: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  progress: number;
  daysStreak: number;
};

// Tipos para estatísticas
export type StatsData = {
  testsCompleted: number;
  correctAnswers: number;
  bestScore: number;
  signsMastered: number;
};

// Tipos para testes recentes
export type RecentTest = {
  id: string;
  date: string;
  score: number;
  correct: number;
  total: number;
};

// Tipos para cards de ação
export type ActionCardProps = {
  title: string;
  icon: React.ReactNode;
  color: string;
  onPress?: () => void;
};