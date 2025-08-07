import { useState } from 'react';
import { AIAgent, MessageTemplate, AITrigger } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Bot, Plus, Settings, MessageSquare, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIAgentManagerProps {
  agents: AIAgent[];
  onAgentUpdate: (agents: AIAgent[]) => void;
}

export function AIAgentManager({ agents, onAgentUpdate }: AIAgentManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [formData, setFormData] = useState<Partial<AIAgent>>({
    name: '',
    description: '',
    isActive: true,
    triggers: [],
    messageTemplates: [],
    settings: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: 'Você é um assistente de vendas especializado em CRM. Seja profissional, prestativo e personalizado nas mensagens.'
    }
  });
  const { toast } = useToast();

  const handleCreateAgent = () => {
    setSelectedAgent(null);
    setFormData({
      name: '',
      description: '',
      isActive: true,
      triggers: [],
      messageTemplates: [],
      settings: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 500,
        systemPrompt: 'Você é um assistente de vendas especializado em CRM. Seja profissional, prestativo e personalizado nas mensagens.'
      }
    });
    setIsDialogOpen(true);
  };

  const handleEditAgent = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setFormData(agent);
    setIsDialogOpen(true);
  };

  const handleSaveAgent = () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Erro",
        description: "Nome e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const agentData: AIAgent = {
      ...formData,
      id: selectedAgent?.id || `agent-${Date.now()}`,
      createdAt: selectedAgent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as AIAgent;

    if (selectedAgent) {
      onAgentUpdate(agents.map(agent => 
        agent.id === selectedAgent.id ? agentData : agent
      ));
      toast({
        title: "Agente atualizado",
        description: "Agente de IA foi atualizado com sucesso",
      });
    } else {
      onAgentUpdate([...agents, agentData]);
      toast({
        title: "Agente criado",
        description: "Novo agente de IA foi criado com sucesso",
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteAgent = (agentId: string) => {
    onAgentUpdate(agents.filter(agent => agent.id !== agentId));
    toast({
      title: "Agente removido",
      description: "Agente de IA foi removido com sucesso",
      variant: "destructive",
    });
  };

  const toggleAgentStatus = (agentId: string) => {
    onAgentUpdate(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, isActive: !agent.isActive, updatedAt: new Date().toISOString() }
        : agent
    ));
  };

  const addTrigger = () => {
    const newTrigger: AITrigger = {
      id: `trigger-${Date.now()}`,
      type: 'new_lead',
      conditions: {},
      delay: 0
    };
    
    setFormData(prev => ({
      ...prev,
      triggers: [...(prev.triggers || []), newTrigger]
    }));
  };

  const addMessageTemplate = () => {
    const newTemplate: MessageTemplate = {
      id: `template-${Date.now()}`,
      name: 'Nova Mensagem',
      type: 'email',
      subject: 'Bem-vindo!',
      content: 'Olá {{name}}, seja bem-vindo! Estamos felizes em tê-lo como lead.',
      variables: ['name', 'company', 'email']
    };
    
    setFormData(prev => ({
      ...prev,
      messageTemplates: [...(prev.messageTemplates || []), newTemplate]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Agentes de IA</h1>
          <p className="text-muted-foreground">Configure agentes inteligentes para automação de mensagens</p>
        </div>
        <Button onClick={handleCreateAgent} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </div>
                <Switch
                  checked={agent.isActive}
                  onCheckedChange={() => toggleAgentStatus(agent.id)}
                />
              </div>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={agent.isActive ? "default" : "secondary"}>
                  {agent.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Triggers:</span>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>{agent.triggers?.length || 0}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mensagens:</span>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{agent.messageTemplates?.length || 0}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditAgent(agent)}
                  className="flex-1"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Configurar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAgent(agent.id)}
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAgent ? 'Editar Agente' : 'Novo Agente de IA'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Agente</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Agente de Boas-vindas"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o que este agente faz..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label>Agente ativo</Label>
                </div>
              </CardContent>
            </Card>

            {/* AI Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações de IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="model">Modelo de IA</Label>
                  <Select 
                    value={formData.settings?.model} 
                    onValueChange={(value: any) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings!, model: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Mais inteligente)</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Mais rápido)</SelectItem>
                      <SelectItem value="claude-3">Claude-3 (Criativo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="systemPrompt">Prompt do Sistema</Label>
                  <Textarea
                    id="systemPrompt"
                    value={formData.settings?.systemPrompt}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings!, systemPrompt: e.target.value }
                    }))}
                    placeholder="Instruções para o comportamento do agente..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Triggers */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Triggers</CardTitle>
                  <Button variant="outline" size="sm" onClick={addTrigger}>
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {formData.triggers?.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhum trigger configurado</p>
                ) : (
                  <div className="space-y-2">
                    {formData.triggers?.map((trigger, index) => (
                      <div key={trigger.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">
                          {trigger.type === 'new_lead' && 'Novo Lead'}
                          {trigger.type === 'stage_change' && 'Mudança de Etapa'}
                          {trigger.type === 'time_based' && 'Baseado em Tempo'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newTriggers = formData.triggers?.filter(t => t.id !== trigger.id);
                            setFormData(prev => ({ ...prev, triggers: newTriggers }));
                          }}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Message Templates */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Templates de Mensagem</CardTitle>
                  <Button variant="outline" size="sm" onClick={addMessageTemplate}>
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {formData.messageTemplates?.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhum template configurado</p>
                ) : (
                  <div className="space-y-2">
                    {formData.messageTemplates?.map((template, index) => (
                      <div key={template.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="text-sm font-medium">{template.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {template.type}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newTemplates = formData.messageTemplates?.filter(t => t.id !== template.id);
                            setFormData(prev => ({ ...prev, messageTemplates: newTemplates }));
                          }}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAgent} className="bg-gradient-primary">
              {selectedAgent ? 'Salvar Alterações' : 'Criar Agente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}