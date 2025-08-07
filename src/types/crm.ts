export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  value: number;
  stageId: string;
  pipelineId: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, any>;
  notes?: string;
  source?: string;
}


export interface Stage {
  id: string;
  name: string;
  color: string;
  order: number;
  pipelineId: string;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  stages: Stage[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'boolean';
  options?: string[]; // For select type
  required: boolean;
  order: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
}

export interface ActivityLog {
  id: string;
  leadId: string;
  action: string;
  details: string;
  userId: string;
  timestamp: string;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggers: AITrigger[];
  messageTemplates: MessageTemplate[];
  settings: AISettings;
  createdAt: string;
  updatedAt: string;
}

export interface AITrigger {
  id: string;
  type: 'new_lead' | 'stage_change' | 'time_based' | 'custom';
  conditions: Record<string, any>;
  delay?: number; // in minutes
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: 'email' | 'whatsapp' | 'sms';
  subject?: string; // for email
  content: string;
  variables: string[]; // Available variables like {{name}}, {{company}}
}

export interface AISettings {
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3';
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface Message {
  id: string;
  leadId: string;
  agentId: string;
  type: 'email' | 'whatsapp' | 'sms';
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: string;
  createdAt: string;
}