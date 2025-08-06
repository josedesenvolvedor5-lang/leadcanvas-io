import { Lead, Stage } from '@/types/crm';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface StatsCardsProps {
  leads: Lead[];
  stages: Stage[];
}

export function StatsCards({ leads, stages }: StatsCardsProps) {
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  
  // Calculate won deals (assuming last stage is "won")
  const wonStage = stages[stages.length - 1];
  const wonLeads = leads.filter(lead => lead.stageId === wonStage?.id);
  const wonValue = wonLeads.reduce((sum, lead) => sum + lead.value, 0);
  const conversionRate = totalLeads > 0 ? (wonLeads.length / totalLeads) * 100 : 0;

  // Calculate average deal size
  const avgDealSize = totalLeads > 0 ? totalValue / totalLeads : 0;

  const stats = [
    {
      title: 'Total de Leads',
      value: totalLeads.toString(),
      subtitle: 'leads ativos',
      icon: Users,
      trend: '+12%',
      trendUp: true,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Valor Total',
      value: `R$ ${totalValue.toLocaleString()}`,
      subtitle: 'em oportunidades',
      icon: DollarSign,
      trend: '+8%',
      trendUp: true,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Taxa de Conversão',
      value: `${conversionRate.toFixed(1)}%`,
      subtitle: 'leads convertidos',
      icon: Target,
      trend: '+2.5%',
      trendUp: true,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${avgDealSize.toLocaleString()}`,
      subtitle: 'por lead',
      icon: TrendingUp,
      trend: '-5%',
      trendUp: false,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendUp ? ArrowUpRight : ArrowDownRight;
        
        return (
          <Card key={index} className="p-6 hover:shadow-elevation transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.subtitle}
                </p>
              </div>
              
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              <TrendIcon 
                className={`h-4 w-4 mr-1 ${
                  stat.trendUp ? 'text-green-600' : 'text-red-600'
                }`} 
              />
              <span 
                className={`text-xs font-medium ${
                  stat.trendUp ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                vs. mês anterior
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}