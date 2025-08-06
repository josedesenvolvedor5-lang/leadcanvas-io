import { useState } from 'react';
import { CustomField } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, GripVertical, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomFieldManagerProps {
  customFields: CustomField[];
  onFieldsUpdate: (fields: CustomField[]) => void;
}

export function CustomFieldManager({ customFields, onFieldsUpdate }: CustomFieldManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'text' as CustomField['type'],
    options: [] as string[],
    required: false,
    newOption: ''
  });
  const { toast } = useToast();

  const fieldTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'date', label: 'Data' },
    { value: 'select', label: 'Lista de Opções' },
    { value: 'textarea', label: 'Texto Longo' },
    { value: 'boolean', label: 'Sim/Não' },
  ];

  const openCreateDialog = () => {
    setEditingField(null);
    setFormData({
      name: '',
      type: 'text',
      options: [],
      required: false,
      newOption: ''
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (field: CustomField) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      type: field.type,
      options: field.options || [],
      required: field.required,
      newOption: ''
    });
    setIsDialogOpen(true);
  };

  const addOption = () => {
    if (!formData.newOption.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, prev.newOption.trim()],
      newOption: ''
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do campo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (formData.type === 'select' && formData.options.length === 0) {
      toast({
        title: "Erro",
        description: "Campos de lista precisam ter pelo menos uma opção",
        variant: "destructive",
      });
      return;
    }

    const field: CustomField = {
      id: editingField?.id || `field-${Date.now()}`,
      name: formData.name.trim(),
      type: formData.type,
      options: formData.type === 'select' ? formData.options : undefined,
      required: formData.required,
      order: editingField?.order || customFields.length + 1
    };

    if (editingField) {
      onFieldsUpdate(customFields.map(f => 
        f.id === editingField.id ? field : f
      ));
      toast({
        title: "Campo atualizado",
        description: "Campo personalizado foi atualizado com sucesso",
      });
    } else {
      onFieldsUpdate([...customFields, field]);
      toast({
        title: "Campo criado",
        description: "Novo campo personalizado foi criado com sucesso",
      });
    }

    setIsDialogOpen(false);
  };

  const deleteField = (id: string) => {
    onFieldsUpdate(customFields.filter(f => f.id !== id));
    toast({
      title: "Campo removido",
      description: "Campo personalizado foi removido com sucesso",
      variant: "destructive",
    });
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...customFields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    
    // Update order
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      order: index + 1
    }));

    onFieldsUpdate(updatedFields);
  };

  const getFieldTypeLabel = (type: CustomField['type']) => {
    return fieldTypes.find(ft => ft.value === type)?.label || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Campos Personalizados</h2>
          <p className="text-muted-foreground">Configure campos adicionais para seus leads</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Campo
        </Button>
      </div>

      {customFields.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Nenhum campo personalizado criado ainda</p>
          <Button onClick={openCreateDialog} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Campo
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {customFields
            .sort((a, b) => a.order - b.order)
            .map((field, index) => (
              <Card key={field.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{field.name}</span>
                          {field.required && (
                            <Badge variant="secondary" className="text-xs">Obrigatório</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Tipo: {getFieldTypeLabel(field.type)}</span>
                          {field.options && (
                            <span>• {field.options.length} opções</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(field)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {field.options && field.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {field.options.map((option, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingField ? 'Editar Campo' : 'Novo Campo Personalizado'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Campo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Origem do Lead"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo do Campo *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: CustomField['type']) => 
                  setFormData(prev => ({ ...prev, type: value, options: [] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'select' && (
              <div className="space-y-3">
                <Label>Opções da Lista</Label>
                
                <div className="flex gap-2">
                  <Input
                    value={formData.newOption}
                    onChange={(e) => setFormData(prev => ({ ...prev, newOption: e.target.value }))}
                    placeholder="Digite uma opção..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                  />
                  <Button type="button" onClick={addOption} disabled={!formData.newOption.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.options.length > 0 && (
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span>{option}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={formData.required}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
              />
              <Label htmlFor="required">Campo obrigatório</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                {editingField ? 'Salvar Alterações' : 'Criar Campo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}