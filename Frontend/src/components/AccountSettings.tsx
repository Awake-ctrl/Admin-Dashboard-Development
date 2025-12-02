import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  User,
  Mail,
  Phone,
  Building,
  Camera,
  Lock,
  Bell,
  Trash2,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";



// Get JWT token and user ID from localStorage
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

const getUserId = () => {
  // Get user ID from localStorage (set during login/signup)
  return localStorage.getItem('user_id');
};

// Make authenticated API calls
const makeApiCall = async (endpoint: string, method = "GET", data?: any) => {
  const token = getAuthToken();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  console.log("API Base URL:", API_BASE);
  
  if (!token) {
    console.warn("No authentication token found");
    // Don't throw error - we'll use dummy data
    throw new Error("No authentication token found");
  }

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  };

  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`Making API call to: ${API_BASE}${endpoint}`);
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    if (response.status === 401) {
      console.warn("Session expired - using dummy data");
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      // Don't redirect - use dummy data instead
      throw new Error("Session expired");
    }
    
    if (!response.ok) {
      console.warn(`API error ${response.status} - using dummy data`);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('API call failed, using dummy data:', error);
    throw error;
  }
};

// Dummy data to use when API fails
const DUMMY_PROFILE_DATA = {
  firstName: "Sai",
  lastName: "Kiran",
  email: "admin@gmail.com",
  phone: "8074779534",
  organization: "IIT PKD",
  role: "Admin",
  bio: "System administrator with full access to all features.",
  timezone: "Asia/Kolkata",
  avatar_url: null
};

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [usingDummyData, setUsingDummyData] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    bio: "",
    timezone: "Asia/Kolkata",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "Aa1234567", // Default password for dummy data
    confirmPassword: "Aa1234567",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    securityAlerts: true,
    marketingEmails: false,
    courseUpdates: true,
    systemMaintenance: true,
  });

  // Load user profile data
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      
      try {
        // Try to fetch real data from API
        console.log("Attempting to fetch profile data from API...");
        const data = await makeApiCall(`/api/auth/me`);
        
        console.log("API data received:", data);
        
        // Use real API data
        setUsingDummyData(false);
        setProfileData({
          firstName: data.firstName || data.first_name || "",
          lastName: data.lastName || data.last_name || "",
          email: data.email || "",
          phone: data.phone || data.phone_number || "",
          organization: data.organization || data.company || "",
          role: data.role || data.user_role || "",
          bio: data.bio || data.biography || "",
          timezone: data.timezone || data.time_zone || "Asia/Kolkata",
        });

        if (data.avatar_url || data.avatarUrl) {
          setAvatarUrl(data.avatar_url || data.avatarUrl);
        }
        
        setErrorMessage(""); // Clear any previous errors
        
      } catch (error: any) {
        console.log("API failed, using dummy data");
        
        // Use dummy data
        setUsingDummyData(true);
        setProfileData({
          firstName: DUMMY_PROFILE_DATA.firstName,
          lastName: DUMMY_PROFILE_DATA.lastName,
          email: DUMMY_PROFILE_DATA.email,
          phone: DUMMY_PROFILE_DATA.phone,
          organization: DUMMY_PROFILE_DATA.organization,
          role: DUMMY_PROFILE_DATA.role,
          bio: DUMMY_PROFILE_DATA.bio,
          timezone: DUMMY_PROFILE_DATA.timezone,
        });
        
        setAvatarUrl(DUMMY_PROFILE_DATA.avatar_url);
        
        // Show info message about using dummy data
        if (error.message.includes("No authentication token")) {
          setErrorMessage("Please login to access real data. Using demo profile for now.");
        } else {
          setErrorMessage("Could not connect to server. Using demo profile data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000); // Longer timeout for demo messages
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError("Image size should be less than 5MB");
      return;
    }

    setIsLoading(true);

    try {
      if (usingDummyData) {
        // For dummy data, just create a local URL
        const localUrl = URL.createObjectURL(file);
        setAvatarUrl(localUrl);
        showSuccess("Profile picture updated (demo mode)!");
      } else {
        // Real API call
        const userId = getUserId();
        const formData = new FormData();
        formData.append("file", file);

        const token = getAuthToken();
        const response = await fetch(`${API_BASE}/api/account/upload-avatar/${userId}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const result = await response.json();
        setAvatarUrl(result.url);
        showSuccess("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      showError(usingDummyData ? 
        "Cannot upload in demo mode. Please login for full functionality." : 
        "Failed to upload profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      if (usingDummyData) {
        setAvatarUrl(null);
        showSuccess("Profile picture removed (demo mode)!");
      } else {
        const userId = getUserId();
        await makeApiCall(`/api/account/avatar/${userId}`, "DELETE");
        setAvatarUrl(null);
        showSuccess("Profile picture removed successfully!");
      }
    } catch (error) {
      console.error("Remove avatar failed:", error);
      showError(usingDummyData ?
        "Demo mode: Avatar removed locally" :
        "Failed to remove profile picture");
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      if (usingDummyData) {
        // For dummy data, just update local state
        showSuccess("Profile updated (demo mode)! Note: Changes are not saved to server.");
      } else {
        const userId = getUserId();
        
        if (!userId) {
          throw new Error("User ID not found");
        }

        // Update profile using the account endpoint
        await makeApiCall(`/api/account/profile/${userId}`, "PUT", {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          bio: profileData.bio,
          timezone: profileData.timezone,
          organization: profileData.organization,
        });

        showSuccess("Profile updated successfully!");
      }
    } catch (error: any) {
      console.error("Profile update failed:", error);
      showError(usingDummyData ?
        "Demo mode: Profile updated locally only" :
        error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("Passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      if (usingDummyData) {
        // For dummy data, just show success message
        setPasswordData({ 
          currentPassword: "", 
          newPassword: "Aa1234567", 
          confirmPassword: "Aa1234567" 
        });
        showSuccess("Password changed (demo mode)! Note: Not saved to server.");
      } else {
        const userId = getUserId();
        
        await makeApiCall(`/api/account/password/${userId}`, "PUT", {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        });

        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        showSuccess("Password updated successfully!");
      }
    } catch (error: any) {
      console.error("Password change failed:", error);
      showError(usingDummyData ?
        "Demo mode: Password updated locally only" :
        error.message || "Failed to update password. Please check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    
    try {
      if (usingDummyData) {
        showSuccess("Notification settings updated (demo mode)");
      } else {
        const userId = getUserId();
        await makeApiCall(`/api/account/notification-settings/${userId}`, "PUT", newSettings);
        showSuccess("Notification settings updated");
      }
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      showError(usingDummyData ?
        "Demo mode: Settings updated locally" :
        "Failed to update notification settings");
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      if (usingDummyData) {
        // Export dummy data
        const exportData = {
          profile: profileData,
          notifications: notificationSettings,
          exportDate: new Date().toISOString(),
          note: "This is demo data exported from the account settings page"
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `demo-user-data-export-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showSuccess("Demo data exported successfully!");
      } else {
        const userId = getUserId();
        const result = await makeApiCall(`/api/account/export-data/${userId}`, "POST");
        
        const blob = new Blob([JSON.stringify(result.data || result, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `user-data-export-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showSuccess("Data exported successfully!");
      }
    } catch (error) {
      console.error("Export failed:", error);
      showError(usingDummyData ?
        "Demo data exported successfully!" :
        "Failed to export data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (usingDummyData) {
      showError("Cannot delete account in demo mode. Please login for real functionality.");
    } else {
      showError("Account deletion not implemented in backend yet");
    }
  };

  const getAvatarFallback = () => {
    return `${profileData.firstName[0] || 'S'}${profileData.lastName[0] || 'K'}`;
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Demo Mode Indicator */}
      {/* {usingDummyData && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-800 flex items-center justify-between">
            <span>
              🔄 Using demo profile data. Login for real functionality.
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4"
              onClick={() => window.location.href = "/login"}
            >
              Login
            </Button>
          </AlertDescription>
        </Alert>
      )} */}

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}
      
      {errorMessage && !usingDummyData && (
        <Alert className="bg-red-50 border-red-200">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and security settings
            {/* {usingDummyData && " (Demo Mode)"} */}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* {usingDummyData && (
            <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
              Demo Mode
            </div>
          )} */}
          <Button variant="outline" onClick={handleExportData} disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Loading account settings...</p>
          <p className="text-sm text-muted-foreground mt-2">
            {usingDummyData ? "Setting up demo profile..." : "Fetching your profile data..."}
          </p>
        </div>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                    {usingDummyData && " (Changes not saved to server)"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24 border-2 border-muted">
                      <AvatarImage
                        src={avatarUrl || undefined}
                        alt="Profile"
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {getAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("avatar-upload")?.click()}
                        disabled={isLoading}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {avatarUrl ? "Change Photo" : "Upload Photo"}
                      </Button>
                      {avatarUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={handleRemoveAvatar}
                          disabled={isLoading}
                        >
                          Remove Photo
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          className="pl-10"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData({ ...profileData, firstName: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          className="pl-10"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData({ ...profileData, lastName: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={profileData.email}
                          disabled
                          title="Email cannot be changed"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          className="pl-10"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({ ...profileData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="organization"
                          className="pl-10"
                          value={profileData.organization}
                          onChange={(e) =>
                            setProfileData({ ...profileData, organization: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profileData.role}
                        disabled
                        title="Role is managed by admin"
                      />
                      <p className="text-xs text-muted-foreground">Role is managed by admin</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px]"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profileData.timezone}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, timezone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">India (UTC+05:30)</SelectItem>
                        <SelectItem value="UTC">UTC (UTC+00:00)</SelectItem>
                        <SelectItem value="America/New_York">US Eastern (UTC-05:00)</SelectItem>
                        <SelectItem value="Europe/London">UK (UTC+00:00)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Japan (UTC+09:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleProfileUpdate} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                    {usingDummyData && " (Demo password: Aa1234567)"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Change Password</h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            placeholder={usingDummyData ? "Enter any value in demo" : ""}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            className="pl-10"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handlePasswordChange} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to receive updates and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <div className="space-y-3">
                      {[
                        {
                          key: "emailNotifications",
                          label: "Email Notifications",
                          description: "Receive general notifications via email",
                        },
                        {
                          key: "weeklyReports",
                          label: "Weekly Reports",
                          description: "Get weekly analytics and activity summaries",
                        },
                        {
                          key: "securityAlerts",
                          label: "Security Alerts",
                          description: "Important security-related notifications",
                        },
                        {
                          key: "courseUpdates",
                          label: "Course Updates",
                          description: "Notifications about course changes and updates",
                        },
                        {
                          key: "systemMaintenance",
                          label: "System Maintenance",
                          description: "Alerts about scheduled maintenance",
                        },
                        {
                          key: "marketingEmails",
                          label: "Marketing Emails",
                          description: "Product updates and promotional content",
                        },
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between">
                          <div>
                            <div className="text-sm">{setting.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {setting.description}
                            </div>
                          </div>
                          <Switch
                            checked={
                              notificationSettings[
                                setting.key as keyof typeof notificationSettings
                              ]
                            }
                            onCheckedChange={(value) =>
                              handleNotificationUpdate(setting.key, value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Push Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm">Browser Notifications</div>
                          <div className="text-xs text-muted-foreground">
                            Receive push notifications in your browser
                          </div>
                        </div>
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(value) =>
                            handleNotificationUpdate("pushNotifications", value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">SMS Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm">SMS Alerts</div>
                          <div className="text-xs text-muted-foreground">
                            Critical alerts sent to your mobile number
                          </div>
                        </div>
                        <Switch
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(value) =>
                            handleNotificationUpdate("smsNotifications", value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Bell className="h-4 w-4" />
                    <AlertDescription>
                      Security and billing notifications cannot be disabled for account safety.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible account actions - proceed with caution
                {usingDummyData && " (Disabled in demo mode)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isLoading || usingDummyData}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      {usingDummyData ? 
                        "Account deletion is disabled in demo mode. Please login for real functionality." :
                        "This action cannot be undone. This will permanently delete your account and all associated data."
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={handleDeleteAccount}
                      disabled={usingDummyData}
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}