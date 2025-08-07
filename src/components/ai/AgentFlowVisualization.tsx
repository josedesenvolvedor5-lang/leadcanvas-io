import { AIAgent } from '@/types/crm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Brain, Headphones, Handshake, UserCheck } from 'lucide-react';

interface AgentFlowVisualizationProps {
  agents: AIAgent[];
}

const getAgentIcon = (type: AIAgent['type']) => {
  switch (type) {
    case 'welcome': return UserCheck;
    case 'explanation': return Users;
    case 'technical_support': return Headphones;
    case 'closing': return Handshake;
    case 'followup': return Brain;
    default: return UserCheck;
  }
};

const getAgentTypeLabel = (type: AIAgent['type']) => {
  switch (type) {
    case 'welcome': return 'Boas-vindas';
    case 'explanation': return 'Explicações';
    case 'technical_support': return 'Suporte Técnico';
    case 'closing': return 'Fechamento';
    case 'followup': return 'Follow-up';
    default: return 'Geral';
  }
};

const getAgentColor = (type: AIAgent['type']) => {
  switch (type) {
    case 'welcome': return 'bg-green-100 border-green-300 text-green-800';
    case 'explanation': return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'technical_support': return 'bg-purple-100 border-purple-300 text-purple-800';
    case 'closing': return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'followup': return 'bg-gray-100 border-gray-300 text-gray-800';
    default: return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

export function AgentFlowVisualization({ agents }: AgentFlowVisualizationProps) {
  const activeAgents = agents.filter(agent => agent.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowRight className="h-5 w-5" />
          <span>Fluxo de Agentes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeAgents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum agente ativo configurado
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {activeAgents.map((agent) => {
                const IconComponent = getAgentIcon(agent.type);
                return (
                  <div key={agent.id} className="flex flex-col items-center">
                    <div className={`p-4 rounded-lg border-2 ${getAgentColor(agent.type)} min-w-[180px] text-center`}>
                      <div className="flex items-center justify-center mb-2">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h4 className="font-medium text-sm mb-1">{agent.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getAgentTypeLabel(agent.type)}
                      </Badge>
                      {agent.contextFields && agent.contextFields.length > 0 && (
                        <div className="mt-2 text-xs opacity-75">
                          Coleta: {agent.contextFields.slice(0, 2).join(', ')}
                          {agent.contextFields.length > 2 && '...'}
                        </div>
                      )}
                    </div>
                    
                    {agent.nextAgents && agent.nextAgents.length > 0 && (
                      <div className="mt-2 flex flex-col items-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground mb-1" />
                        <div className="flex flex-wrap gap-1 justify-center">
                          {agent.nextAgents.map((nextAgentId) => {
                            const nextAgent = agents.find(a => a.id === nextAgentId);
                            if (!nextAgent) return null;
                            
                            return (
                              <Badge key={nextAgentId} variant="secondary" className="text-xs">
                                {getAgentTypeLabel(nextAgent.type)}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <h5 className="font-medium mb-2">Legenda do Fluxo:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>• <strong>Boas-vindas:</strong> Qualifica e coleta dados iniciais</div>
            <div>• <strong>Explicações:</strong> Esclarece produtos e benefícios</div>
            <div>• <strong>Suporte Técnico:</strong> Resolve questões técnicas</div>
            <div>• <strong>Fechamento:</strong> Negocia e envia propostas</div>
            <div>• <strong>Follow-up:</strong> Reativa leads inativos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}