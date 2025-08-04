import { MaterialCommunityIcons } from "@expo/vector-icons";
import { VideoLessonCategory } from "./VideoLesson";

export type UserRole = 'admin' | 'normal';

export interface User {
  id : string;
  name: string;
  email: string;
  password: string;
  phone ? : string,
  address ? : string,
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date;
}

export interface CategoryProgress {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  completedLessons: number;
  totalLessons: number;
}

export const categoryIcons: Record<VideoLessonCategory, string> = {
  'teórica': 'book-education',
  'prática': 'car',
  'legislação': 'scale-balance'
};

export const categoryTitles: Record<VideoLessonCategory, string> = {
  'teórica': 'Teórica',
  'prática': 'Prática',
  'legislação': 'Legislação'
};
