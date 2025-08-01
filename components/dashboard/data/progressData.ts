import { fetchVideoLessons } from "@/services/videoLessonService";
import { fetchWatchedLessonsByUser } from "@/services/watcheLessonService";
import { VideoLesson, VideoLessonCategory } from "@/types/VideoLesson";
import { WatchedLesson } from "@/types/WatchedLessons";

export const getUserProgress = async (userId: string): Promise<Progress> => {
  // Busca todas as videoaulas e as assistidas pelo usuário em paralelo
  const [allLessons, watchedLessons] = await Promise.all([
    fetchVideoLessons(),
    fetchWatchedLessonsByUser(userId)
  ]);

  // Calcula métricas básicas
  const completedLessons = watchedLessons.length;
  const totalLessons = allLessons.length;
  const percentage = Math.round(( totalLessons / completedLessons) * 100);

  
  // Encontra a última aula assistida
  const lastWatchedLesson = watchedLessons.sort((a, b) => 
    new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
  )[0];

  // Encontra a próxima aula recomendada (primeira não assistida)
  const nextLesson = allLessons.find(lesson => 
    !watchedLessons.some(watched => watched.videoLessonId === lesson.id)
  )?.title || false;

  return {
    completedLessons,
    totalLessons,
    percentage,
    nextLesson,
    lastAccessed: lastWatchedLesson?.watchedAt || null,
    // Adicione estas linhas se quiser dados adicionais por categoria
    byCategory: {
      'teórica': calculateCategoryProgress('teórica', allLessons, watchedLessons),
      'prática': calculateCategoryProgress('prática', allLessons, watchedLessons),
      'legislação': calculateCategoryProgress('legislação', allLessons, watchedLessons),
    }
  };
};

// Função auxiliar para calcular progresso por categoria
const calculateCategoryProgress = (
  category: VideoLessonCategory,
  allLessons: VideoLesson[],
  watchedLessons: WatchedLesson[]
) => {
  const categoryLessons = allLessons.filter(lesson => lesson.category === category);
  const watchedCategoryLessons = watchedLessons.filter(watched => 
    categoryLessons.some(lesson => lesson.id === watched.videoLessonId)
  );

  return {
    completed: watchedCategoryLessons.length,
    total: categoryLessons.length,
    percentage: Math.round((watchedCategoryLessons.length / categoryLessons.length) * 100) || 0
  };
};

// Adicione este tipo no seu arquivo de tipos
export interface Progress {
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  nextLesson: string | false;
  lastAccessed: Date | null;
  byCategory?: {
    [key in VideoLessonCategory]: {
      completed: number;
      total: number;
      percentage: number;
    };
  };
}