import { Lead, Pipeline, Stage, CustomField, User, AIAgent, Message, LeadContext } from '@/types/crm';

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
    id: 'agent-welcome',
    name: 'Agente de Boas-vindas',
    description: 'Recebe novos leads, qualifica e coleta informações iniciais',
    type: 'welcome',
    isActive: true,
    triggers: [
      {
        id: 'trigger-welcome',
        type: 'new_lead',
        conditions: {},
        delay: 5
      }
    ],
    messageTemplates: [
      {
        id: 'template-welcome',
        name: 'Boas-vindas e Qualificação',
        type: 'email',
        subject: 'Bem-vindo! {{name}} - Vamos conversar?',
        content: 'Olá {{name}}, obrigado por se interessar pelos nossos serviços. Para te atender melhor, gostaria de entender suas necessidades. Qual seria o melhor horário para conversarmos?',
        variables: ['name', 'company', 'email']
      }
    ],
    settings: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: 'Você é um agente de qualificação. Sua função é dar boas-vindas, coletar informações sobre necessidades do lead e qualificá-lo. Seja caloroso mas direto ao ponto.'
    },
    nextAgents: ['agent-explanation', 'agent-technical'],
    contextFields: ['budget', 'timeline', 'pain_points', 'decision_maker'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'agent-explanation',
    name: 'Agente de Explicações',
    description: 'Tira dúvidas sobre produtos, planos, preços e funcionalidades',
    type: 'explanation',
    isActive: true,
    triggers: [
      {
        id: 'trigger-explanation',
        type: 'custom',
        conditions: { previousAgent: 'agent-welcome', qualified: true },
        delay: 0
      }
    ],
    messageTemplates: [
      {
        id: 'template-explanation',
        name: 'Explicação de Produtos',
        type: 'email',
        subject: 'Sobre nossa solução para {{company}}',
        content: 'Olá {{name}}, baseado no que conversamos, nossa solução pode ajudar {{company}} com {{pain_points}}. Que tal uma demonstração personalizada?',
        variables: ['name', 'company', 'pain_points']
      }
    ],
    settings: {
      model: 'gpt-4',
      temperature: 0.6,
      maxTokens: 600,
      systemPrompt: 'Você é um especialista em produtos. Explique funcionalidades, benefícios e preços de forma clara e consultiva. Use o contexto do lead para personalizar.'
    },
    nextAgents: ['agent-closing', 'agent-technical'],
    contextFields: ['product_interest', 'features_discussed', 'pricing_range'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'agent-technical',
    name: 'Agente de Suporte Técnico',
    description: 'Responde dúvidas técnicas e avalia viabilidade técnica',
    type: 'technical_support',
    isActive: true,
    triggers: [
      {
        id: 'trigger-technical',
        type: 'custom',
        conditions: { technicalQuestions: true },
        delay: 0
      }
    ],
    messageTemplates: [
      {
        id: 'template-technical',
        name: 'Suporte Técnico',
        type: 'email',
        subject: 'Esclarecimentos técnicos para {{company}}',
        content: 'Olá {{name}}, vou ajudar com suas questões técnicas. Nossa plataforma se integra facilmente com sistemas existentes.',
        variables: ['name', 'company', 'current_systems']
      }
    ],
    settings: {
      model: 'gpt-4',
      temperature: 0.4,
      maxTokens: 700,
      systemPrompt: 'Você é um especialista técnico. Responda questões sobre integração, segurança, performance e arquitetura. Se não souber, encaminhe para humano.'
    },
    nextAgents: ['agent-explanation', 'agent-closing'],
    contextFields: ['technical_requirements', 'integrations_needed', 'security_concerns'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'agent-closing',
    name: 'Agente de Fechamento',
    description: 'Envia propostas, negocia valores e finaliza vendas',
    type: 'closing',
    isActive: true,
    triggers: [
      {
        id: 'trigger-closing',
        type: 'custom',
        conditions: { interested: true, budget_confirmed: true },
        delay: 0
      }
    ],
    messageTemplates: [
      {
        id: 'template-closing',
        name: 'Proposta Comercial',
        type: 'email',
        subject: 'Proposta personalizada para {{company}}',
        content: 'Olá {{name}}, preparei uma proposta especial para {{company}} baseada em suas necessidades. A proposta inclui {{solution_summary}}.',
        variables: ['name', 'company', 'solution_summary', 'price']
      }
    ],
    settings: {
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 800,
      systemPrompt: 'Você é um especialista em fechamento. Crie propostas persuasivas, negocie termos e conduza o lead ao fechamento. Seja confiante mas flexível.'
    },
    nextAgents: ['agent-followup'],
    contextFields: ['proposal_sent', 'negotiation_points', 'closing_objections'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'agent-followup',
    name: 'Agente de Follow-up',
    description: 'Monitora leads inativos e envia lembretes estratégicos',
    type: 'followup',
    isActive: true,
    triggers: [
      {
        id: 'trigger-followup',
        type: 'time_based',
        conditions: { days: 3, noResponse: true },
        delay: 0
      }
    ],
    messageTemplates: [
      {
        id: 'template-followup',
        name: 'Follow-up Estratégico',
        type: 'email',
        subject: 'Ainda interessado, {{name}}?',
        content: 'Olá {{name}}, notei que não tivemos retorno sobre nossa proposta. Há alguma dúvida que posso esclarecer? Estou aqui para ajudar {{company}}.',
        variables: ['name', 'company', 'last_interaction']
      }
    ],
    settings: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 400,
      systemPrompt: 'Você é especialista em reativação. Envie follow-ups educados e úteis. Ofereça valor e não seja invasivo. Saiba quando parar.'
    },
    nextAgents: ['agent-explanation', 'agent-closing'],
    contextFields: ['followup_count', 'last_engagement', 'reactivation_trigger'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockLeadContexts: LeadContext[] = [
  {
    leadId: '1',
    currentAgent: 'agent-welcome',
    completedAgents: [],
    contextData: {
      budget: '10k-25k',
      timeline: '3 months',
      pain_points: 'Manual lead management'
    },
    lastInteraction: new Date().toISOString(),
    isQualified: true,
    isInterested: true,
    needsHumanIntervention: false
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