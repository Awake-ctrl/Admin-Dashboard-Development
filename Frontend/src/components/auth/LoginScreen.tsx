import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import { BookOpen, Eye, EyeOff, AlertCircle, CheckCircle, Mail, Lock } from "lucide-react";
// import { useNavigate } from "react-router-dom";

interface LoginScreenProps {
  onLogin: (userData: any) => void;
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
}

export function LoginScreen({ onLogin, onSwitchToSignup, onSwitchToForgotPassword }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  // const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
  e.preventDefault();
  setApiError("");
  
  if (!validateForm()) return;
  
  setIsLoading(true);

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    // Check if response is HTML (error page)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      if (text.startsWith('<!DOCTYPE') || text.startsWith('<html>')) {
        throw new Error('Server returned HTML instead of JSON. Check if backend is running.');
      }
      throw new Error(`Unexpected response format: ${contentType}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error("Invalid JSON response from server");
    }

    if (!response.ok) {
      throw new Error(data.detail || `Login failed with status ${response.status}`);
    }

    // Store the token
    localStorage.setItem("access_token", data.access_token);
    
    // Get user info
    const userResponse = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        "Authorization": `Bearer ${data.access_token}`,
      },
    });

    // Check user response content type
    const userContentType = userResponse.headers.get('content-type');
    if (!userContentType || !userContentType.includes('application/json')) {
      const text = await userResponse.text();
      throw new Error('Server returned HTML for user data');
    }

    if (userResponse.ok) {
      const userData = await userResponse.json();
      setLoginSuccess(true);
      
      // Call onLogin with user data after a brief delay
      setTimeout(() => {
        onLogin(userData);
      }, 1000);
    } else {
      throw new Error("Failed to get user information");
    }

  } catch (error: any) {
    console.error('Login error:', error);
    setApiError(error.message || "An error occurred during login");
  } finally {
    setIsLoading(false);
  }
};
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  if (loginSuccess) {
  // Redirect to dashboard after 1 second
  // setTimeout(() => {
  //   navigate("/dashboard"); // <-- replace with your dashboard route
  // }, 1000);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground mb-4">
            Login successful. Redirecting to dashboard...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl mb-2">Welcome to EduAdmin</h1>
          <p className="text-muted-foreground">
            Sign in to your admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@eduplatform.com"
                    className={`pl-10 ${errors.email ? "border-destructive focus:border-destructive" : ""}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive focus:border-destructive" : ""}`}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      handleInputChange("rememberMe", checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button 
                  variant="link" 
                  className="px-0 text-sm" 
                  onClick={onSwitchToForgotPassword}
                  type="button"
                  disabled={isLoading}
                >
                  Forgot password?
                </Button>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
{/* 
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div> */}
{/* 
            <div className="grid gap-4">
              <Button variant="outline" className="w-full" disabled={isLoading}>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
            </div> */}

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button 
                variant="link" 
                className="px-0" 
                onClick={onSwitchToSignup}
                type="button"
                disabled={isLoading}
              >
                Sign up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Alert - Remove in production */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> The backend is not working.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}