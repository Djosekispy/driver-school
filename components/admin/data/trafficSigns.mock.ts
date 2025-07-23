import { TrafficSign } from '../types/admin';
import { mockCategories } from './categories.mock';

export const mockTrafficSigns: TrafficSign[] = [
  {
    id: 'sign-001',
    name: 'Pare',
    image: 'https://example.com/signs/stop.jpg',
    categoryId: mockCategories[0].id,
    description: 'Sinal de parada obrigatória',
    meaning: 'O condutor deve parar completamente o veículo antes da linha de retenção',
    rules: [
      'Parar completamente antes da linha',
      'Só prosseguir quando for seguro'
    ],
    commonMistakes: [
      'Não parar completamente',
      'Não observar todos os sentidos antes de prosseguir'
    ],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-01'),
    isActive: true
  },
  {
    id: 'sign-002',
    name: 'Velocidade Máxima 60km/h',
    image: 'https://example.com/signs/speed-limit-60.jpg',
    categoryId: mockCategories[0].id,
    description: 'Limite máximo de velocidade permitido',
    meaning: 'Velocidade não pode exceder 60km/h neste trecho',
    rules: [
      'Manter velocidade igual ou abaixo do limite',
      'Ajustar velocidade às condições da via'
    ],
    commonMistakes: [
      'Ignorar o limite em vias aparentemente vazias',
      'Não reduzir velocidade em condições adversas'
    ],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-05-15'),
    isActive: true
  },
  {
    id: 'sign-003',
    name: 'Curva Perigosa à Direita',
    image: 'https://example.com/signs/dangerous-curve-right.jpg',
    categoryId: mockCategories[1].id,
    description: 'Adverte sobre curva acentuada à direita',
    meaning: 'Próximidade de curva acentuada no sentido indicado',
    rules: [
      'Reduzir velocidade antecipadamente',
      'Manter o veículo na própria faixa'
    ],
    commonMistakes: [
      'Manter velocidade elevada na curva',
      'Invadir a faixa oposta'
    ],
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-04-20'),
    isActive: true
  }
];