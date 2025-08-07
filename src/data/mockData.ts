import { Lead, Pipeline, Stage, CustomField, User, AIAgent, Message } from '@/types/crm';

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

export const mockAIAgents: AIAgent[] = [
  {
    id: '1',
    name: 'Agente de Boas-vindas',
    description: 'Envia mensagens de boas-vindas para novos leads automaticamente',
    isActive: true,
    triggers: [
      {
        id: '1',
        type: 'new_lead',
        conditions: {},
        delay: 5
      }
    ],
    messageTemplates: [
      {
        id: '1',
        name: 'Boas-vindas por E-mail',
        type: 'email',
        subject: 'Bem-vindo! {{name}}',
        content: 'Olá {{name}}, obrigado pelo seu interesse! Em breve entraremos em contato para apresentar nossa solução personalizada para {{company}}.',
        variables: ['name', 'company', 'email']
      }
    ],
    settings: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: 'Você é um assistente de vendas especializado em CRM. Seja profissional, prestativo e personalizado nas mensagens de boas-vindas.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Follow-up Qualificação',
    description: 'Envia follow-ups para leads que estão na etapa de qualificação há mais de 2 dias',
    isActive: true,
    triggers: [
      {
        id: '2',
        type: 'time_based',
        conditions: { stageId: '3', days: 2 },
        delay: 0
      }
    ],
    messageTemplates: [
      {
        id: '2',
        name: 'Follow-up Qualificação',
        type: 'email',
        subject: 'Como podemos ajudar {{company}}?',
        content: 'Oi {{name}}, notamos que você está interessado em nossas soluções. Que tal agendarmos uma conversa rápida para entender melhor suas necessidades?',
        variables: ['name', 'company', 'email']
      }
    ],
    settings: {
      model: 'gpt-4',
      temperature: 0.8,
      maxTokens: 400,
      systemPrompt: 'Você é um assistente de vendas que faz follow-ups educados e não invasivos. Foque em ajudar o cliente.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    leadId: '1',
    agentId: '1',
    type: 'email',
    content: 'Olá ABC Tecnologia, obrigado pelo seu interesse! Em breve entraremos em contato para apresentar nossa solução personalizada para ABC Tecnologia.',
    status: 'delivered',
    sentAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: '2',
    leadId: '2',
    agentId: '1',
    type: 'email',
    content: 'Olá XYZ Corp, obrigado pelo seu interesse! Em breve entraremos em contato para apresentar nossa solução personalizada para XYZ Corp.',
    status: 'sent',
    sentAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: '3',
    leadId: '3',
    agentId: '2',
    type: 'email',
    content: 'Oi StartupX, notamos que você está interessado em nossas soluções. Que tal agendarmos uma conversa rápida para entender melhor suas necessidades?',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: '4',
    leadId: '4',
    agentId: '1',
    type: 'email',
    content: 'Olá TechFlow, obrigado pelo seu interesse! Em breve entraremos em contato para apresentar nossa solução personalizada para TechFlow.',
    status: 'failed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  }
];