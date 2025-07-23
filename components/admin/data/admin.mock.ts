// mocks/admin.mock.ts

import { AdminTest, AdminUser, Category, Question } from "../types/admin";

// Categorias
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Legislação',
    description: 'Regras e leis de trânsito',
    icon: 'gavel'
  },
  {
    id: 'cat-2',
    name: 'Sinalização',
    description: 'Placas e sinais de trânsito',
    icon: 'traffic-light'
  },
  {
    id: 'cat-3',
    name: 'Direção Defensiva',
    description: 'Técnicas de direção segura',
    icon: 'car-brake-hold'
  }
];

// Usuários
export const mockAdminUsers: AdminUser[] = [
  {
    id: 'user-1',
    name: 'Admin Master',
    email: 'admin@example.com',
    avatar: 'https://example.com/avatars/admin.jpg',
    role: 'admin',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-06-01'),
    isActive: true
  },
  {
    id: 'user-2',
    name: 'Instrutor Carlos',
    email: 'instrutor@example.com',
    avatar: 'https://example.com/avatars/instructor.jpg',
    role: 'instructor',
    licenseType: ['A', 'B', 'C'],
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-05-20'),
    isActive: true
  }
];

// Perguntas
export const mockQuestions: Question[] = [
  {
    id: 'q-1',
    text: 'O que significa a placa de Pare?',
    options: [
      { id: '1', text: 'Reduzir a velocidade', isCorrect: false },
      { id: '2', text: 'Parada obrigatória', isCorrect: true },
      { id: '3', text: 'Curva perigosa à frente', isCorrect: false }
    ],
    explanation: 'A placa de Pare indica que o condutor deve parar completamente o veículo.',
    difficulty: 'easy',
    categoryId: 'cat-2'
  }
];

// Testes
export const mockAdminTests: AdminTest[] = [
  {
    id: 'test-1',
    title: 'Teste Inicial de Legislação',
    description: 'Teste básico sobre leis de trânsito',
    categoryId: 'cat-1',
    questionsCount: 20,
    passingScore: 70,
    difficulty: 'easy',
    attempts: 3,
    shuffleQuestions: true,
    shuffleOptions: false,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-06-15'),
    isActive: true
  }
];