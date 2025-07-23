import { VideoLesson } from '../types/admin';
import { mockCategories } from './categories.mock';

export const mockVideoLessons: VideoLesson[] = [
  {
    id: '1',
    title: 'Introdução à Legislação de Trânsito',
    url: 'https://example.com/videos/intro-legislation.mp4',
    thumbnail: 'https://example.com/thumbnails/intro-legislation.jpg',
    duration: 932,
    views: 1245,
    instructorId: 'instr-001',
    categoryId: mockCategories[3].id,
    description: 'Conceitos básicos das leis de trânsito brasileiras',
    transcript: 'Nesta aula vamos cobrir os principais artigos do CTB...',
    resources: [
      'https://example.com/resources/ctb.pdf',
      'https://example.com/resources/quiz-1.pdf'
    ],
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-06-15'),
    isActive: true
  },
  {
    id: '2',
    title: 'Direção Defensiva - Princípios Básicos',
    url: 'https://example.com/videos/defensive-driving.mp4',
    thumbnail: 'https://example.com/thumbnails/defensive-driving.jpg',
    duration: 1330, 
    views: 892,
    instructorId: 'instr-002',
    categoryId: mockCategories[4].id,
    description: 'Aprenda os 5 princípios fundamentais da direção defensiva',
    transcript: 'Direção defensiva é o conjunto de medidas...',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-05-22'),
    isActive: true
  },
  {
    id: '3',
    title: 'Interpretação de Sinais de Regulamentação',
    url: 'https://example.com/videos/regulation-signs.mp4',
    thumbnail: 'https://example.com/thumbnails/regulation-signs.jpg',
    duration: 754, 
    views: 567,
    instructorId: 'instr-001',
    categoryId: mockCategories[3].id,
    description: 'Como interpretar e obedecer aos sinais de regulamentação',
    resources: [
      'https://example.com/resources/signs-cheatsheet.pdf'
    ],
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-04-10'),
    isActive: true
  }
];