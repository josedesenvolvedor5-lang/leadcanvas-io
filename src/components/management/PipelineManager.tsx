import { useState } from 'react';
import { Pipeline, Stage } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PipelineManagerProps {
  pipelines: Pipeline[];
  onPipelineUpdate: (pipelines: Pipeline[]) => void;
}

export function PipelineManager({ pipelines, onPipelineUpdate }: PipelineManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stages: [] as Stage[]
  });
  const { toast } = useToast();

  const colors = [
    'hsl(210, 100%, 56%)', // Blue
    'hsl(142, 69%, 58%)', // Green
    'hsl(271, 91%, 65%)', // Purple
    'hsl(346, 87%, 65%)', // Pink
    'hsl(24, 95%, 53%)', // Orange
    'hsl(45, 93%, 47%)', // Yellow
    'hsl(0, 72%, 51%)', // Red
    'hsl(200, 95%, 50%)', // Cyan
  ];

  const openCreateDialog = () => {
    setEditingPipeline(null);
    setFormData({
      name: '',
      description: '',
      stages: [
        { id: 'stage-1', name: 'Novo Lead', color: colors[0], order: 1, pipelineId: '' }
      ]
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (pipeline: Pipeline) => {
    setEditingPipeline(pipeline);
    setFormData({
      name: pipeline.name,
      description: pipeline.description || '',
      stages: [...pipeline.stages]
    });
    setIsDialogOpen(true);
  };

  const addStage = () => {
    const newStage: Stage = {
      id: `stage-${Date.now()}`,
      name: '',
      color: colors[formData.stages.length % colors.length],
      order: formData.stages.length + 1,
      pipelineId: ''
    };
    
    setFormData(prev => ({
      ...prev,
      stages: [...prev.stages, newStage]
    }));
  };

  const updateStage = (index: number, field: keyof Stage, value: string) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === index ? { ...stage, [field]: value } : stage
      )
    }));
  };

  const removeStage = (index: number) => {
    if (formData.stages.length <= 1) {
      toast({
        title: "Erro",
        description: "Pipeline deve ter pelo menos uma etapa",
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.stages.some(s => !s.name)) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const pipelineId = editingPipeline?.id || `pipeline-${Date.now()}`;
    
    const pipeline: Pipeline = {
      id: pipelineId,
      name: formData.name,
      description: formData.description,
      isDefault: editingPipeline?.isDefault || false,
      stages: formData.stages.map((stage, index) => ({
        ...stage,
        id: stage.id || `stage-${Date.now()}-${index}`,
        pipelineId,
        order: index + 1
      })),
      createdAt: editingPipeline?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingPipeline) {
      onPipelineUpdate(pipelines.map(p => 
        p.id === editingPipeline.id ? pipeline : p
      ));
      toast({
        title: "Pipeline atualizada",
        description: "Pipeline foi atualizada com sucesso",
      });
    } else {
      onPipelineUpdate([...pipelines, pipeline]);
      toast({
        title: "Pipeline criada",
        description: "Nova pipeline foi criada com sucesso",
      });
    }

    setIsDialogOpen(false);
  };

  const deletePipeline = (id: string) => {
    const pipeline = pipelines.find(p => p.id === id);
    if (pipeline?.isDefault) {
      toast({
        title: "Erro",
        description: "Não é possível deletar a pipeline padrão",
        variant: "destructive",
      });
      return;
    }

    onPipelineUpdate(pipelines.filter(p => p.id !== id));
    toast({
      title: "Pipeline removida",
      description: "Pipeline foi removida com sucesso",
      variant: "destructive",
    });
  };

  const setDefaultPipeline = (id: string) => {
    onPipelineUpdate(pipelines.map(p => ({
      ...p,
      isDefault: p.id === id
    })));
    toast({
      title: "Pipeline padrão definida",
      description: "Pipeline padrão foi alterada com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gerenciar Pipelines</h2>
          <p className="text-muted-foreground">Crie e personalize seus funis de venda</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nova Pipeline
        </Button>
      </div>

      <div className="grid gap-4">
        {pipelines.map((pipeline) => (
          <Card key={pipeline.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                  {pipeline.isDefault && (
                    <Badge variant="secondary">Padrão</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(pipeline)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!pipeline.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePipeline(pipeline.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  {!pipeline.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultPipeline(pipeline.id)}
                    >
                      Definir como Padrão
                    </Button>
                  )}
                </div>
              </div>
              {pipeline.description && (
                <p className="text-sm text-muted-foreground">{pipeline.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pipeline.stages.map((stage, index) => (
                  <Badge
                    key={stage.id}
                    variant="outline"
                    style={{ 
                      backgroundColor: `${stage.color}20`,
                      borderColor: stage.color,
                      color: stage.color 
                    }}
                  >
                    {index + 1}. {stage.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPipeline ? 'Editar Pipeline' : 'Nova Pipeline'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Pipeline *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Vendas B2B"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o propósito desta pipeline..."
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Etapas da Pipeline</Label>
                <Button type="button" variant="outline" size="sm" onClick={addStage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Etapa
                </Button>
              </div>

              <div className="space-y-3">
                {formData.stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <Input
                        value={stage.name}
                        onChange={(e) => updateStage(index, 'name', e.target.value)}
                        placeholder={`Etapa ${index + 1}`}
                        required
                      />
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={stage.color}
                          onChange={(e) => updateStage(index, 'color', e.target.value)}
                          className="w-8 h-8 rounded border"
                        />
                        <span className="text-sm text-muted-foreground">Cor</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeStage(index)}
                          disabled={formData.stages.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                {editingPipeline ? 'Salvar Alterações' : 'Criar Pipeline'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}