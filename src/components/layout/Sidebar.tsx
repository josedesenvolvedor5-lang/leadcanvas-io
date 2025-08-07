import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Plus,
  GitBranch,
  Webhook,
  BarChart3,
  Menu,
  X,
  Bot,
  MessageSquare
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
  { id: 'leads', label: 'Leads', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-agents', label: 'Agentes IA', icon: Bot },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  { id: 'pipelines', label: 'Pipelines', icon: GitBranch },
  { id: 'custom-fields', label: 'Campos', icon: Settings },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "h-screen bg-sidebar-bg border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CRM Pro
            </h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-accent"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>
      </div>

      <nav className="px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 hover:bg-accent transition-colors",
                isCollapsed && "justify-center px-2",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-2">
        <Button 
          className="w-full gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
          onClick={() => onViewChange('new-lead')}
        >
          <Plus size={16} />
          {!isCollapsed && "Novo Lead"}
        </Button>
      </div>
    </div>
  );
}