import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead, Stage } from '@/types/crm';
import { LeadCard } from './LeadCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
  stage: Stage;
  leads: Lead[];
  count: number;
  total: number;
  onLeadEdit: (lead: Lead) => void;
  onLeadDelete: (leadId: string) => void;
}

export function KanbanColumn({ 
  stage, 
  leads, 
  count, 
  total, 
  onLeadEdit, 
  onLeadDelete 
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div className="flex flex-col w-80 min-w-80">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <h3 className="font-semibold text-foreground">{stage.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Valor total: R$ {total.toLocaleString()}
        </div>
      </div>

      <Card 
        ref={setNodeRef}
        className={`flex-1 p-3 min-h-96 transition-colors duration-200 ${
          isOver ? 'bg-accent/50 border-primary' : 'bg-card'
        }`}
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={onLeadEdit}
                onDelete={onLeadDelete}
              />
            ))}
            {leads.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Nenhum lead nesta etapa
              </div>
            )}
          </div>
        </SortableContext>
      </Card>
    </div>
  );
}