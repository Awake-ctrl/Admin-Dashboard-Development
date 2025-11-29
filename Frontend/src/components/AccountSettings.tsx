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

const API_BASE = "http://localhost:8000";

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
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
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
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    newPassword: "",
    confirmPassword: "",
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
      const userId = getUserId();
      
      if (!userId) {
        setErrorMessage("User ID not found. Please login again.");
        return;
      }

      setIsLoading(true);
      try {
        // Use the account profile endpoint
        const data = await makeApiCall(`/api/account/profile/${userId}`);
        
        setProfileData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          organization: data.organization || "",
          role: data.role || "",
          bio: data.bio || "",
          timezone: data.timezone || "Asia/Kolkata",
        });

        // Set avatar if exists
        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      } catch (error: any) {
        console.error("Failed to load profile:", error);
        setErrorMessage(error.message || "Failed to load profile data");
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
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
    } catch (error) {
      console.error("Upload failed:", error);
      showError("Failed to upload profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const userId = getUserId();
      await makeApiCall(`/api/account/avatar/${userId}`, "DELETE");
      setAvatarUrl(null);
      showSuccess("Profile picture removed successfully!");
    } catch (error) {
      console.error("Remove avatar failed:", error);
      showError("Failed to remove profile picture");
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
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
    } catch (error: any) {
      console.error("Profile update failed:", error);
      showError(error.message || "Failed to update profile");
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
      const userId = getUserId();
      
      await makeApiCall(`/api/account/password/${userId}`, "PUT", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showSuccess("Password updated successfully!");
    } catch (error: any) {
      console.error("Password change failed:", error);
      showError(error.message || "Failed to update password. Please check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    
    try {
      const userId = getUserId();
      await makeApiCall(`/api/account/notification-settings/${userId}`, "PUT", newSettings);
      showSuccess("Notification settings updated");
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      showError("Failed to update notification settings");
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      console.error("Export failed:", error);
      showError("Failed to export data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    showError("Account deletion not implemented in backend yet");
  };

  const getAvatarFallback = () => {
    return `${profileData.firstName[0] || 'U'}${profileData.lastName[0] || 'U'}`;
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}
      
      {errorMessage && (
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
          </p>
        </div>
        <Button variant="outline" onClick={handleExportData} disabled={isLoading}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

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
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isLoading}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}