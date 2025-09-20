export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export type Requirement = {
  id: string;
  type: 'Functional' | 'NonFunctional' | 'Domain';
  description: string;
  priority: 'Low' | 'Med' | 'High';
  confidence_score: number;
};
