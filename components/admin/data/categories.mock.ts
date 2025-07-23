import { Category } from '../types/admin';

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Regulamentação',
    description: 'Sinais que estabelecem obrigações, proibições ou restrições',
    icon: 'loader'
  },
  {
    id: 'cat-2',
    name: 'Advertência',
    description: 'Sinais que alertam sobre condições potencialmente perigosas',
    icon: 'alert-triangle'
  },
  {
    id: 'cat-3',
    name: 'Indicação',
    description: 'Sinais que fornecem informações úteis aos condutores',
    icon: 'info'
  },
  {
    id: 'cat-5',
    name: 'Direção Defensiva',
    description: 'Técnicas para dirigir com segurança',
    icon: 'shield'
  }
];