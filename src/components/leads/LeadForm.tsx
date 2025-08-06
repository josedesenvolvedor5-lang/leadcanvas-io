import { useState } from 'react';
import { Lead, Pipeline, CustomField } from '@/types/crm';
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
import { Card } from '@/components/ui/card';

interface LeadFormProps {
  lead?: Lead;
  pipelines: Pipeline[];
  customFields: CustomField[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
}

export function LeadForm({ 
  lead, 
  pipelines, 
  customFields, 
  isOpen, 
  onClose, 
  onSave 
}: LeadFormProps) {
  const [formData, setFormData] = useState<Partial<Lead>>(() => ({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    company: lead?.company || '',
    value: lead?.value || 0,
    pipelineId: lead?.pipelineId || pipelines[0]?.id || '',
    stageId: lead?.stageId || pipelines[0]?.stages[0]?.id || '',
    assignedTo: lead?.assignedTo || '',
    source: lead?.source || '',
    notes: lead?.notes || '',
    customFields: lead?.customFields || {},
  }));

  const selectedPipeline = pipelines.find(p => p.id === formData.pipelineId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.value) {
      return;
    }

    onSave({
      ...formData,
      id: lead?.id || `lead-${Date.now()}`,
      createdAt: lead?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    onClose();
  };

  const handlePipelineChange = (pipelineId: string) => {
    const pipeline = pipelines.find(p => p.id === pipelineId);
    setFormData(prev => ({
      ...prev,
      pipelineId,
      stageId: pipeline?.stages[0]?.id || '',
    }));
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldId]: value,
      },
    }));
  };

  const renderCustomField = (field: CustomField) => {
    const value = formData.customFields?.[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            placeholder={`Digite ${field.name.toLowerCase()}`}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, Number(e.target.value))}
            placeholder={`Digite ${field.name.toLowerCase()}`}
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
          />
        );
      
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleCustomFieldChange(field.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Selecione ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            placeholder={`Digite ${field.name.toLowerCase()}`}
            rows={3}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 text-foreground">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Lead *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome ou empresa"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Nome da empresa"
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contato@empresa.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <Label htmlFor="value">Valor do Deal *</Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                  placeholder="0"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="source">Origem</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="Website, LinkedIn, etc."
                />
              </div>
            </div>
          </Card>

          {/* Pipeline and Stage */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 text-foreground">Pipeline e Etapa</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pipeline">Pipeline</Label>
                <Select value={formData.pipelineId} onValueChange={handlePipelineChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelines.map((pipeline) => (
                      <SelectItem key={pipeline.id} value={pipeline.id}>
                        {pipeline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="stage">Etapa</Label>
                <Select 
                  value={formData.stageId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, stageId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedPipeline?.stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4 text-foreground">Campos Personalizados</h3>
              <div className="grid grid-cols-2 gap-4">
                {customFields.map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={`custom-${field.id}`}>
                      {field.name}
                      {field.required && ' *'}
                    </Label>
                    {renderCustomField(field)}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 text-foreground">Observações</h3>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Adicione observações sobre este lead..."
              rows={4}
            />
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {lead ? 'Salvar Alterações' : 'Criar Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}