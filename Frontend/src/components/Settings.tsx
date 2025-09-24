import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Bell, Mail, Palette, Sliders, Save, Upload, Eye } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function Settings() {
  const [activeTab, setActiveTab] = useState("branding");
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [settings, setSettings] = useState({
    // Branding
    siteName: "EduPlatform",
    siteDescription: "Comprehensive Learning Management System",
    primaryColor: "#030213",
    secondaryColor: "#e9ebef",
    logo: "",
    favicon: "",
    
    // Email Templates
    welcomeSubject: "Welcome to {{siteName}}!",
    welcomeContent: "Welcome {{userName}}! Your account has been created successfully.",
    courseEnrollmentSubject: "Enrolled in {{courseName}}",
    courseEnrollmentContent: "Congratulations! You've been enrolled in {{courseName}}.",
    
    // Feature Toggles
    enableRegistration: true,
    enableCourseComments: true,
    enableCourseRatings: true,
    enableCertificates: true,
    enableProgressTracking: true,
    enableNotifications: true,
    enableEmailNotifications: true,
    enablePushNotifications: false,
    
    // Notifications
    notificationTypes: {
      courseUpdates: { email: true, push: false, inApp: true },
      assignments: { email: true, push: true, inApp: true },
      announcements: { email: false, push: false, inApp: true },
      systemAlerts: { email: true, push: false, inApp: true }
    }
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNotificationSetting = (type: string, channel: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: {
          ...prev.notificationTypes[type],
          [channel]: value
        }
      }
    }));
  };

  const BrandingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg mb-4">Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={settings.siteName}
              onChange={(e) => updateSetting('siteName', e.target.value)}
              placeholder="Your platform name"
            />
          </div>
          <div>
            <Label htmlFor="site-description">Site Description</Label>
            <Input
              id="site-description"
              value={settings.siteDescription}
              onChange={(e) => updateSetting('siteDescription', e.target.value)}
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
                value={settings.primaryColor}
                onChange={(e) => updateSetting('primaryColor', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={settings.primaryColor}
                onChange={(e) => updateSetting('primaryColor', e.target.value)}
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
                value={settings.secondaryColor}
                onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={settings.secondaryColor}
                onChange={(e) => updateSetting('secondaryColor', e.target.value)}
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
                  if (file) {
                    // In a real app, you'd upload this to your storage
                    updateSetting('logo', URL.createObjectURL(file));
                  }
                }}
              />
              {settings.logo && (
                <div className="p-2 border rounded-lg">
                  <img src={settings.logo} alt="Logo preview" className="h-12 object-contain" />
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
                  if (file) {
                    updateSetting('favicon', URL.createObjectURL(file));
                  }
                }}
              />
              {settings.favicon && (
                <div className="p-2 border rounded-lg">
                  <img src={settings.favicon} alt="Favicon preview" className="h-8 w-8 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Branding
        </Button>
      </div>
    </div>
  );

  const EmailTemplateSettings = () => {
    const [selectedTemplate, setSelectedTemplate] = useState("welcome");
    
    const templates = {
      welcome: {
        subject: settings.welcomeSubject,
        content: settings.welcomeContent,
        variables: ["{{userName}}", "{{siteName}}", "{{loginUrl}}"]
      },
      enrollment: {
        subject: settings.courseEnrollmentSubject,
        content: settings.courseEnrollmentContent,
        variables: ["{{userName}}", "{{courseName}}", "{{courseUrl}}", "{{instructorName}}"]
      }
    };

    const generatePreview = () => {
      const template = templates[selectedTemplate];
      const sampleData = {
        userName: "John Doe",
        siteName: settings.siteName,
        loginUrl: "https://yourplatform.com/login",
        courseName: "Introduction to React",
        courseUrl: "https://yourplatform.com/course/react-intro",
        instructorName: "Alice Johnson"
      };

      let previewSubject = template.subject;
      let previewContent = template.content;

      // Replace variables with sample data
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
            {/* Email Header */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>From: noreply@{settings.siteName.toLowerCase().replace(/\s+/g, '')}.com</div>
                <div>To: john.doe@example.com</div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-gray-500">Subject:</div>
                <div className="font-medium text-gray-900">{preview.subject}</div>
              </div>
            </div>
            
            {/* Email Body */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="h-8 object-contain" />
                ) : (
                  <div 
                    className="h-8 w-32 rounded"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <div className="h-full flex items-center justify-center text-white text-sm font-medium">
                      {settings.siteName}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="text-gray-900 whitespace-pre-wrap">{preview.content}</div>
                
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Best regards,<br />
                    The {settings.siteName} Team
                  </p>
                </div>
                
                <div className="pt-4 text-xs text-gray-400">
                  <p>This is an automated email from {settings.siteName}. Please do not reply to this email.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
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
                    updateSetting('welcomeSubject', e.target.value);
                  } else {
                    updateSetting('courseEnrollmentSubject', e.target.value);
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
                    updateSetting('welcomeContent', e.target.value);
                  } else {
                    updateSetting('courseEnrollmentContent', e.target.value);
                  }
                }}
                placeholder="Email content with variables"
                rows={8}
              />
            </div>
            
            <div className="flex gap-2">
              <Button>
                <Save className="w-4 h-4 mr-2" />
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
                    <Badge key={variable} variant="outline" className="block w-fit">
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
              checked={settings.enableRegistration}
              onCheckedChange={(checked) => updateSetting('enableRegistration', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-comments">Course Comments</Label>
              <p className="text-muted-foreground text-sm">Enable commenting on course content</p>
            </div>
            <Switch
              id="enable-comments"
              checked={settings.enableCourseComments}
              onCheckedChange={(checked) => updateSetting('enableCourseComments', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-ratings">Course Ratings</Label>
              <p className="text-muted-foreground text-sm">Allow students to rate courses</p>
            </div>
            <Switch
              id="enable-ratings"
              checked={settings.enableCourseRatings}
              onCheckedChange={(checked) => updateSetting('enableCourseRatings', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-certificates">Certificates</Label>
              <p className="text-muted-foreground text-sm">Generate completion certificates</p>
            </div>
            <Switch
              id="enable-certificates"
              checked={settings.enableCertificates}
              onCheckedChange={(checked) => updateSetting('enableCertificates', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-progress">Progress Tracking</Label>
              <p className="text-muted-foreground text-sm">Track student progress through courses</p>
            </div>
            <Switch
              id="enable-progress"
              checked={settings.enableProgressTracking}
              onCheckedChange={(checked) => updateSetting('enableProgressTracking', checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Features
        </Button>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
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
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-email-notifications">Email Notifications</Label>
              <p className="text-muted-foreground text-sm">Send notifications via email</p>
            </div>
            <Switch
              id="enable-email-notifications"
              checked={settings.enableEmailNotifications}
              onCheckedChange={(checked) => updateSetting('enableEmailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="enable-push-notifications">Push Notifications</Label>
              <p className="text-muted-foreground text-sm">Send browser/mobile push notifications</p>
            </div>
            <Switch
              id="enable-push-notifications"
              checked={settings.enablePushNotifications}
              onCheckedChange={(checked) => updateSetting('enablePushNotifications', checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg mb-4">Notification Types</h3>
        <div className="space-y-4">
          {Object.entries(settings.notificationTypes).map(([type, channels]) => (
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
                      disabled={!settings.enableEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${type}-push`} className="text-sm">Push</Label>
                    <Switch
                      id={`${type}-push`}
                      checked={channels.push}
                      onCheckedChange={(checked) => updateNotificationSetting(type, 'push', checked)}
                      disabled={!settings.enablePushNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${type}-inapp`} className="text-sm">In-App</Label>
                    <Switch
                      id={`${type}-inapp`}
                      checked={channels.inApp}
                      onCheckedChange={(checked) => updateNotificationSetting(type, 'inApp', checked)}
                      disabled={!settings.enableNotifications}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Notifications
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
      </Card>

      {/* Settings Content */}
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