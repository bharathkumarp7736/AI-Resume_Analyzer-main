export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  analyzesUsed: number;
  analyzesLimit: number;
}

export interface ResumeAnalysis {
  id: string;
  fileName: string;
  uploadedAt: string;
  score: number;
  jobTitle: string;
  status: 'completed' | 'analyzing' | 'failed';
  sections: AnalysisSection[];
  keywords: Keyword[];
  suggestions: Suggestion[];
  atsScore: number;
  readabilityScore: number;
  impactScore: number;
}

export interface AnalysisSection {
  name: string;
  score: number;
  feedback: string;
  status: 'good' | 'warning' | 'error';
}

export interface Keyword {
  word: string;
  found: boolean;
  importance: 'high' | 'medium' | 'low';
}

export interface Suggestion {
  id: string;
  type: 'improvement' | 'warning' | 'success';
  title: string;
  description: string;
}
