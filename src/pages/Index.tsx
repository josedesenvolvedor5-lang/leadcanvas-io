import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';
import { LeadForm } from '@/components/leads/LeadForm';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { PipelineOverview } from '@/components/dashboard/PipelineOverview';
import { PipelineManager } from '@/components/management/PipelineManager';
import { CustomFieldManager } from '@/components/management/CustomFieldManager';
import { mockLeads, mockPipelines, mockStages, mockCustomFields } from '@/data/mockData';
import { Lead, Pipeline, CustomField } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentView, setCurrentView] = useState('pipeline');
  const [leads, setLeads] = useState(mockLeads);
  const [pipelines, setPipelines] = useState(mockPipelines);
  const [customFields, setCustomFields] = useState(mockCustomFields);
  const [activePipelineId, setActivePipelineId] = useState(mockPipelines[0]?.id || '');
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const { toast } = useToast();

  const handleLeadMove = (leadId: string, newStageId: string) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, stageId: newStageId, updatedAt: new Date().toISOString() }
          : lead
      )
    );
    
    toast({
      title: "Lead movido",
      description: "Lead foi movido para nova etapa com sucesso",
    });
  };

  const handleLeadEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsLeadFormOpen(true);
  };

  const handleLeadDelete = (leadId: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
    toast({
      title: "Lead removido",
      description: "Lead foi removido com sucesso",
      variant: "destructive",
    });
  };

  const handleLeadSave = (leadData: Partial<Lead>) => {
    if (selectedLead) {
      // Update existing lead
      setLeads(prev => 
        prev.map(lead => 
          lead.id === selectedLead.id 
            ? { ...lead, ...leadData }
            : lead
        )
      );
      toast({
        title: "Lead atualizado",
        description: "Lead foi atualizado com sucesso",
      });
    } else {
      // Create new lead
      const newLead = {
        ...leadData,
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Lead;
      
      setLeads(prev => [...prev, newLead]);
      toast({
        title: "Lead criado",
        description: "Novo lead foi criado com sucesso",
      });
    }
    
    setSelectedLead(undefined);
  };

  const handleNewLead = () => {
    setSelectedLead(undefined);
    setIsLeadFormOpen(true);
  };

  const handleAddLead = (stageId: string) => {
    setSelectedLead(undefined);
    setIsLeadFormOpen(true);
  };

  const handleViewChange = (view: string) => {
    if (view === 'new-lead') {
      handleNewLead();
    } else {
      setCurrentView(view);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="flex-1 p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Visão geral do seu CRM</p>
            </div>
            <StatsCards leads={leads} stages={pipelines.find(p => p.id === activePipelineId)?.stages || []} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PipelineOverview leads={leads} stages={pipelines.find(p => p.id === activePipelineId)?.stages || []} />
              <div className="space-y-4">
                {/* Add more dashboard components here */}
              </div>
            </div>
          </div>
        );
      
      case 'pipeline':
        const activePipeline = pipelines.find(p => p.id === activePipelineId);
        const pipelineLeads = leads.filter(lead => lead.pipelineId === activePipelineId);
        
        return (
          <div className="flex-1 space-y-4">
            <div className="p-6 pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Pipeline de Vendas</h2>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Total de leads: {pipelineLeads.length}</span>
                    <span>Valor total: R$ {pipelineLeads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}</span>
                  </div>
                </div>
                <select
                  value={activePipelineId}
                  onChange={(e) => setActivePipelineId(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  {pipelines.map(pipeline => (
                    <option key={pipeline.id} value={pipeline.id}>
                      {pipeline.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {activePipeline && (
              <KanbanBoard
                stages={activePipeline.stages}
                leads={pipelineLeads}
                onLeadMove={handleLeadMove}
                onLeadEdit={handleLeadEdit}
                onLeadDelete={handleLeadDelete}
                onAddLead={handleAddLead}
              />
            )}
          </div>
        );
      
      case 'leads':
        return (
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Leads</h1>
              <p className="text-muted-foreground">Gerencie todos os seus leads</p>
            </div>
            {/* Add leads table/list here */}
          </div>
        );
      
      case 'analytics':
        return (
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
              <p className="text-muted-foreground">Relatórios e métricas</p>
            </div>
            {/* Add analytics components here */}
          </div>
        );
      
      case 'webhooks':
        return (
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Webhooks</h1>
              <p className="text-muted-foreground">Configure integrações automáticas</p>
            </div>
            {/* Add webhooks management here */}
          </div>
        );
      
      case 'pipelines':
        return (
          <div className="flex-1 p-6">
            <PipelineManager 
              pipelines={pipelines}
              onPipelineUpdate={setPipelines}
            />
          </div>
        );
      
      case 'custom-fields':
        return (
          <div className="flex-1 p-6">
            <CustomFieldManager 
              customFields={customFields}
              onFieldsUpdate={setCustomFields}
            />
          </div>
        );

      case 'settings':
        return (
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
              <p className="text-muted-foreground">Personalize seu CRM</p>
            </div>
            {/* Add settings components here */}
          </div>
        );
      
      default:
        return (
          <div className="flex-1 p-6">
            <h1 className="text-3xl font-bold text-foreground">CRM Pro</h1>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      
      {renderContent()}
      
      <LeadForm
        lead={selectedLead}
        pipelines={pipelines}
        customFields={customFields}
        isOpen={isLeadFormOpen}
        onClose={() => {
          setIsLeadFormOpen(false);
          setSelectedLead(undefined);
        }}
        onSave={handleLeadSave}
      />
    </div>
  );
};

export default Index;
