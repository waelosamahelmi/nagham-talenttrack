// AI Model Configuration for OpenRouter
// This file allows easy switching between different AI models

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  costPer1MTokens: string;
  strengths: string[];
  bestFor: string[];
}

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Most capable Claude model with excellent reasoning and analysis',
    costPer1MTokens: '$3-15',
    strengths: ['Complex reasoning', 'Code analysis', 'Detailed explanations'],
    bestFor: ['Resume parsing', 'Candidate analysis', 'Interview questions']
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Anthropic\'s most powerful model for complex tasks',
    costPer1MTokens: '$15-75',
    strengths: ['Superior reasoning', 'Creative writing', 'Complex analysis'],
    bestFor: ['Detailed candidate assessments', 'Complex job matching']
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Fastest Claude model for quick responses',
    costPer1MTokens: '$0.25-1.25',
    strengths: ['Speed', 'Cost-effective', 'Simple tasks'],
    bestFor: ['Quick queries', 'Chat responses', 'Simple analysis']
  },
  {
    id: 'qwen/qwen2.5-vl-32b-instruct:free',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Latest GPT-4 with improved performance and lower costs',
    costPer1MTokens: '$10-30',
    strengths: ['Versatile', 'Well-rounded', 'Good reasoning'],
    bestFor: ['General HR tasks', 'Communication analysis', 'Feedback generation']
  },
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and cost-effective for simpler tasks',
    costPer1MTokens: '$0.5-1.5',
    strengths: ['Speed', 'Cost-effective', 'Good for simple tasks'],
    bestFor: ['Chat responses', 'Simple queries', 'Basic analysis']
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s advanced language model',
    costPer1MTokens: '$0.5-1.5',
    strengths: ['Multimodal', 'Good reasoning', 'Cost-effective'],
    bestFor: ['Document analysis', 'Multi-format processing']
  },
  {
    id: 'meta-llama/llama-3-70b-instruct',
    name: 'Llama 3 70B',
    provider: 'Meta',
    description: 'Open source model with good performance',
    costPer1MTokens: '$0.9-0.9',
    strengths: ['Open source', 'Good performance', 'Cost-effective'],
    bestFor: ['Privacy-conscious deployments', 'Cost optimization']
  }
];

// Current model configuration
export const DEFAULT_MODEL = 'anthropic/claude-3.5-sonnet';

// Model selection based on task type
export const getOptimalModel = (taskType: 'parsing' | 'analysis' | 'chat' | 'generation'): string => {
  switch (taskType) {
    case 'parsing':
      return 'anthropic/claude-3.5-sonnet'; // Best for structured data extraction
    case 'analysis':
      return 'anthropic/claude-3.5-sonnet'; // Best for complex reasoning
    case 'chat':
      return 'anthropic/claude-3-haiku'; // Fast responses for chat
    case 'generation':
      return 'qwen/qwen2.5-vl-32b-instruct:free'; // Good for creative generation
    default:
      return DEFAULT_MODEL;
  }
};

// Cost estimation helper
export const estimateCost = (modelId: string, tokens: number): string => {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  if (!model) return 'Unknown';
  
  const costRange = model.costPer1MTokens.replace('$', '').split('-');
  const avgCost = costRange.length === 2 
    ? (parseFloat(costRange[0]) + parseFloat(costRange[1])) / 2
    : parseFloat(costRange[0]);
  
  const estimatedCost = (tokens / 1000000) * avgCost;
  return `$${estimatedCost.toFixed(4)}`;
};

export default {
  AVAILABLE_MODELS,
  DEFAULT_MODEL,
  getOptimalModel,
  estimateCost
};
