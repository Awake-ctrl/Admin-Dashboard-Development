import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, BookOpen, CreditCard, MessageCircle, BarChart3, Settings, UserCheck, PlayCircle, Trophy, Bell, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

const workflowSteps = [
  {
    id: "registration",
    title: "User Registration",
    description: "Student signs up and selects exam type",
    icon: Users,
    color: "bg-blue-500",
    position: { x: 50, y: 100 },
    inputs: ["Email/Phone", "Exam Type (JEE/NEET/UPSC/etc.)", "Basic Profile Info"],
    outputs: ["User Account Created", "Welcome Email Sent"],
    nextSteps: ["subscription"]
  },
  {
    id: "subscription",
    title: "Subscription Selection",
    description: "Choose and purchase subscription plan",
    icon: CreditCard,
    color: "bg-green-500",
    position: { x: 300, y: 100 },
    inputs: ["Plan Selection", "Payment Details", "Billing Info"],
    outputs: ["Active Subscription", "Payment Confirmation", "Access Granted"],
    nextSteps: ["onboarding"]
  },
  {
    id: "onboarding",
    title: "User Onboarding",
    description: "Initial setup and exam preparation assessment",
    icon: UserCheck,
    color: "bg-purple-500",
    position: { x: 550, y: 100 },
    inputs: ["Goal Setting", "Current Level Assessment", "Study Preferences"],
    outputs: ["Personalized Study Plan", "Recommended Courses", "Progress Baseline"],
    nextSteps: ["learning"]
  },
  {
    id: "learning",
    title: "Learning Process",
    description: "Access content, videos, and study materials",
    icon: PlayCircle,
    color: "bg-orange-500",
    position: { x: 200, y: 300 },
    inputs: ["Course Access", "Video Lectures", "Study Notes", "Practice Sets"],
    outputs: ["Progress Tracking", "Completion Status", "Time Spent Data"],
    nextSteps: ["assessment", "support"]
  },
  {
    id: "assessment",
    title: "Assessment & Testing",
    description: "Take tests, quizzes, and mock exams",
    icon: BookOpen,
    color: "bg-red-500",
    position: { x: 400, y: 300 },
    inputs: ["Test Questions", "Answer Submissions", "Time Limits"],
    outputs: ["Scores", "Performance Analysis", "Weak Areas Identified"],
    nextSteps: ["analytics", "leaderboard"]
  },
  {
    id: "leaderboard",
    title: "Leaderboard & Competition",
    description: "Track rankings and compete with peers",
    icon: Trophy,
    color: "bg-yellow-500",
    position: { x: 600, y: 300 },
    inputs: ["Test Scores", "Completion Rates", "Study Hours"],
    outputs: ["Ranking Updates", "Achievement Badges", "Motivation Metrics"],
    nextSteps: ["notifications"]
  },
  {
    id: "support",
    title: "Support System",
    description: "Help, queries, and issue resolution",
    icon: MessageCircle,
    color: "bg-cyan-500",
    position: { x: 50, y: 500 },
    inputs: ["User Queries", "Technical Issues", "Refund Requests"],
    outputs: ["Support Tickets", "Query Resolution", "User Satisfaction"],
    nextSteps: ["analytics"]
  },
  {
    id: "notifications",
    title: "Notification System",
    description: "Alerts, reminders, and updates",
    icon: Bell,
    color: "bg-indigo-500",
    position: { x: 300, y: 500 },
    inputs: ["User Activity", "Scheduled Events", "System Updates"],
    outputs: ["Push Notifications", "Email Alerts", "In-app Messages"],
    nextSteps: ["analytics"]
  },
  {
    id: "analytics",
    title: "Analytics & Insights",
    description: "Performance tracking and data analysis",
    icon: BarChart3,
    color: "bg-pink-500",
    position: { x: 550, y: 500 },
    inputs: ["User Data", "Performance Metrics", "Engagement Stats"],
    outputs: ["Detailed Reports", "Trend Analysis", "Actionable Insights"],
    nextSteps: ["optimization"]
  },
  {
    id: "optimization",
    title: "Platform Optimization",
    description: "Continuous improvement and updates",
    icon: Settings,
    color: "bg-gray-500",
    position: { x: 400, y: 650 },
    inputs: ["Analytics Data", "User Feedback", "Performance Metrics"],
    outputs: ["Platform Updates", "Feature Enhancements", "Bug Fixes"],
    nextSteps: ["learning"]
  }
];

const statusTypes = [
  { name: "Active", color: "bg-green-500", icon: CheckCircle },
  { name: "Processing", color: "bg-yellow-500", icon: RefreshCw },
  { name: "Attention Required", color: "bg-red-500", icon: AlertCircle }
];

export function WorkflowDiagram() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Workflow Overview</CardTitle>
          <CardDescription>
            Complete process flow of the AI tutoring platform for competitive exam preparation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Status Legend */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="text-sm">Status Legend:</div>
            {statusTypes.map((status) => (
              <div key={status.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                <span className="text-sm">{status.name}</span>
              </div>
            ))}
          </div>

          {/* Workflow Diagram */}
          <div className="relative bg-gray-50 rounded-lg p-6 min-h-[800px] overflow-auto">
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              {/* Connection Lines */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                </marker>
              </defs>
              
              {/* Registration to Subscription */}
              <line x1="150" y1="150" x2="250" y2="150" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Subscription to Onboarding */}
              <line x1="400" y1="150" x2="500" y2="150" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Onboarding to Learning */}
              <line x1="550" y1="200" x2="300" y2="250" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Learning to Assessment */}
              <line x1="300" y1="350" x2="350" y2="350" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Assessment to Leaderboard */}
              <line x1="500" y1="350" x2="550" y2="350" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Learning to Support */}
              <line x1="200" y1="400" x2="150" y2="450" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Support to Analytics */}
              <line x1="150" y1="550" x2="500" y2="550" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Leaderboard to Notifications */}
              <line x1="600" y1="400" x2="400" y2="450" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Analytics to Optimization */}
              <line x1="550" y1="600" x2="450" y2="650" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Optimization back to Learning (feedback loop) */}
              <path d="M 350 700 Q 100 750 150 350" stroke="#666" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowhead)" />
            </svg>

            {/* Workflow Nodes */}
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="absolute bg-white rounded-lg shadow-lg border p-4 min-w-[200px]"
                  style={{ 
                    left: step.position.x, 
                    top: step.position.y,
                    zIndex: 2
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${step.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm">{step.title}</h4>
                      <Badge variant="outline" className="text-xs mt-1">
                        {step.id}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{step.description}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs">Inputs:</div>
                      <div className="text-xs text-muted-foreground">
                        {step.inputs.slice(0, 2).join(", ")}
                        {step.inputs.length > 2 && "..."}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs">Outputs:</div>
                      <div className="text-xs text-muted-foreground">
                        {step.outputs.slice(0, 2).join(", ")}
                        {step.outputs.length > 2 && "..."}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Process Steps */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workflowSteps.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${step.color} text-white`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <CardTitle className="text-sm">{step.title}</CardTitle>
                </div>
                <CardDescription className="text-xs">{step.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div>
                  <div className="text-xs">Inputs:</div>
                  <ul className="text-xs text-muted-foreground">
                    {step.inputs.map((input, index) => (
                      <li key={index}>• {input}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs">Outputs:</div>
                  <ul className="text-xs text-muted-foreground">
                    {step.outputs.map((output, index) => (
                      <li key={index}>• {output}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs">Next Steps:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {step.nextSteps.map((nextStep) => (
                      <Badge key={nextStep} variant="outline" className="text-xs">
                        {nextStep}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Process Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Process Health Metrics</CardTitle>
          <CardDescription>Key performance indicators for each workflow step</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm">User Registration</div>
              <div className="text-2xl text-green-600">94.2%</div>
              <div className="text-xs text-muted-foreground">Completion Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">Subscription Conversion</div>
              <div className="text-2xl text-blue-600">67.8%</div>
              <div className="text-xs text-muted-foreground">Free to Paid</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">Learning Engagement</div>
              <div className="text-2xl text-orange-600">82.3%</div>
              <div className="text-xs text-muted-foreground">Daily Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">Support Resolution</div>
              <div className="text-2xl text-cyan-600">96.1%</div>
              <div className="text-xs text-muted-foreground">Within 24 Hours</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}