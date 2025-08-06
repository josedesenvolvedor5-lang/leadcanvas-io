import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

import { Lead, Stage } from '@/types/crm';
import { KanbanColumn } from './KanbanColumn';
import { LeadCard } from './LeadCard';

interface KanbanBoardProps {
  stages: Stage[];
  leads: Lead[];
  onLeadMove: (leadId: string, newStageId: string) => void;
  onLeadEdit: (lead: Lead) => void;
  onLeadDelete: (leadId: string) => void;
}

export function KanbanBoard({ 
  stages, 
  leads, 
  onLeadMove, 
  onLeadEdit, 
  onLeadDelete 
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const lead = leads.find(l => l.id === active.id);
    
    setActiveId(active.id as string);
    setDraggedLead(lead || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const leadId = active.id as string;
    const newStageId = over.id as string;

    // Check if we're dropping on a different stage
    const currentLead = leads.find(l => l.id === leadId);
    if (currentLead && currentLead.stageId !== newStageId) {
      onLeadMove(leadId, newStageId);
    }

    setActiveId(null);
    setDraggedLead(null);
  }

  // Group leads by stage
  const leadsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = leads.filter(lead => lead.stageId === stage.id);
    return acc;
  }, {} as Record<string, Lead[]>);

  // Calculate totals for each stage
  const stageTotals = stages.map(stage => {
    const stageLeads = leadsByStage[stage.id] || [];
    const total = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
    return { stageId: stage.id, count: stageLeads.length, total };
  });

  return (
    <div className="flex-1 p-6 bg-kanban-bg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Pipeline de Vendas</h2>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total de leads: {leads.length}</span>
          <span>Valor total: R$ {leads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}</span>
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          <SortableContext items={stages.map(s => s.id)}>
            {stages.map((stage) => {
              const stageLeads = leadsByStage[stage.id] || [];
              const stageTotal = stageTotals.find(t => t.stageId === stage.id);
              
              return (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  leads={stageLeads}
                  count={stageTotal?.count || 0}
                  total={stageTotal?.total || 0}
                  onLeadEdit={onLeadEdit}
                  onLeadDelete={onLeadDelete}
                />
              );
            })}
          </SortableContext>
        </div>

        {createPortal(
          <DragOverlay>
            {draggedLead && (
              <LeadCard 
                lead={draggedLead} 
                onEdit={() => {}} 
                onDelete={() => {}}
                isDragging 
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}