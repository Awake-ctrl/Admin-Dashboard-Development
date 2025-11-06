import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Camera, 
  Lock, 
  Bell,
  Shield, 
  Trash2,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from "lucide-react";

// Simple API calls without external files
const API_BASE = 'http://localhost:8000';

const makeApiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  return response.json();
};

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@eduplatform.com",
    phone: "+91 9876543210",
    organization: "ABC Educational Institute",
    role: "Administrator",
    bio: "Experienced educational administrator passionate about leveraging technology for better learning outcomes.",
    timezone: "Asia/Kolkata",
    language: "English"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    securityAlerts: true,
    marketingEmails: false,
    courseUpdates: true,
    systemMaintenance: true
  });

  // This will make HTTP request to backend when component loads
  useEffect(() => {
    // Load user profile data - This will show GET request in backend
    const loadUserData = async () => {
      try {
        console.log("Making API call to load user data...");
        const userData = await makeApiCall('/api/users?limit=1');
        if (userData && userData.length > 0) {
          console.log("User data loaded:", userData[0]);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    
    loadUserData();
  }, []);

  // Handle profile picture upload - This will show POST request in backend
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Making API call to upload avatar...");
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // This will make actual HTTP POST request to backend
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      console.log("Upload response:", result);
      
      // Create local URL for immediate display
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error("Upload failed:", error);
      alert('Failed to upload profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile picture removal - This will show DELETE request in backend
  const handleRemoveAvatar = () => {
    setIsLoading(true);
    
    // Simulate API call for avatar removal
    setTimeout(() => {
      setAvatarUrl(null);
      console.log("DELETE /api/account/avatar/user_id - Avatar removed");
      setIsLoading(false);
      alert('Profile picture removed successfully!');
    }, 1000);
  };

  // Handle profile update - This will show PUT request in backend
  // Replace handleProfileUpdate function:
const handleProfileUpdate = async () => {
  setIsLoading(true);
  
  try {
    console.log("Making API call to update profile...");
    
    // Use the correct endpoint
    // In handleProfileUpdate function - make sure it's sending this format:
const result = await makeApiCall('/api/account/profile/user_123456', 'PUT', {
  firstName: profileData.firstName,
  lastName: profileData.lastName,
  email: profileData.email,
  phone: profileData.phone,
  organization: profileData.organization,
  role: profileData.role,
  bio: profileData.bio,
  timezone: profileData.timezone,
  language: profileData.language
});
    
    console.log("Profile update response:", result);
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Profile update failed:", error);
    alert("Failed to update profile");
  } finally {
    setIsLoading(false);
  }
};

// Replace handlePasswordChange function:
const handlePasswordChange = async () => {
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    alert("Passwords don't match!");
    return;
  }
  
  setIsLoading(true);
  
  try {
    console.log("Making API call to change password...");
    
    // Use the correct endpoint
    const result = await makeApiCall('/api/account/password/user_123456', 'PUT', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword
    });
    
    console.log("Password change response:", result);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    alert("Password updated successfully!");
  } catch (error) {
    console.error("Password change failed:", error);
    alert("Failed to update password");
  } finally {
    setIsLoading(false);
  }
};
  // Handle notification settings - This will show PUT request in backend
  const handleNotificationUpdate = async (key: string, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    
    try {
      console.log("Making API call to update notifications...");
      
      // This will make actual HTTP PUT request to backend
      const result = await makeApiCall('/api/account/notification-settings/user_123456', 'PUT', newSettings);
      
      console.log("Notification update response:", result);
    } catch (error) {
      console.error("Notification update failed:", error);
    }
  };

  // Handle export data - This will show POST request in backend
  const handleExportData = async () => {
    setIsLoading(true);
    
    try {
      console.log("Making API call to export data...");
      
      // This will make actual HTTP POST request to backend
      const result = await makeApiCall('/api/account/export-data/user_123456', 'POST');
      
      console.log("Export data response:", result);
      
      // Create and download file
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert("Data exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data");
    } finally {
      setIsLoading(false);
    }
  };

  const getAvatarFallback = () => {
    return `${profileData.firstName[0]}${profileData.lastName[0]}`;
  };

  return (
    <div className="space-y-6">
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
                    src={avatarUrl || "/api/placeholder/96/96"} 
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
                    onClick={() => document.getElementById('avatar-upload')?.click()}
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
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
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
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
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
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
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
                      onChange={(e) => setProfileData({...profileData, organization: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={profileData.role} onValueChange={(value) => setProfileData({...profileData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Coordinator">Academic Coordinator</SelectItem>
                      <SelectItem value="Manager">Content Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => setProfileData({...profileData, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">India (UTC+05:30)</SelectItem>
                      <SelectItem value="UTC">UTC (UTC+00:00)</SelectItem>
                      <SelectItem value="America/New_York">US Eastern (UTC-05:00)</SelectItem>
                      <SelectItem value="Europe/London">UK (UTC+00:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={profileData.language} onValueChange={(value) => setProfileData({...profileData, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Bengali">Bengali</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              {/* Password Change */}
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
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
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

              <Separator />

              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Badge variant="outline" className="text-orange-600">
                    Not Enabled
                  </Badge>
                </div>
                <Button variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Enable 2FA
                </Button>
              </div>

              <Separator />

              {/* Active Sessions */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Active Sessions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="text-sm">Current Session</div>
                      <div className="text-xs text-muted-foreground">
                        Chrome on Windows • Mumbai, India • Active now
                      </div>
                    </div>
                    <Badge className="bg-green-500">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="text-sm">Mobile App</div>
                      <div className="text-xs text-muted-foreground">
                        iOS App • Delhi, India • 2 hours ago
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>
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
              {/* Email Notifications */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  {[
                    { key: "emailNotifications", label: "Email Notifications", description: "Receive general notifications via email" },
                    { key: "weeklyReports", label: "Weekly Reports", description: "Get weekly analytics and activity summaries" },
                    { key: "securityAlerts", label: "Security Alerts", description: "Important security-related notifications" },
                    { key: "courseUpdates", label: "Course Updates", description: "Notifications about course changes and updates" },
                    { key: "systemMaintenance", label: "System Maintenance", description: "Alerts about scheduled maintenance" },
                    { key: "marketingEmails", label: "Marketing Emails", description: "Product updates and promotional content" }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm">{setting.label}</div>
                        <div className="text-xs text-muted-foreground">{setting.description}</div>
                      </div>
                      <Switch
                        checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                        onCheckedChange={(value) => handleNotificationUpdate(setting.key, value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Push Notifications */}
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
                      onCheckedChange={(value) => handleNotificationUpdate("pushNotifications", value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* SMS Notifications */}
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
                      onCheckedChange={(value) => handleNotificationUpdate("smsNotifications", value)}
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

              <div className="flex justify-end">
                <Button onClick={() => {
                  handleNotificationUpdate("all", true);
                  alert("Notification settings saved!");
                }}>
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
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
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your 
                  account and all associated data including courses, students, and analytics.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive" onClick={() => {
                  console.log("DELETE /api/users/user_123456 - Account deletion requested");
                }}>
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