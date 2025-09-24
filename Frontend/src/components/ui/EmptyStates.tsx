import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  FileText, 
  MessageSquare,
  Trophy,
  Bell,
  CreditCard,
  Search,
  Plus,
  Upload,
  Database,
  Calendar
} from "lucide-react";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: React.ReactNode;
}

// Generic Empty State Component
export function EmptyState({ 
  icon: Icon = Database, 
  title, 
  description, 
  primaryAction, 
  secondaryAction,
  illustration
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="space-y-6 max-w-md">
        {illustration || (
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Icon className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-xl">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {primaryAction && (
            <Button 
              onClick={primaryAction.onClick}
              variant={primaryAction.variant || "default"}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Specific Empty States for Different Sections

export function EmptyUsers() {
  return (
    <EmptyState
      icon={Users}
      title="No Users Found"
      description="There are no users in the system yet. Start by adding your first user or importing users from a CSV file."
      primaryAction={{
        label: "Add First User",
        onClick: () => console.log("Add user clicked")
      }}
      secondaryAction={{
        label: "Import Users",
        onClick: () => console.log("Import users clicked")
      }}
    />
  );
}

export function EmptyCourses() {
  return (
    <EmptyState
      icon={BookOpen}
      title="No Courses Available"
      description="Get started by creating your first course. You can add videos, assignments, and track student progress."
      primaryAction={{
        label: "Create Course",
        onClick: () => console.log("Create course clicked")
      }}
      secondaryAction={{
        label: "Browse Templates",
        onClick: () => console.log("Browse templates clicked")
      }}
    />
  );
}

export function EmptyAnalytics() {
  return (
    <EmptyState
      icon={BarChart3}
      title="No Analytics Data"
      description="Analytics data will appear here once students start engaging with your courses and taking assessments."
      primaryAction={{
        label: "View Getting Started Guide",
        onClick: () => console.log("Getting started clicked")
      }}
    />
  );
}

export function EmptyContent() {
  return (
    <EmptyState
      icon={FileText}
      title="No Content Available"
      description="Upload your first educational content like videos, PDFs, or create interactive lessons to get started."
      primaryAction={{
        label: "Upload Content",
        onClick: () => console.log("Upload content clicked")
      }}
      secondaryAction={{
        label: "Create Lesson",
        onClick: () => console.log("Create lesson clicked")
      }}
    />
  );
}

export function EmptyFeedback() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No Feedback Yet"
      description="Student feedback and reviews will appear here. Encourage students to share their thoughts about courses."
      primaryAction={{
        label: "Send Feedback Request",
        onClick: () => console.log("Send feedback request clicked")
      }}
    />
  );
}

export function EmptyLeaderboard() {
  return (
    <EmptyState
      icon={Trophy}
      title="No Rankings Available"
      description="The leaderboard will show student rankings based on test scores and course completion once assessments are taken."
      primaryAction={{
        label: "Create Assessment",
        onClick: () => console.log("Create assessment clicked")
      }}
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon={Bell}
      title="No Notifications"
      description="System notifications and alerts will appear here. You can also create custom notifications for students."
      primaryAction={{
        label: "Create Notification",
        onClick: () => console.log("Create notification clicked")
      }}
    />
  );
}

export function EmptySubscriptions() {
  return (
    <EmptyState
      icon={CreditCard}
      title="No Active Subscriptions"
      description="Student subscription information and billing details will be displayed here once users start subscribing."
      primaryAction={{
        label: "View Pricing Plans",
        onClick: () => console.log("View pricing clicked")
      }}
    />
  );
}

export function EmptySearchResults({ searchQuery }: { searchQuery: string }) {
  return (
    <EmptyState
      icon={Search}
      title={`No results for "${searchQuery}"`}
      description="Try adjusting your search terms or filters to find what you're looking for."
      primaryAction={{
        label: "Clear Search",
        onClick: () => console.log("Clear search clicked"),
        variant: "outline"
      }}
    />
  );
}

export function EmptyAssessments() {
  return (
    <EmptyState
      icon={FileText}
      title="No Assessments Created"
      description="Create your first assessment to start evaluating student performance and track learning progress."
      primaryAction={{
        label: "Create Assessment",
        onClick: () => console.log("Create assessment clicked")
      }}
      secondaryAction={{
        label: "Import Questions",
        onClick: () => console.log("Import questions clicked")
      }}
    />
  );
}

// Empty State with Custom Illustration
export function EmptyStateWithIllustration() {
  const illustration = (
    <div className="w-48 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto">
      <div className="text-center">
        <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-2" />
        <div className="text-xs text-muted-foreground">Educational Platform</div>
      </div>
    </div>
  );

  return (
    <EmptyState
      title="Welcome to EduAdmin"
      description="Your educational platform is ready! Start by creating courses, adding content, and inviting students to join your learning community."
      primaryAction={{
        label: "Get Started",
        onClick: () => console.log("Get started clicked")
      }}
      secondaryAction={{
        label: "Watch Tutorial",
        onClick: () => console.log("Watch tutorial clicked")
      }}
      illustration={illustration}
    />
  );
}

// Loading Empty State (Skeleton)
export function EmptyStateLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="space-y-4 w-full max-w-md">
        <div className="w-20 h-20 bg-muted rounded-full mx-auto animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded mx-auto w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded mx-auto w-64 animate-pulse" />
          <div className="h-4 bg-muted rounded mx-auto w-52 animate-pulse" />
        </div>
        <div className="flex gap-3 justify-center pt-4">
          <div className="h-9 bg-muted rounded w-24 animate-pulse" />
          <div className="h-9 bg-muted rounded w-20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Mini Empty State for smaller components
interface MiniEmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function MiniEmptyState({ icon: Icon, title, description, action }: MiniEmptyStateProps) {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h4 className="text-sm mb-1">{title}</h4>
      {description && (
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
      )}
      {action && (
        <Button size="sm" variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}