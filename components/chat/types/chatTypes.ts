export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  imageUri?: string;
  isAnalysis?: boolean;
  analysisType?: 'sign' | 'situation' | 'infraction';
}

export interface TrafficSign {
  id: string;
  name: string;
  description: string;
  category: 'regulamentação' | 'advertência' | 'indicação' | 'educativo';
  imageUrl: string;
  commonMistakes?: string[];
}

export interface DrivingTip {
  id: string;
  title: string;
  description: string;
  difficulty: 'iniciante' | 'intermediário' | 'avançado';
  videoUrl?: string;
  steps?: string[];
}

export interface TrafficSituation {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  correctProcedure: string;
  commonErrors: string[];
  relatedSigns: string[];
}

export interface InfractionExample {
  id: string;
  name: string;
  description: string;
  severity: 'leve' | 'média' | 'grave' | 'gravíssima';
  points: number;
  fineAmount: number;
  imageUrl?: string;
}