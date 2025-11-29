import { useState, useEffect } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { demoScreens, mainRoutes, sectionTitles } from "./config/routeConfig";
// import { Toaster } from "./components/ui/sonner";
import { LoginScreen } from "./components/auth/LoginScreen";
import { SignupScreen } from "./components/auth/SignupScreen";
import { ForgotPasswordScreen } from "./components/auth/ForgotPasswordScreen";
import { Toaster } from "./components/ui/toaster"
import { requestAndGetToken, listenForMessages } from "./firebase";
import { notificationService } from "./components/api/notificationService";

const VAPID_KEY = "BN3-3LlIsx3dTC-hGXJISCIoaKDbr1bRulu9ZWkbHmwI_UyXTt8q9XH6Ti2YjLJnx3hJCrtSXhVpWnJ-atuzQhg";
export default function App() {
  const [activeSection, setActiveSection] = useState("analytics");
  const [demoMode, setDemoMode] = useState<string | null>(null);
  const [authScreen, setAuthScreen] = useState<"login" | "signup" | "forgot-password" | null>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
  async function registerToken() {
    if (!("serviceWorker" in navigator)) return;
    const token = await requestAndGetToken(VAPID_KEY);
    if (token) {
      // Send token to your backend to save in DB
      await fetch("/api/device-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, platform: "web" })
      });
    }
  }
  registerToken();

  // handle foreground messages
  listenForMessages((payload) => {
    console.log("Message received. ", payload);
    // show an in-app toast / update notifications list
    // e.g., toast(payload.notification?.title)
  });
}, []);

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user_data");
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setAuthScreen(null);
    } else {
      setAuthScreen("login");
    }
  }, []);

  // Handle login
  const handleLogin = async (userData: any) => {
    // In a real app, you would validate credentials with backend
    // For demo, we'll simulate successful login
    setIsAuthenticated(true);
    setUser(userData);
    setAuthScreen(null);
    
    // Store in localStorage for persistence
    localStorage.setItem("auth_token", "demo_token");
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAuthScreen("login");
    
    // Clear localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  };

  // Handle signup
  const handleSignup = async (userData: any) => {
    // In a real app, you would send data to backend
    // For demo, we'll simulate successful signup and auto-login
    await handleLogin(userData);
  };

  // Handle password reset
  const handlePasswordReset = async (email: string) => {
    // In a real app, you would call backend API
    console.log("Password reset requested for:", email);
  };

  // Demo mode for showing different screens
  if (demoMode && demoScreens[demoMode as keyof typeof demoScreens]) {
    const DemoScreen = demoScreens[demoMode as keyof typeof demoScreens];
    return <DemoScreen />;
  }

  // Show authentication screens if not authenticated
  if (!isAuthenticated) {
    if (authScreen === "login") {
      return (
        <>
          <LoginScreen 
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthScreen("signup")}
            onSwitchToForgotPassword={() => setAuthScreen("forgot-password")}
          />
          <Toaster />
        </>
      );
    }

    if (authScreen === "signup") {
      return (
        <>
          <SignupScreen 
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthScreen("login")}
          />
          <Toaster />
        </>
      );
    }

    if (authScreen === "forgot-password") {
      return (
        <>
          <ForgotPasswordScreen 
            onResetPassword={handlePasswordReset}
            onSwitchToLogin={() => setAuthScreen("login")}
          />
          <Toaster />
        </>
      );
    }
  }

  const renderContent = () => {
    const RouteComponent = mainRoutes[activeSection as keyof typeof mainRoutes];
    return RouteComponent ? <RouteComponent /> : <mainRoutes.analytics />;
  };

  const getSectionTitle = () => {
    return sectionTitles[activeSection as keyof typeof sectionTitles] || "Dashboard";
  };

  return (
    <>
      <div className="h-screen flex bg-background">
        {/* Sidebar */}
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          onDemoModeChange={setDemoMode}
          onLogout={handleLogout}
          user={user}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
            <h1 className="text-foreground">{getSectionTitle()}</h1>
            <div className="text-muted-foreground text-sm">
              Welcome back, {user?.name || "Admin"}
            </div>
          </div>
          
          {/* Dashboard Content */}
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );


}