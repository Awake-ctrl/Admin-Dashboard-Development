import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown } from "lucide-react";
import { SidebarItem } from "./SidebarItem";

interface CollapsibleSectionProps {
  section: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    items: Array<{
      id: string;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
    }>;
  };
  onItemClick: (itemId: string) => void;
}

export function CollapsibleSection({ section, onItemClick }: CollapsibleSectionProps) {
  const Icon = section.icon;
  
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-3 mb-1">
          <div className="flex items-center gap-3 w-full">
            <Icon className="h-4 w-4 shrink-0" />
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm">{section.label}</span>
                <ChevronDown className="h-3 w-3" />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {section.description}
              </div>
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-1">
        {section.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={false}
            isDemoMode={true}
            onClick={() => onItemClick(item.id)}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}