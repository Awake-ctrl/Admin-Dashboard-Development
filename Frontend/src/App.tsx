import { useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { demoScreens, mainRoutes, sectionTitles } from "./config/routeConfig";
import { Toaster } from "sonner";

export default function App() {
  const [activeSection, setActiveSection] = useState("analytics");
  const [demoMode, setDemoMode] = useState<string | null>(null);

  // Demo mode for showing different screens
  if (demoMode && demoScreens[demoMode as keyof typeof demoScreens]) {
    const DemoScreen = demoScreens[demoMode as keyof typeof demoScreens];
    return <DemoScreen />;
  }

  const renderContent = () => {
    const RouteComponent = mainRoutes[activeSection as keyof typeof mainRoutes];
    
    // Special handling for course-content to pass default tab
    if (activeSection === "course-content") {
      const CourseContentComponent = RouteComponent as React.FC<{ defaultTab?: "courses" | "content" }>;
      return <CourseContentComponent defaultTab="courses" />;
    }
    
    return RouteComponent ? <RouteComponent /> : <mainRoutes.analytics />;
  };

  const getSectionTitle = () => {
    return sectionTitles[activeSection as keyof typeof sectionTitles] || "Dashboard";
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onDemoModeChange={setDemoMode}
      />
      <Toaster position="top-right" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
          <h1 className="text-foreground">{getSectionTitle()}</h1>
          <div className="text-muted-foreground text-sm">
            Welcome back, Admin
          </div>
        </div>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}