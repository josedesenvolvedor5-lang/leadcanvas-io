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