
export interface ComponentInfo {
  name: string;
  type: string;
  value: string;
  description: string;
  roleInCircuit: string;
}

export interface AnalysisResult {
  summary: string;
  components: ComponentInfo[];
  theoryOfOperation: string;
  potentialIssues: string[];
  suggestions: string[];
  suggestedFirmware?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface SchematicState {
  image: string | null;
  analysis: AnalysisResult | null;
  messages: Message[];
  isAnalyzing: boolean;
}
