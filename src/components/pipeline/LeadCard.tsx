import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '@/types/crm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Building2, 
  Mail, 
  Phone, 
  DollarSign 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  isDragging?: boolean;
}

export function LeadCard({ lead, onEdit, onDelete, isDragging = false }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 cursor-grab hover:shadow-elevation transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2 shadow-lg' : ''
      }`}
    >
      <div className="space-y-3">
        {/* Header with company name and actions */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-foreground truncate">
              {lead.name}
            </h4>
            {lead.company && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Building2 size={12} />
                <span className="truncate">{lead.company}</span>
              </div>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 hover:bg-accent"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(lead)}>
                <Edit size={12} className="mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(lead.id)}
                className="text-destructive"
              >
                <Trash2 size={12} className="mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contact info */}
        <div className="space-y-1">
          {lead.email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail size={12} />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone size={12} />
              <span>{lead.phone}</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DollarSign size={12} className="text-green-600" />
            <span className="text-sm font-medium text-green-600">
              R$ {lead.value.toLocaleString()}
            </span>
          </div>
          
          {lead.assignedTo && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(lead.assignedTo)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Source */}
        {lead.source && (
          <Badge variant="outline" className="text-xs w-fit">
            {lead.source}
          </Badge>
        )}

        {/* Notes preview */}
        {lead.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {lead.notes}
          </p>
        )}
      </div>
    </Card>
  );
}