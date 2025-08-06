import { Lead, Stage } from '@/types/crm';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PipelineOverviewProps {
  leads: Lead[];
  stages: Stage[];
}

export function PipelineOverview({ leads, stages }: PipelineOverviewProps) {
  const stageData = stages.map(stage => {
    const stageLeads = leads.filter(lead => lead.stageId === stage.id);
    const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
    const percentage = leads.length > 0 ? (stageLeads.length / leads.length) * 100 : 0;
    
    return {
      ...stage,
      count: stageLeads.length,
      value: stageValue,
      percentage
    };
  });

  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6 text-foreground">
        Visão Geral do Pipeline
      </h3>
      
      <div className="space-y-6">
        {stageData.map((stage) => (
          <div key={stage.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="font-medium text-foreground">{stage.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({stage.count} leads)
                </span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">
                  R$ {stage.value.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {((stage.value / totalValue) * 100 || 0).toFixed(1)}% do total
                </div>
              </div>
            </div>
            
            <Progress 
              value={stage.percentage} 
              className="h-2"
            />
            
            <div className="text-xs text-muted-foreground">
              {stage.percentage.toFixed(1)}% dos leads
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-foreground">Total Geral</span>
          <div className="text-right">
            <div className="font-bold text-lg text-foreground">
              R$ {totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              {leads.length} leads
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}