import { Lead, Pipeline, Stage, CustomField, User } from '@/types/crm';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    role: 'admin',
    avatar: 'JS'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    role: 'user',
    avatar: 'MS'
  }
];

export const mockStages: Stage[] = [
  {
    id: '1',
    name: 'Novo Lead',
    color: 'hsl(var(--stage-new))',
    order: 1,
    pipelineId: '1'
  },
  {
    id: '2',
    name: 'Contactado',
    color: 'hsl(var(--stage-contacted))',
    order: 2,
    pipelineId: '1'
  },
  {
    id: '3',
    name: 'Qualificado',
    color: 'hsl(var(--stage-qualified))',
    order: 3,
    pipelineId: '1'
  },
  {
    id: '4',
    name: 'Proposta',
    color: 'hsl(var(--stage-proposal))',
    order: 4,
    pipelineId: '1'
  },
  {
    id: '5',
    name: 'Fechado',
    color: 'hsl(var(--stage-won))',
    order: 5,
    pipelineId: '1'
  }
];

export const mockPipelines: Pipeline[] = [
  {
    id: '1',
    name: 'Pipeline Vendas',
    description: 'Pipeline principal de vendas',
    isDefault: true,
    stages: mockStages,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'ABC Tecnologia',
    email: 'contato@abctech.com',
    phone: '(11) 99999-9999',
    company: 'ABC Tecnologia',
    value: 15000,
    stageId: '1',
    pipelineId: '1',
    assignedTo: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'Website',
    notes: 'Interessado em sistema CRM personalizado'
  },
  {
    id: '2',
    name: 'XYZ Corp',
    email: 'vendas@xyzcorp.com',
    phone: '(11) 88888-8888',
    company: 'XYZ Corp',
    value: 25000,
    stageId: '2',
    pipelineId: '1',
    assignedTo: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'Indicação',
    notes: 'Reunião agendada para próxima semana'
  },
  {
    id: '3',
    name: 'StartupX',
    email: 'hello@startupx.com',
    phone: '(11) 77777-7777',
    company: 'StartupX',
    value: 8000,
    stageId: '3',
    pipelineId: '1',
    assignedTo: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'LinkedIn',
    notes: 'Precisa de solução rápida para automação'
  },
  {
    id: '4',
    name: 'TechFlow',
    email: 'contato@techflow.com',
    phone: '(11) 66666-6666',
    company: 'TechFlow',
    value: 35000,
    stageId: '4',
    pipelineId: '1',
    assignedTo: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'Google Ads',
    notes: 'Proposta enviada - aguardando resposta'
  }
];

export const mockCustomFields: CustomField[] = [
  {
    id: '1',
    name: 'Origem do Lead',
    type: 'select',
    options: ['Website', 'LinkedIn', 'Google Ads', 'Indicação', 'Cold Email'],
    required: true,
    order: 1
  },
  {
    id: '2',
    name: 'Tamanho da Empresa',
    type: 'select',
    options: ['Pequena (1-10)', 'Média (11-50)', 'Grande (50+)'],
    required: false,
    order: 2
  },
  {
    id: '3',
    name: 'Data de Próximo Contato',
    type: 'date',
    required: false,
    order: 3
  }
];