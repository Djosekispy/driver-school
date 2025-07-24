export type VideoLessonCategory = 'teórica' | 'prática' | 'legislação';

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationInMinutes?: number;
  category: VideoLessonCategory,
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; 
}
