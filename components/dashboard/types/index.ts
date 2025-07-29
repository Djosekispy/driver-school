import { MaterialCommunityIcons } from "@expo/vector-icons";

// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  licenseType: 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';
  joinedAt: Date;
}

// types/progress.ts
export interface Progress {
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  nextLesson: string;
  lastAccessed: Date;
}

// types/test.ts
export interface TestResult {
  id: string;
  date: Date;
  score: number;
  passed: boolean;
  testType: 'Simulado' | 'Oficial';
  totalQuestions: number;
  correctAnswers: number;
}

// types/theme.ts
export interface Theme {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  totalLessons: number;
  completedLessons: number;
  category: 'Legislação' | 'Direção' | 'Primeiros Socorros' | 'Mecânica Básica' | 'Sinalização';
}

// types/daily-tip.ts
export interface DailyTip {
  id: string;
  title: string;
  content: string;
  date: Date;
  category: string;
}

// types/video.ts
export interface FeaturedVideo {
  videoUrl: string;
  thumbnail: string;
  title: string;
  duration: number;
  views: string;
  instructor: string;
}