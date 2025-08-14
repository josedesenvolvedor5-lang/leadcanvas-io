import { useState } from 'react';
import { AIAgent, Pipeline, Stage, Lead, AITrigger, MessageTemplate } from '@/types/crm';
import { mockPipelines, mockLeads } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, ArrowRight, Workflow, Target, Clock, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AgentFlowBuilderProps {
  agents: AIAgent[];
  onAgentUpdate: (agents: AIAgent[]) => void;
}

interface FlowNode {
  id: string;
  agentId: string;
  pipelineId: string;
  stageId: string;
  order: number;
  conditions?: {
    leadValue?: number;
    leadSource?: string;
    timeInStage?: number;
  };
}

interface AgentFlow {
  id: string;
  name: string;
  description: string;
  pipelineId: string;
  nodes: FlowNode[];
  isActive: boolean;
}

export function AgentFlowBuilder({ agents, onAgentUpdate }: AgentFlowBuilderProps) {
  const [flows, setFlows] = useState<AgentFlow[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<AgentFlow | null>(null);
  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const [formData, setFormData] = useState<Partial<AgentFlow>>({
    name: '',
    description: '',
    pipelineId: '',
    nodes: [],
    isActive: true
  });
  const { toast } = useToast();

  const handleCreateFlow = () => {
    setSelectedFlow(null);
    setFormData({
      name: '',
      description: '',
      pipelineId: '',
      nodes: [],
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleEditFlow = (flow: AgentFlow) => {
    setSelectedFlow(flow);
    setFormData(flow);
    setSelectedPipeline(flow.pipelineId);
    setIsDialogOpen(true);
  };

  const handleSaveFlow = () => {
    if (!formData.name || !formData.pipelineId) {
      toast({
        title: "Erro",
        description: "Nome e pipeline são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const flowData: AgentFlow = {
      ...formData,
      id: selectedFlow?.id || `flow-${Date.now()}`,
    } as AgentFlow;

    if (selectedFlow) {
      setFlows(flows.map(flow => 
        flow.id === selectedFlow.id ? flowData : flow
      ));
    } else {
      setFlows([...flows, flowData]);
    }

    // Aplicar configurações dos agentes baseado no fluxo
    applyFlowToAgents(flowData);

    toast({
      title: selectedFlow ? "Fluxo atualizado" : "Fluxo criado",
      description: "Fluxo de agentes configurado com sucesso",
    });

    setIsDialogOpen(false);
  };

  const applyFlowToAgents = (flow: AgentFlow) => {
    const pipeline = mockPipelines.find(p => p.id === flow.pipelineId);
    if (!pipeline) return;

    const updatedAgents = [...agents];

    flow.nodes.forEach((node, index) => {
      const agent = updatedAgents.find(a => a.id === node.agentId);
      if (!agent) return;

      const stage = pipeline.stages.find(s => s.id === node.stageId);
      if (!stage) return;

      // Configurar triggers do agente
      const trigger: AITrigger = {
        id: `trigger-${node.id}`,
        type: 'stage_change',
        conditions: {
          pipelineId: flow.pipelineId,
          toStageId: node.stageId,
          ...node.conditions
        },
        delay: node.conditions?.timeInStage || 0
      };

      agent.triggers = [trigger];

      // Configurar próximos agentes
      if (index < flow.nodes.length - 1) {
        const nextNode = flow.nodes[index + 1];
        agent.nextAgents = [nextNode.agentId];
      } else {
        agent.nextAgents = [];
      }

      // Atualizar configurações específicas do agente
      agent.contextFields = getContextFieldsForStage(stage.name);
      agent.settings.systemPrompt = getSystemPromptForFlow(stage.name, node.conditions);
    });

    onAgentUpdate(updatedAgents);
  };

  const getContextFieldsForStage = (stageName: string): string[] => {
    const lowerStage = stageName.toLowerCase();
    const baseFields = ['name', 'email', 'phone'];
    
    if (lowerStage.includes('novo') || lowerStage.includes('lead')) {
      return [...baseFields, 'source', 'interest'];
    }
    if (lowerStage.includes('qualific')) {
      return [...baseFields, 'company', 'budget', 'timeline'];
    }
    if (lowerStage.includes('proposta')) {
      return [...baseFields, 'company', 'budget', 'decision_maker'];
    }
    
    return baseFields;
  };

  const getSystemPromptForFlow = (stageName: string, conditions?: FlowNode['conditions']): string => {
    let basePrompt = `Você é um assistente especializado na fase "${stageName}" do pipeline de vendas.`;
    
    if (conditions?.leadValue) {
      basePrompt += ` Este lead tem alto valor (R$ ${conditions.leadValue}+), seja ainda mais consultivo.`;
    }
    
    if (conditions?.leadSource) {
      basePrompt += ` Lead veio de ${conditions.leadSource}, ajuste sua abordagem conforme necessário.`;
    }
    
    return basePrompt;
  };

  const addNodeToFlow = () => {
    if (!selectedPipeline) return;

    const pipeline = mockPipelines.find(p => p.id === selectedPipeline);
    if (!pipeline) return;

    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      agentId: '',
      pipelineId: selectedPipeline,
      stageId: pipeline.stages[0]?.id || '',
      order: (formData.nodes?.length || 0) + 1,
      conditions: {}
    };

    setFormData(prev => ({
      ...prev,
      nodes: [...(prev.nodes || []), newNode]
    }));
  };

  const updateNode = (nodeId: string, updates: Partial<FlowNode>) => {
    setFormData(prev => ({
      ...prev,
      nodes: prev.nodes?.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      ) || []
    }));
  };

  const removeNode = (nodeId: string) => {
    setFormData(prev => ({
      ...prev,
      nodes: prev.nodes?.filter(node => node.id !== nodeId) || []
    }));
  };

  const getLeadsCountByPipeline = (pipelineId: string) => {
    return mockLeads.filter(lead => lead.pipelineId === pipelineId).length;
  };

  const getLeadsCountByStage = (pipelineId: string, stageId: string) => {
    return mockLeads.filter(lead => 
      lead.pipelineId === pipelineId && lead.stageId === stageId
    ).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Criador de Fluxos</h1>
          <p className="text-muted-foreground">Configure fluxos automatizados de agentes baseados em leads e pipelines</p>
        </div>
        <Button onClick={handleCreateFlow} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Fluxo
        </Button>
      </div>

      {/* Pipeline Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockPipelines.map(pipeline => (
          <Card key={pipeline.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                {pipeline.name}
                <Badge variant="outline">{getLeadsCountByPipeline(pipeline.id)} leads</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pipeline.stages.map(stage => (
                  <div key={stage.id} className="flex justify-between items-center text-sm">
                    <span>{stage.name}</span>
                    <Badge variant="secondary" style={{ backgroundColor: stage.color + '20', color: stage.color }}>
                      {getLeadsCountByStage(pipeline.id, stage.id)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Existing Flows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flows.map((flow) => (
          <Card key={flow.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-primary" />
                    {flow.name}
                  </CardTitle>
                  <CardDescription className="mt-1">{flow.description}</CardDescription>
                </div>
                <Badge variant={flow.isActive ? "default" : "secondary"}>
                  {flow.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pipeline:</span>
                <span>{mockPipelines.find(p => p.id === flow.pipelineId)?.name}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Nós no fluxo:</span>
                <div className="flex items-center space-x-1">
                  <ArrowRight className="h-3 w-3" />
                  <span>{flow.nodes.length}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditFlow(flow)}
                  className="flex-1"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Configurar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setFlows(flows.filter(f => f.id !== flow.id))}
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedFlow ? 'Editar Fluxo' : 'Novo Fluxo de Agentes'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Fluxo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Fluxo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Fluxo Pipeline Vendas"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva como este fluxo funcionará"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="pipeline">Pipeline</Label>
                  <Select
                    value={formData.pipelineId}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, pipelineId: value }));
                      setSelectedPipeline(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um pipeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPipelines.map(pipeline => (
                        <SelectItem key={pipeline.id} value={pipeline.id}>
                          {pipeline.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Flow Nodes */}
            {selectedPipeline && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Configuração do Fluxo</CardTitle>
                    <Button onClick={addNodeToFlow} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Nó
                    </Button>
                  </div>
                  <CardDescription>
                    Configure os agentes para cada etapa do pipeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.nodes?.map((node, index) => {
                      const pipeline = mockPipelines.find(p => p.id === selectedPipeline);
                      const availableAgents = agents.filter(agent => agent.isActive);
                      
                      return (
                        <div key={node.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Nó {index + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNode(node.id)}
                              className="text-destructive"
                            >
                              Remover
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Estágio do Pipeline</Label>
                              <Select
                                value={node.stageId}
                                onValueChange={(value) => updateNode(node.id, { stageId: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um estágio" />
                                </SelectTrigger>
                                <SelectContent>
                                  {pipeline?.stages.map(stage => (
                                    <SelectItem key={stage.id} value={stage.id}>
                                      {stage.name}
                                    </SelectItem>
                                  ))
                                  }
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Agente Responsável</Label>
                              <Select
                                value={node.agentId}
                                onValueChange={(value) => updateNode(node.id, { agentId: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um agente" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableAgents.map(agent => (
                                    <SelectItem key={agent.id} value={agent.id}>
                                      {agent.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Valor Mínimo do Lead (R$)</Label>
                              <Input
                                type="number"
                                value={node.conditions?.leadValue || ''}
                                onChange={(e) => updateNode(node.id, {
                                  conditions: { ...node.conditions, leadValue: Number(e.target.value) }
                                })}
                                placeholder="Ex: 1000"
                              />
                            </div>
                            
                            <div>
                              <Label>Tempo no Estágio (minutos)</Label>
                              <Input
                                type="number"
                                value={node.conditions?.timeInStage || ''}
                                onChange={(e) => updateNode(node.id, {
                                  conditions: { ...node.conditions, timeInStage: Number(e.target.value) }
                                })}
                                placeholder="Ex: 60"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label>Fonte do Lead</Label>
                              <Select
                                value={node.conditions?.leadSource || ''}
                                onValueChange={(value) => updateNode(node.id, {
                                  conditions: { ...node.conditions, leadSource: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Qualquer fonte" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="website">Website</SelectItem>
                                  <SelectItem value="facebook">Facebook</SelectItem>
                                  <SelectItem value="google">Google</SelectItem>
                                  <SelectItem value="referral">Indicação</SelectItem>
                                  <SelectItem value="cold_call">Cold Call</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {formData.nodes?.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Workflow className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum nó configurado ainda</p>
                        <p className="text-sm">Clique em "Adicionar Nó" para começar</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveFlow} className="bg-gradient-primary">
              {selectedFlow ? 'Atualizar' : 'Criar'} Fluxo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
