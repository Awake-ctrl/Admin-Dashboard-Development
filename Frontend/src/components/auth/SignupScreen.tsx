import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";
import { BookOpen, Eye, EyeOff, AlertCircle, CheckCircle, Mail, Lock, User, Building, Phone } from "lucide-react";
import { useRolesData } from "../hooks/userRolesData";
interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}
interface SignupScreenProps {
  onSignup: (userData: any) => void;
  onSwitchToLogin: () => void;
}

export function SignupScreen({ onSignup, onSwitchToLogin }: SignupScreenProps) {
  const { roles, loading } = useRolesData("overview");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signupSuccess, setSignupSuccess] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      }
    }
    
    if (step === 2) {
      if (!formData.organization.trim()) {
        newErrors.organization = "Organization is required";
      }
      if (!formData.role) {
        newErrors.role = "Role is required";
      }
    }
    
    if (step === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must contain uppercase, lowercase, and number";
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSignupSuccess(true);
      
      // Call onSignup with user data
      onSignup({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role,
        organization: formData.organization
      });
    }, 2000);
  };

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl mb-2">Account Created!</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to EduAdmin. Please check your email to verify your account.
            </p>
            <Button className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl mb-2">Join EduAdmin</h1>
          <p className="text-muted-foreground">
            Create your admin account to get started
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Professional Details"}
              {currentStep === 3 && "Account Security"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "Your organization and role"}
              {currentStep === 3 && "Set up your password"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        className={`pl-10 ${errors.firstName ? "border-destructive" : ""}`}
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className={`pl-10 ${errors.lastName ? "border-destructive" : ""}`}
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+91 9876543210"
                      className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization/Institution</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="organization"
                      placeholder="Your Educational Institution"
                      className={`pl-10 ${errors.organization ? "border-destructive" : ""}`}
                      value={formData.organization}
                      onChange={(e) => handleInputChange("organization", e.target.value)}
                    />
                  </div>
                  {errors.organization && (
                    <p className="text-sm text-destructive">{errors.organization}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Select
                    onValueChange={(value) => handleInputChange("role", value)}
                    value={formData.role}
                    disabled={loading}
                  >

                    <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                    {loading ? (
                      <SelectItem value="none" disabled>
                        Loading roles...
                      </SelectItem>
                    ) : roles.length > 0 ? (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.display_name || role.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No roles available
                      </SelectItem>
                    )}
                  </SelectContent>

                  </Select>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role}</p>
                  )}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your role will determine your access level and permissions in the system.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step 3: Account Security */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        handleInputChange("agreeToTerms", checked as boolean)
                      }
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the{" "}
                      <Button variant="link" className="p-0 h-auto text-sm">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="p-0 h-auto text-sm">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-destructive">{errors.agreeToTerms}</p>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onCheckedChange={(checked) => 
                        handleInputChange("subscribeNewsletter", checked as boolean)
                      }
                    />
                    <Label htmlFor="subscribeNewsletter" className="text-sm">
                      Subscribe to our newsletter for updates and tips
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </div>

            {/* Sign In Link */}
            <div className="text-center text-sm pt-4 border-t">
              <span className="text-muted-foreground">Already have an account? </span>
                <Button variant="link" className="px-0" onClick={onSwitchToLogin}>
    Sign in
  </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}