export type TrafficSignCategory = 
  | 'regulamentação'
  | 'advertência'
  | 'indicação'
  | 'educativo'
  | 'serviço';

export interface TrafficSign {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: TrafficSignCategory;
}
