import { 
  BarChart3, 
  Users, 
  CreditCard, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Trophy, 
  Bell, 
  Settings, 
  GitBranch,
  LifeBuoy,
  User,
  LogIn,
  UserPlus,
  KeyRound,
  AlertTriangle,
  Wifi,
  Shield,
  Server,
  Database,
  UserCog
} from "lucide-react";

export const mainMenuItems = [
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Platform performance metrics"
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    description: "User accounts & management",
    badge: "12.8K"
  },
  {
    id: "roles",
    label: "Roles",
    icon: UserCog,
    description: "Role-based access control",
    badge: "6"
  },
  {
    id: "subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
    description: "Subscription & billing",
    badge: "₹2.4M"
  },
  {
    id: "courses",
    label: "Courses",
    icon: BookOpen,
    description: "Courses & content library"
  },
  // {
  //   id: "topics",
  //   label: "Topics",
  //   icon: GitBranch,
  //   description: "Subject hierarchy"
  // }
];

export const engagementItems = [
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: Trophy,
    description: "Student rankings"
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Push notifications",
    badge: "New"
  }
];

export const systemItems = [
  {
    id: "support",
    label: "Support & Feedback",
    icon: LifeBuoy,
    description: "Tickets, reviews & refunds",
    badge: "15"
  },
  {
    id: "account",
    label: "Account",
    icon: User,
    description: "Profile & preferences"
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Platform configuration"
  }
];

export const authDemoItems = [
  { id: "login", label: "Login Screen", icon: LogIn },
  { id: "signup", label: "Signup Screen", icon: UserPlus },
  { id: "forgot-password", label: "Forgot Password", icon: KeyRound }
];

export const errorDemoItems = [
  { id: "404", label: "404 Not Found", icon: AlertTriangle },
  { id: "no-internet", label: "No Internet", icon: Wifi },
  { id: "access-denied", label: "Access Denied", icon: Shield },
  { id: "server-error", label: "Server Error", icon: Server }
];

export const emptyStateDemoItems = [
  { id: "empty-users", label: "No Users", icon: Users },
  { id: "empty-courses", label: "No Courses", icon: BookOpen },
  { id: "empty-analytics", label: "No Analytics", icon: BarChart3 },
  { id: "empty-content", label: "No Content", icon: FileText },
  { id: "empty-welcome", label: "Welcome Screen", icon: Database }
];

export const sidebarSections = [
  {
    id: "main",
    title: "CORE MANAGEMENT",
    items: mainMenuItems
  },
  {
    id: "engagement",
    title: "STUDENT ENGAGEMENT", 
    items: engagementItems
  },
  {
    id: "system",
    title: "SYSTEM & SUPPORT",
    items: systemItems
  }
];

export const collapsibleSections = [
  {
    id: "auth",
    label: "Auth Screens",
    icon: LogIn,
    description: "Login, signup, reset",
    items: authDemoItems
  },
  // {
  //   id: "errors", 
  //   label: "Error States",
  //   icon: AlertTriangle,
  //   description: "404, server errors",
  //   items: errorDemoItems
  // },
  // {
  //   id: "empty",
  //   label: "Empty States", 
  //   icon: Database,
  //   description: "No data scenarios",
  //   items: emptyStateDemoItems
  // }
];