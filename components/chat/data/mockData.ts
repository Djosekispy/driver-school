import { ChatMessage, TrafficSign, DrivingTip, TrafficSituation, InfractionExample } from '../types/chatTypes';

// Mensagens iniciais do chat
export const initialMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Olá! Sou sua assistente de direção. Posso te ajudar com dúvidas sobre trânsito, análise de imagens e orientações para sua prova prática. Como posso ajudar hoje?',
    sender: 'ai',
    timestamp: new Date(),
  },
  {
    id: '2',
    text: 'Você pode me perguntar sobre: sinais de trânsito, manobras, legislação ou enviar fotos de situações para análise.',
    sender: 'ai',
    timestamp: new Date(Date.now() + 1000),
  },
];

// Sinais de trânsito comuns
export const trafficSigns: TrafficSign[] = [
  {
    id: '1',
    name: 'Pare',
    description: 'Obriga a parada obrigatória do veículo antes da linha de retenção.',
    category: 'regulamentação',
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    commonMistakes: [
      'Parar após a linha de retenção',
      'Não parar completamente',
      'Não observar todos os sentidos antes de prosseguir'
    ]
  },
  {
    id: '2',
    name: 'Dê a preferência',
    description: 'Indica que o condutor deve ceder passagem aos veículos que circulam na via transversal.',
    category: 'regulamentação',
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: '3',
    name: 'Curva acentuada à esquerda',
    description: 'Adverte sobre curva acentuada no sentido anti-horário à frente.',
    category: 'advertência',
    imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg'
  }
];

// Dicas de direção
export const drivingTips: DrivingTip[] = [
  {
    id: '1',
    title: 'Controle de Embreagem',
    description: 'Técnica para usar a embreagem corretamente em subidas.',
    difficulty: 'iniciante',
    steps: [
      'Pise no freio e na embreagem simultaneamente',
      'Engate a primeira marcha',
      'Libere a embreagem até o ponto de acionamento',
      'Quando sentir o carro trepidar, solte o freio e pise no acelerador'
    ]
  },
  {
    id: '2',
    title: 'Estacionamento Paralelo',
    description: 'Como estacionar entre dois carros na via.',
    difficulty: 'intermediário',
    videoUrl: 'https://www.youtube.com/watch?v=FgtTj3RCW1I'
  }
];

// Situações de trânsito comuns
export const trafficSituations: TrafficSituation[] = [
  {
    id: '1',
    title: 'Cruzamento sem sinalização',
    description: 'Situação onde duas vias se cruzam sem nenhum tipo de sinalização.',
    imageUrl: 'https://randomuser.me/api/portraits/men/14.jpg',
    correctProcedure: 'Reduzir a velocidade e ceder passagem ao veículo que vier pela direita.',
    commonErrors: [
      'Não reduzir a velocidade',
      'Não observar ambos os lados',
      'Acelerar para passar rápido'
    ],
    relatedSigns: ['1', '2'] // IDs dos sinais relacionados
  }
];

// Exemplos de infrações
export const infractionExamples: InfractionExample[] = [
  {
    id: '1',
    name: 'Estacionar em local proibido',
    description: 'Estacionar o veículo em local sinalizado como proibido.',
    severity: 'grave',
    points: 4,
    fineAmount: 130.16,
    imageUrl: 'https://randomuser.me/api/portraits/men/13.jpg'
  },
  {
    id: '2',
    name: 'Ultrapassar pelo acostamento',
    description: 'Realizar ultrapassagem utilizando o acostamento da via.',
    severity: 'gravíssima',
    points: 7,
    fineAmount: 293.47
  }
];

// Respostas pré-definidas da IA
export const aiResponses = {
  greetings: [
    "Olá! Como posso te ajudar com suas dúvidas de direção hoje?",
    "Bem-vindo de volta ao seu assistente de direção! Qual é a sua dúvida?",
    "Pronto para aprender mais sobre direção? Me diga como posso ajudar."
  ],
  signAnalysis: (signName: string) => [
    `O sinal "${signName}" é um sinal de regulamentação que indica parada obrigatória.`,
    `Você identificou um "${signName}". Lembre-se que este sinal exige parada completa do veículo.`,
    `Analisando a imagem, reconheço o sinal "${signName}". Este é um dos sinais mais importantes da via.`
  ],
  situationAnalysis: [
    "Esta situação requer atenção especial. Recomendo reduzir a velocidade e observar todos os lados.",
    "Neste cenário, a prioridade é do veículo que vem pela direita. Mantenha a calma e prossiga com cuidado.",
    "Situação complexa identificada. Verifique os espelhos, sinalize sua intenção e execute a manobra com segurança."
  ],
  unknownImage: [
    "Não consegui identificar claramente a situação. Poderia descrever o que está vendo?",
    "A imagem não está muito clara. Você pode enviar outra ou me dizer o que gostaria de analisar?",
    "Estou tendo dificuldade com esta imagem. Podemos tentar outra ou focar em algo específico?"
  ],
  default: [
    "Entendi sua dúvida. Posso te explicar melhor sobre esse assunto.",
    "Ótima pergunta! Vamos abordar esse tópico importante.",
    "Isso é algo que muitos alunos têm dúvidas. Deixe-me explicar."
  ]
};

// Função para gerar respostas aleatórias da IA
export const getRandomResponse = (type: keyof typeof aiResponses, param?: string) => {
  const responses = param ? aiResponses[type](param) : aiResponses[type];
  return responses[Math.floor(Math.random() * responses.length)];
};