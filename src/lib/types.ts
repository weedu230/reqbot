export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  audio?: string;
};

export type Requirement = {
  id: string;
  type: 'Functional' | 'NonFunctional' | 'Domain' | 'Inverse';
  description: string;
  priority: 'Low' | 'Med' | 'High';
  confidence_score: number;
};
