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
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-4">
          <div className="text-8xl text-muted-foreground/20">404</div>
          <div>
            <h1 className="text-3xl mb-2">Page Not Found</h1>
            <p className="text-muted-foreground">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
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
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle>No Internet Connection</CardTitle>
          <CardDescription>
            Please check your internet connection and try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Troubleshooting steps:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your Wi-Fi connection</li>
              <li>Try refreshing the page</li>
              <li>Check if other websites work</li>
              <li>Contact your network administrator</li>
            </ul>
          </div>
          
          <Button className="w-full" onClick={handleRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
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
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this resource.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This page requires elevated permissions. Please contact your administrator for access.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => window.location.href = '/'}>
              <Home className="w-4 h-4 mr-2" />
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
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Server className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle>Server Error</CardTitle>
          <CardDescription>
            Something went wrong on our end. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Error Code: 500</p>
            <p>Our team has been notified and is working to fix this issue.</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Home className="w-4 h-4 mr-2" />
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
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button onClick={onRetry}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            {showHomeButton && (
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}