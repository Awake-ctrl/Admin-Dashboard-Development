import { UserManagement } from "../components/UserManagement";
import { RolesManagement } from "../components/RolesManagement";
import { CourseContentManagement } from "../components/CourseContentManagement";
import { FeedbackManagement } from "../components/FeedbackManagement";
import { AnalyticsDashboard } from "../components/AnalyticsDashboard";
import { Settings } from "../components/Settings";
import { SubscriptionManagement } from "../components/SubscriptionManagement";
import { TopicsManagement } from "../components/TopicsManagement";
import { LeaderboardManagement } from "../components/LeaderboardManagement";
import { NotificationManagement } from "../components/NotificationManagement";
import { AccountSettings } from "../components/AccountSettings";

// Auth Screens
import { LoginScreen } from "../components/auth/LoginScreen";
import { SignupScreen } from "../components/auth/SignupScreen";
import { ForgotPasswordScreen } from "../components/auth/ForgotPasswordScreen";

// Error States
import { Error404, ErrorNoInternet, ErrorAccessDenied, ErrorServer } from "../components/ui/ErrorStates";

// Empty States
import { 
  EmptyUsers, 
  EmptyCourses, 
  EmptyAnalytics, 
  EmptyContent,
  EmptyStateWithIllustration 
} from "../components/ui/EmptyStates";

export const demoScreens = {
  "login": LoginScreen,
  "signup": SignupScreen,
  "forgot-password": ForgotPasswordScreen,
  "404": Error404,
  "no-internet": ErrorNoInternet,
  "access-denied": ErrorAccessDenied,
  "server-error": ErrorServer
};

export const mainRoutes = {
  "analytics": AnalyticsDashboard,
  "users": UserManagement,
  "roles": RolesManagement,
  "subscriptions": SubscriptionManagement,
  "courses": CourseContentManagement,
  "topics": TopicsManagement,
  "content": CourseContentManagement,
  "leaderboard": LeaderboardManagement,
  "feedback": FeedbackManagement,
  "notifications": NotificationManagement,
  "settings": Settings,
  "support": FeedbackManagement,
  "account": AccountSettings,
  "empty-users": EmptyUsers,
  "empty-courses": EmptyCourses,
  "empty-analytics": EmptyAnalytics,
  "empty-content": EmptyContent,
  "empty-welcome": EmptyStateWithIllustration
};

export const sectionTitles = {
  "analytics": "Analytics Dashboard",
  "users": "User Management",
  "roles": "Roles Management",
  "subscriptions": "Subscription Management",
  "courses": "Courses & Content Management",
  "topics": "Topics & Subjects",
  "content": "Courses & Content Management",
  "leaderboard": "Student Leaderboard",
  "feedback": "Support & Feedback Center",
  "notifications": "Notification Management",
  "settings": "Platform Settings",
  "support": "Support & Feedback Center",
  "account": "Account Settings",
  "empty-users": "Empty State - No Users",
  "empty-courses": "Empty State - No Courses",
  "empty-analytics": "Empty State - No Analytics",
  "empty-content": "Empty State - No Content",
  "empty-welcome": "Empty State - Welcome"
};