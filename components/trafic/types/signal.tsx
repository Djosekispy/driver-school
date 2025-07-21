// Tipos para os sinais de trânsito
export type SinalTransito = {
  id: string;
  nome: string;
  imagem: string;
  descricaoBreve: string;
};

export type CategoriaSinal = {
  title: string;
  data: SinalTransito[];
};

// Dados organizados por categoria
export const sinaisPorCategoria: CategoriaSinal[] = [
  {
    title: "Sinais de Regulamentação",
    data: [
      {
        id: '1',
        nome: 'Paragem Obrigatória',
        imagem: 'https://randomuser.me/api/portraits/men/13.jpg',
        descricaoBreve: 'Obriga parar completamente o veículo',
      },
      {
        id: '2',
        nome: 'Cedência de Passagem',
        imagem: 'https://randomuser.me/api/portraits/men/13.jpg',
        descricaoBreve: 'Obriga ceder passagem a outros veículos',
      },
    ],
  },
  {
    title: "Sinais de Perigo",
    data: [
      {
        id: '3',
        nome: 'Curva Perigosa à Direita',
        imagem: 'https://randomuser.me/api/portraits/men/13.jpg',
        descricaoBreve: 'Adverte sobre curva acentuada à direita',
      },
    ],
  },
];
