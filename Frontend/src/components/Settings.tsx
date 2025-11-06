import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, Palette, Sliders, Save, Upload, Eye, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE_URL = "http://localhost:8000/api";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("branding");
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [settings, setSettings] = useState({
    // Branding
    site_name: "EduPlatform",
    site_description: "Comprehensive Learning Management System",
    primary_color: "#030213",
    secondary_color: "#e9ebef",
    logo_url: "",
    favicon_url: "",
    
    // Email Templates
    welcome_subject: "Welcome to {{siteName}}!",
    welcome_content: "Welcome {{userName}}! Your account has been created successfully.",
    course_enrollment_subject: "Enrolled in {{courseName}}",
    course_enrollment_content: "Congratulations! You've been enrolled in {{courseName}}.",
    
    // Feature Toggles
    enable_registration: true,
    enable_course_comments: true,
    enable_course_ratings: true,
    enable_certificates: true,
    enable_progress_tracking: true,
    enable_notifications: true,
    enable_email_notifications: true,
    enable_push_notifications: false,
    
    // Notifications
    notification_types: {
      courseUpdates: { email: true, push: false, inApp: true },
      assignments: { email: true, push: true, inApp: true },
      announcements: { email: false, push: false, inApp: true },
      systemAlerts: { email: true, push: false, inApp: true }
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      showMessage("error", "Failed to load settings");
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNotificationSetting = (type, channel, value) => {
    setSettings(prev => ({
      ...prev,
      notification_types: {
        ...prev.notification_types,
        [type]: {
          ...prev.notification_types[type],
          [channel]: value
        }
      }
    }));
  };

  const handleSave = async (section) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        showMessage("success", `${section} settings saved successfully!`);
      } else {
        showMessage("error", "Failed to save settings");
      }
    } catch (error) {
      showMessage("error", "Error saving settings");
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const endpoint = type === "logo" ? "upload-logo" : "upload-favicon";
    const setUploading = type === "logo" ? setUploadingLogo : setUploadingFavicon;
    
    try {
      setUploading(true);
      const response = await fetch(`${API_BASE_URL}/settings/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const urlKey = type === "logo" ? "logo_url" : "favicon_url";
        updateSetting(urlKey, data.url);
        showMessage("success", `${type === "logo" ? "Logo" : "Favicon"} uploaded successfully!`);
      } else {
        showMessage("error", `Failed to upload ${type}`);
      }
    } catch (error) {
      showMessage("error", `Error uploading ${type}`);
      console.error(`Error uploading ${type}:`, error);
    } finally {
      setUploading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const BrandingSettings = () => (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div>
        <h3 className="text-lg mb-4">Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={settings.site_name}
              onChange={(e) => updateSetting('site_name', e.target.value)}
              placeholder="Your platform name"
            />
          </div>
          <div>
            <Label htmlFor="site-description">Site Description</Label>
            <Input
              id="site-description"
              value={settings.site_description}
              onChange={(e) => updateSetting('site_description', e.target.value)}
              placeholder="Brief description of your platform"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg mb-4">Brand Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary-color"
                type="color"
                value={settings.primary_color}
                onChange={(e) => updateSetting('primary_color', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={settings.primary_color}
                onChange={(e) => updateSetting('primary_color', e.target.value)}
                placeholder="#030213"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="secondary-color">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondary-color"
                type="color"
                value={settings.secondary_color}
                onChange={(e) => updateSetting('secondary_color', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={settings.secondary_color}
                onChange={(e) => updateSetting('secondary_color', e.target.value)}
                placeholder="#e9ebef"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg mb-4">Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="logo-upload">Site Logo</Label>
            <div className="space-y-2">
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleFileUpload(file, "logo");
                }}
                disabled={uploadingLogo}
              />
              {uploadingLogo && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </div>
              )}
              {settings.logo_url && (
                <div className="p-2 border rounded-lg">
                  <img src={settings.logo_url} alt="Logo preview" className="h-12 object-contain" />
                </div>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="favicon-upload">Favicon</Label>
            <div className="space-y-2">
              <Input
                id="favicon-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleFileUpload(file, "favicon");
                }}
                disabled={uploadingFavicon}
              />
              {uploadingFavicon && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </div>
              )}
              {settings.favicon_url && (
                <div className="p-2 border rounded-lg">
                  <img src={settings.favicon_url} alt="Favicon preview" className="h-8 w-8 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleSave("Branding")} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Branding
        </Button>
      </div>
    </div>
  );

  const EmailTemplateSettings = () => {
    const [selectedTemplate, setSelectedTemplate] = useState("welcome");
    
    const templates = {
      welcome: {
        subject: settings.welcome_subject,
        content: settings.welcome_content,
        variables: ["{{userName}}", "{{siteName}}", "{{loginUrl}}"]
      },
      enrollment: {
        subject: settings.course_enrollment_subject,
        content: settings.course_enrollment_content,
        variables: ["{{userName}}", "{{courseName}}", "{{courseUrl}}", "{{instructorName}}"]
      }
    };

    const generatePreview = () => {
      const template = templates[selectedTemplate];
      const sampleData = {
        userName: "John Doe",
        siteName: settings.site_name,
        loginUrl: "https://yourplatform.com/login",
        courseName: "Introduction to React",
        courseUrl: "https://yourplatform.com/course/react-intro",
        instructorName: "Alice Johnson"
      };

      let previewSubject = template.subject;
      let previewContent = template.content;

      Object.entries(sampleData).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        previewSubject = previewSubject.replace(new RegExp(placeholder, 'g'), value);
        previewContent = previewContent.replace(new RegExp(placeholder, 'g'), value);
      });

      return { subject: previewSubject, content: previewContent };
    };

    const EmailPreview = () => {
      const preview = generatePreview();
      
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>From: noreply@{settings.site_name.toLowerCase().replace(/\s+/g, '')}.com</div>
                <div>To: john.doe@example.com</div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-gray-500">Subject:</div>
                <div className="font-medium text-gray-900">{preview.subject}</div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="h-8 object-contain" />
                ) : (
                  <div 
                    className="h-8 w-32 rounded flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: settings.primary_color }}
                  >
                    {settings.site_name}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="text-gray-900 whitespace-pre-wrap">{preview.content}</div>
                
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Best regards,<br />
                    The {settings.site_name} Team
                  </p>
                </div>
                
                <div className="pt-4 text-xs text-gray-400">
                  <p>This is an automated email from {settings.site_name}. Please do not reply to this email.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div>
          <h3 className="text-lg mb-4">Email Templates</h3>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-[300px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="welcome">Welcome Email</SelectItem>
              <SelectItem value="enrollment">Course Enrollment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <Label htmlFor="email-subject">Subject Line</Label>
              <Input
                id="email-subject"
                value={templates[selectedTemplate].subject}
                onChange={(e) => {
                  if (selectedTemplate === 'welcome') {
                    updateSetting('welcome_subject', e.target.value);
                  } else {
                    updateSetting('course_enrollment_subject', e.target.value);
                  }
                }}
                placeholder="Email subject"
              />
            </div>
            
            <div>
              <Label htmlFor="email-content">Email Content</Label>
              <Textarea
                id="email-content"
                value={templates[selectedTemplate].content}
                onChange={(e) => {
                  if (selectedTemplate === 'welcome') {
                    updateSetting('welcome_content', e.target.value);
                  } else {
                    updateSetting('course_enrollment_content', e.target.value);
                  }
                }}
                placeholder="Email content with variables"
                rows={8}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => handleSave("Email Templates")} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Template
              </Button>
              <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Email Preview - {selectedTemplate === 'welcome' ? 'Welcome Email' : 'Course Enrollment'}</DialogTitle>
                  </DialogHeader>
                  <EmailPreview />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div>
            <Label>Available Variables</Label>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {templates[selectedTemplate].variables.map((variable) => (
                    <Badge key={variable} variant="outline" className="block w-fit cursor-pointer hover:bg-accent">
                      {variable}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Click on a variable to copy it to your clipboard
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const FeatureToggleSettings = () => (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div>
        <h3 className="text-lg mb-4">Platform Features</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-registration">User Registration</Label>
              <p className="text-muted-foreground text-sm">Allow new users to register accounts</p>
            </div>
            <Switch
              id="enable-registration"
              checked={settings.enable_registration}
              onCheckedChange={(checked) => updateSetting('enable_registration', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-comments">Course Comments</Label>
              <p className="text-muted-foreground text-sm">Enable commenting on course content</p>
            </div>
            <Switch
              id="enable-comments"
              checked={settings.enable_course_comments}
              onCheckedChange={(checked) => updateSetting('enable_course_comments', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-ratings">Course Ratings</Label>
              <p className="text-muted-foreground text-sm">Allow students to rate courses</p>
            </div>
            <Switch
              id="enable-ratings"
              checked={settings.enable_course_ratings}
              onCheckedChange={(checked) => updateSetting('enable_course_ratings', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-certificates">Certificates</Label>
              <p className="text-muted-foreground text-sm">Generate completion certificates</p>
            </div>
            <Switch
              id="enable-certificates"
              checked={settings.enable_certificates}
              onCheckedChange={(checked) => updateSetting('enable_certificates', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-progress">Progress Tracking</Label>
              <p className="text-muted-foreground text-sm">Track student progress through courses</p>
            </div>
            <Switch
              id="enable-progress"
              checked={settings.enable_progress_tracking}
              onCheckedChange={(checked) => updateSetting('enable_progress_tracking', checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleSave("Features")} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Features
        </Button>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div>
        <h3 className="text-lg mb-4">Global Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-notifications">Enable Notifications</Label>
              <p className="text-muted-foreground text-sm">Master switch for all notifications</p>
            </div>
            <Switch
              id="enable-notifications"
              checked={settings.enable_notifications}
              onCheckedChange={(checked) => updateSetting('enable_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-email-notifications">Email Notifications</Label>
              <p className="text-muted-foreground text-sm">Send notifications via email</p>
            </div>
            <Switch
              id="enable-email-notifications"
              checked={settings.enable_email_notifications}
              onCheckedChange={(checked) => updateSetting('enable_email_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-push-notifications">Push Notifications</Label>
              <p className="text-muted-foreground text-sm">Send browser/mobile push notifications</p>
            </div>
            <Switch
              id="enable-push-notifications"
              checked={settings.enable_push_notifications}
              onCheckedChange={(checked) => updateSetting('enable_push_notifications', checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg mb-4">Notification Types</h3>
        <div className="space-y-4">
          {Object.entries(settings.notification_types).map(([type, channels]) => (
            <Card key={type}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="capitalize text-foreground">{type.replace(/([A-Z])/g, ' $1')}</h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${type}-email`} className="text-sm">Email</Label>
                    <Switch
                      id={`${type}-email`}
                      checked={channels.email}
                      onCheckedChange={(checked) => updateNotificationSetting(type, 'email', checked)}
                      disabled={!settings.enable_email_notifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${type}-push`} className="text-sm">Push</Label>
                    <Switch
                      id={`${type}-push`}
                      checked={channels.push}
                      onCheckedChange={(checked) => updateNotificationSetting(type, 'push', checked)}
                      disabled={!settings.enable_push_notifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${type}-inapp`} className="text-sm">In-App</Label>
                    <Switch
                      id={`${type}-inapp`}
                      checked={channels.inApp}
                      onCheckedChange={(checked) => updateNotificationSetting(type, 'inApp', checked)}
                      disabled={!settings.enable_notifications}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleSave("Notifications")} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Notifications
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="branding" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Branding
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Templates
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Features
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="branding" className="mt-6">
              <BrandingSettings />
            </TabsContent>
            
            <TabsContent value="email" className="mt-6">
              <EmailTemplateSettings />
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <FeatureToggleSettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-6">
              <NotificationSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}