import { Test, TestCategory } from '../types/teste';

export const mockTestCategories: TestCategory[] = [
  { id: '1', name: 'Matemática' },
  { id: '2', name: 'Português' },
  { id: '3', name: 'Ciências' },
  { id: '4', name: 'História' },
  { id: '5', name: 'Geografia' },
];

export const mockTests: Test[] = [
  {
    id: '1',
    title: 'Teste de Matemática Básica',
    description: 'Teste sobre operações básicas de matemática',
    categoryId: '1',
    order: 1,
    passingScore: 70,
    createdAt: new Date(),
    questions: [
      {
        id: '1',
        text: 'Quanto é 2 + 2?',
        options: [
          { id: '1', text: '3', isCorrect: false, points: 0 },
          { id: '2', text: '4', isCorrect: true, points: 1 },
          { id: '3', text: '5', isCorrect: false, points: 0 },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Teste de Gramática',
    description: 'Teste sobre regras gramaticais básicas',
    categoryId: '2',
    order: 2,
    passingScore: 80,
    createdAt: new Date(),
    questions: []
  }
];