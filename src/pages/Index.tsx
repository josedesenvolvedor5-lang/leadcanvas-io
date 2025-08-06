import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';
import { LeadForm } from '@/components/leads/LeadForm';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { PipelineOverview } from '@/components/dashboard/PipelineOverview';
import { mockLeads, mockPipelines, mockStages, mockCustomFields } from '@/data/mockData';
import { Lead } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentView, setCurrentView] = useState('pipeline');
  const [leads, setLeads] = useState(mockLeads);
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
            <StatsCards leads={leads} stages={mockStages} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PipelineOverview leads={leads} stages={mockStages} />
              <div className="space-y-4">
                {/* Add more dashboard components here */}
              </div>
            </div>
          </div>
        );
      
      case 'pipeline':
        return (
          <KanbanBoard
            stages={mockStages}
            leads={leads}
            onLeadMove={handleLeadMove}
            onLeadEdit={handleLeadEdit}
            onLeadDelete={handleLeadDelete}
          />
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
        pipelines={mockPipelines}
        customFields={mockCustomFields}
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
