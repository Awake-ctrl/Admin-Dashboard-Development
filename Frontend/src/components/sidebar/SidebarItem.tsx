import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface SidebarItemProps {
  item: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
    badge?: string;
  };
  isActive: boolean;
  isDemoMode?: boolean;
  onClick: () => void;
}

export function SidebarItem({ item, isActive, isDemoMode = false, onClick }: SidebarItemProps) {
  const Icon = item.icon;
  
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start h-auto p-3 mb-1",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        isDemoMode && "text-xs py-2"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 w-full">
        <Icon className={cn("shrink-0", isDemoMode ? "h-3 w-3" : "h-4 w-4")} />
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <span className={isDemoMode ? "text-xs" : "text-sm"}>{item.label}</span>
            {item.badge && !isDemoMode && (
              <Badge 
                variant={item.badge === "New" ? "default" : "secondary"} 
                className="text-xs h-5"
              >
                {item.badge}
              </Badge>
            )}
          </div>
          {item.description && !isDemoMode && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {item.description}
            </div>
          )}
        </div>
      </div>
    </Button>
  );
}