import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Alert, AlertDescription } from "./alert";
import { 
  AlertTriangle, 
  Wifi, 
  Shield, 
  RefreshCw, 
  Home, 
  ArrowLeft,
  Server,
  FileX,
  Search,
  Database
} from "lucide-react";

// 404 Not Found Error
export function Error404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="space-y-4">
          <div className="text-8xl font-bold text-muted-foreground/20 select-none">404</div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Page Not Found</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Sorry, we couldn't find the page you're looking for. It might have been moved, 
              deleted, or you entered the wrong URL.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>

        <Alert className="bg-muted/50 border-muted">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <AlertDescription className="text-muted-foreground">
            If you believe this is an error, please contact support.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

// No Internet Connection Error
export function ErrorNoInternet() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full border-0 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto">
            <Wifi className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-foreground">No Internet Connection</CardTitle>
            <CardDescription className="text-base">
              Please check your internet connection and try again.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-muted-foreground space-y-3 bg-muted/30 rounded-lg p-4">
            <p className="font-medium text-foreground">Troubleshooting steps:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                Check your Wi-Fi connection
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                Try refreshing the page
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                Check if other websites work
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                Contact your network administrator
              </li>
            </ul>
          </div>
          
          <Button 
            onClick={handleRetry} 
            className="w-full flex items-center gap-2 py-2.5"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Access Denied Error
export function ErrorAccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full border-0 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-foreground">Access Denied</CardTitle>
            <CardDescription className="text-base">
              You don't have permission to access this resource.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-300">
              This page requires elevated permissions. Please contact your administrator for access.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Server Error (500)
export function ErrorServer() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full border-0 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <Server className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-foreground">Server Error</CardTitle>
            <CardDescription className="text-base">
              Something went wrong on our end. Please try again later.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-4 space-y-2">
            <p className="font-medium text-foreground">Error Code: 500</p>
            <p>Our team has been notified and is working to fix this issue.</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Generic Error Boundary Component
interface ErrorBoundaryProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function GenericError({ 
  title, 
  description, 
  icon: Icon = AlertTriangle, 
  onRetry, 
  showHomeButton = true 
}: ErrorBoundaryProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full border-0 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <Icon className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-foreground">{title}</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            {onRetry && (
              <Button 
                onClick={onRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            )}
            {showHomeButton && (
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}