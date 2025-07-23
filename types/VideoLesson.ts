export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationInMinutes?: number;
  category: 'teórica' | 'prática' | 'legislação';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; 
}
