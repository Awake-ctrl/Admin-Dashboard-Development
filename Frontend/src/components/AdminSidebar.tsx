import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { BookOpen, HelpCircle } from "lucide-react";
import { SidebarItem } from "./sidebar/SidebarItem";
import { CollapsibleSection } from "./sidebar/CollapsibleSection";
import { sidebarSections, collapsibleSections } from "./sidebar/sidebarConfig";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onDemoModeChange?: (mode: string | null) => void;
}

export function AdminSidebar({ activeSection, onSectionChange, onDemoModeChange }: AdminSidebarProps) {
  const handleItemClick = (itemId: string) => {
    onSectionChange(itemId);
    if (onDemoModeChange) {
      onDemoModeChange(null);
    }
  };

  const handleDemoItemClick = (itemId: string) => {
    if (onDemoModeChange) {
      onDemoModeChange(itemId);
    }
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <div className="text-sidebar-foreground">EduAdmin</div>
            <div className="text-xs text-sidebar-foreground/70">AI Tutoring Platform</div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Main Sections */}
          {sidebarSections.map((section) => (
            <div key={section.id}>
              <div className="text-xs text-sidebar-foreground/70 mb-3 px-2">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isActive={activeSection === item.id}
                    onClick={() => handleItemClick(item.id)}
                  />
                ))}
              </div>
              <Separator className="bg-sidebar-border mt-6" />
            </div>
          ))}

          {/* Collapsible Demo Sections */}
          {collapsibleSections.map((section) => (
            <CollapsibleSection
              key={section.id}
              section={section}
              onItemClick={handleDemoItemClick}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-lg p-3">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-4 w-4 text-sidebar-accent-foreground mt-0.5" />
            <div>
              <div className="text-sm text-sidebar-accent-foreground mb-1">
                Need Help?
              </div>
              <div className="text-xs text-sidebar-accent-foreground/70 mb-2">
                Check our documentation for admin guides and API references.
              </div>
              <Button size="sm" variant="outline" className="h-6 text-xs">
                View Docs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}