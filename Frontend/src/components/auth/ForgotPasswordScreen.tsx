import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { BookOpen, Mail, ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export function ForgotPasswordScreen() {
  const [step, setStep] = useState<"email" | "sent" | "reset">("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("sent");
    }, 2000);
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!resetCode) {
      newErrors.resetCode = "Reset code is required";
    }
    
    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("reset");
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "newPassword") setNewPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);
    if (field === "resetCode") setResetCode(value);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl mb-2">
            {step === "email" && "Reset Your Password"}
            {step === "sent" && "Check Your Email"}
            {step === "reset" && "Password Reset Successful"}
          </h1>
          <p className="text-muted-foreground">
            {step === "email" && "Enter your email to receive reset instructions"}
            {step === "sent" && "We've sent you a reset link"}
            {step === "reset" && "Your password has been updated"}
          </p>
        </div>

        <Card>
          {/* Email Step */}
          {step === "email" && (
            <>
              <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                        value={email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Button variant="link" className="px-0">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Email Sent Step */}
          {step === "sent" && (
            <CardContent className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg mb-2">Reset Link Sent!</h3>
                <p className="text-muted-foreground text-sm">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Didn't receive the email? Check your spam folder or try again.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSendReset({ preventDefault: () => {} } as React.FormEvent)}
                  disabled={isLoading}
                >
                  Resend Email
                </Button>
                <Button variant="link" className="w-full" onClick={() => setStep("email")}>
                  Try Different Email
                </Button>
              </div>

              {/* Demo: Allow proceeding to reset form */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Demo Mode:</p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setStep("reset")}
                >
                  Skip to Reset Form
                </Button>
              </div>
            </CardContent>
          )}

          {/* Password Reset Success */}
          {step === "reset" && (
            <CardContent className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg mb-2">Password Updated!</h3>
                <p className="text-muted-foreground text-sm">
                  Your password has been successfully updated. You can now sign in with your new password.
                </p>
              </div>

              <Button className="w-full">
                Continue to Sign In
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Security Note */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Security Note:</strong> Reset links expire in 15 minutes for your account security.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}