import { DailyTip, FeaturedVideo, Progress, TestResult, Theme, User } from "../types";

// mocks/user.mock.ts
export const mockUser: User = {
  id: 'user-123',
  name: 'Carlos Silva',
  email: 'carlos.silva@email.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  isAdmin: true,
  licenseType: 'B',
  joinedAt: new Date('2023-01-15'),
};

// mocks/progress.mock.ts
export const mockProgress: Progress = {
  completedLessons: 18,
  totalLessons: 30,
  percentage: 60,
  nextLesson: 'Sinalização Vertical',
  lastAccessed: new Date('2023-06-20'),
};

// mocks/tests.mock.ts
export const mockTests: TestResult[] = [
  {
    id: 'test-001',
    date: new Date('2023-06-15'),
    score: 85,
    passed: true,
    testType: 'Simulado',
    totalQuestions: 20,
    correctAnswers: 17,
  },
  {
    id: 'test-002',
    date: new Date('2023-06-10'),
    score: 72,
    passed: true,
    testType: 'Simulado',
    totalQuestions: 25,
    correctAnswers: 18,
  },
  {
    id: 'test-003',
    date: new Date('2023-06-05'),
    score: 65,
    passed: false,
    testType: 'Oficial',
    totalQuestions: 30,
    correctAnswers: 19,
  },
];

// mocks/themes.mock.ts
export const mockThemes: Theme[] = [
  {
    id: 'theme-001',
    title: 'Sinais de Trânsito',
    icon: 'traffic-light',
    totalLessons: 12,
    completedLessons: 5,
    category: 'Sinalização',
  },
  {
    id: 'theme-002',
    title: 'Legislação de Trânsito',
    icon: 'gavel',
    totalLessons: 8,
    completedLessons: 3,
    category: 'Legislação',
  },
  {
    id: 'theme-003',
    title: 'Direção Defensiva',
    icon: 'car-brake-hold',
    totalLessons: 10,
    completedLessons: 6,
    category: 'Direção',
  },
  {
    id: 'theme-004',
    title: 'Primeiros Socorros',
    icon: 'one-up',
    totalLessons: 5,
    completedLessons: 2,
    category: 'Primeiros Socorros',
  },
];

// mocks/daily-tip.mock.ts
export const mockDailyTip: DailyTip = {
  id: 'tip-001',
  title: 'Distância de Segurança',
  content: 'Mantenha sempre pelo menos 2 segundos de distância do veículo à frente. Em condições adversas, aumente para 4 segundos.',
  date: new Date('2023-06-20'),
  category: 'Direção Defensiva',
};

// mocks/video.mock.ts
export const mockFeaturedVideo: FeaturedVideo = {
   videoUrl: 'https://www.youtube.com/watch?v=YeYU67u0Gz4',
  thumbnail: 'https://i.ytimg.com/vi/YeYU67u0Gz4/hqdefault.jpg',
  title: 'Conhecendo seu carro',
  duration: 4,
  views: '340.000',
  instructor: 'Com animação',
};