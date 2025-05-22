export interface HelpRequest {
  fullName: string;
  location: string;
  description: string;
  urgency?: UrgencyLevel;
  type?: HelpType;
  image?: File;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export type UrgencyLevel = 'High' | 'Medium' | 'Low';
export type HelpType = 'Medical' | 'Food' | 'Shelter' | 'Evacuation' | 'Other';
