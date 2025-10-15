import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bell, Send, Users, MessageCircle, Plus, Edit, Trash2, Target, Globe, User } from "lucide-react";

// Mock data based on your Notification models
const notifications = [
  {
    id: 1,
    title: "New Physics Chapter Available",
    subtitle: "Mechanics - Advanced Problems",
    icon: "📚",
    message_id: "notif_001",
    date: "2025-01-14T10:30:00Z",
    tag: "jee",
    status: "sent",
    recipients: 1250,
  },
  {
    id: 2,
    title: "Weekly Test Reminder",
    subtitle: "Mathematics test starting in 1 hour",
    icon: "⏰",
    message_id: "notif_002",
    date: "2025-01-14T09:15:00Z",
    tag: "personlized",
    status: "sent",
    recipients: 45,
  },
  {
    id: 3,
    title: "New Features Update",
    subtitle: "AI tutor improvements and bug fixes",
    icon: "🚀",
    message_id: "notif_003",
    date: "2025-01-13T14:20:00Z",
    tag: "global",
    status: "draft",
    recipients: 0,
  },
  {
    id: 4,
    title: "NEET Biology Chapter",
    subtitle: "Cell Biology - Fundamentals",
    icon: "🧬",
    message_id: "notif_004",
    date: "2025-01-13T11:30:00Z",
    tag: "neet",
    status: "scheduled",
    recipients: 876,
  }
];

const notificationTypes = [
  { value: "personlized", label: "Personalized", icon: User },
  { value: "global", label: "Global", icon: Globe },
  { value: "jee", label: "JEE", icon: Target },
  { value: "neet", label: "NEET", icon: Target },
  { value: "cat", label: "CAT", icon: Target },
  { value: "upsc", label: "UPSC", icon: Target },
  { value: "gate", label: "GATE", icon: Target },
  { value: "other_govt_exam", label: "Other Govt Exam", icon: Target }
];

// Template data
const notificationTemplates = [
  {
    id: 1,
    name: "New Content Available",
    description: "Course updates",
    icon: "📚",
    title: "New Chapter Available",
    subtitle: "Check out the latest content updates",
    tag: "global"
  },
  {
    id: 2,
    name: "Test Reminder",
    description: "Upcoming assessments",
    icon: "⏰",
    title: "Test Starting Soon",
    subtitle: "Your test begins in 1 hour",
    tag: "personlized"
  },
  {
    id: 3,
    name: "Goal Achievement",
    description: "Milestone celebrations",
    icon: "🎯",
    title: "Congratulations!",
    subtitle: "You've achieved a learning milestone",
    tag: "personlized"
  },
  {
    id: 4,
    name: "Feature Update",
    description: "New features",
    icon: "🚀",
    title: "New Features Available",
    subtitle: "Check out the latest platform updates",
    tag: "global"
  },
  {
    id: 5,
    name: "Progress Report",
    description: "Learning analytics",
    icon: "📊",
    title: "Your Progress Report",
    subtitle: "View your learning analytics and insights",
    tag: "personlized"
  },
  {
    id: 6,
    name: "Study Tip",
    description: "Learning advice",
    icon: "💡",
    title: "Study Tip of the Day",
    subtitle: "Boost your learning with this tip",
    tag: "global"
  }
];

export function NotificationManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("notifications");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    icon: "",
    tag: "global",
    schedule: "now"
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="default">Sent</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTagBadge = (tag: string) => {
    const type = notificationTypes.find(t => t.value === tag);
    return <Badge variant="outline">{type?.label || tag}</Badge>;
  };

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setFormData({
      title: template.title,
      subtitle: template.subtitle,
      icon: template.icon,
      tag: template.tag,
      schedule: "now"
    });
    setIsCreateDialogOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setSelectedNotification(null);
    setFormData({
      title: "",
      subtitle: "",
      icon: "",
      tag: "global",
      schedule: "now"
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditNotification = (notification: any) => {
    setSelectedNotification(notification);
    setSelectedTemplate(null);
    setFormData({
      title: notification.title,
      subtitle: notification.subtitle,
      icon: notification.icon,
      tag: notification.tag,
      schedule: "now"
    });
    setIsCreateDialogOpen(true);
  };

  const handleSendNotification = () => {
    // Here you would typically send the notification to your backend
    console.log("Sending notification:", formData);
    
    // Show success message
    alert(`Notification ${formData.schedule === "draft" ? "saved as draft" : formData.schedule === "schedule" ? "scheduled" : "sent"} successfully!`);
    
    setIsCreateDialogOpen(false);
    // Reset form
    setFormData({
      title: "",
      subtitle: "",
      icon: "",
      tag: "global",
      schedule: "now"
    });
    setSelectedTemplate(null);
    setSelectedNotification(null);
  };

  const totalNotifications = notifications.length;
  const sentNotifications = notifications.filter(n => n.status === "sent").length;
  const totalRecipients = notifications.reduce((sum, n) => sum + n.recipients, 0);

  // Calculate notification type distribution
  const notificationTypeDistribution = notificationTypes.map(type => {
    const typeNotifications = notifications.filter(n => n.tag === type.value);
    const percentage = (typeNotifications.length / totalNotifications) * 100;
    return {
      type: type,
      count: typeNotifications.length,
      percentage: percentage
    };
  }).filter(item => item.count > 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalNotifications}</div>
            <p className="text-xs text-muted-foreground">
              {sentNotifications} sent this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalRecipients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Users reached
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Templates</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{notificationTemplates.length}</div>
            <p className="text-xs text-muted-foreground">
              Available templates
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Notification Management</h3>
              <p className="text-muted-foreground">Create and manage push notifications for your users</p>
            </div>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Notification
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notification</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{notification.icon}</span>
                          <div>
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-muted-foreground">{notification.subtitle}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTagBadge(notification.tag)}</TableCell>
                      <TableCell>{notification.recipients.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(notification.status)}</TableCell>
                      <TableCell>{new Date(notification.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNotification(notification)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Distribution</CardTitle>
              <CardDescription>Percentage of notifications sent by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notificationTypeDistribution.map((item) => (
                  <div key={item.type.value} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <item.type.icon className="w-4 h-4" />
                        {item.type.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} notifications ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                
                {notificationTypeDistribution.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No notification data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>Pre-built templates for common notification types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notificationTemplates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground">{template.description}</div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="text-xs">
                        <span className="font-medium">Title:</span> {template.title}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Subtitle:</span> {template.subtitle}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Target:</span> {notificationTypes.find(t => t.value === template.tag)?.label}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Notification Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate 
                ? `Using Template: ${selectedTemplate.name}`
                : selectedNotification
                ? "Edit Notification"
                : "Create New Notification"
              }
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate 
                ? "Edit the template details as needed" 
                : selectedNotification
                ? "Modify the notification details"
                : "Create a new push notification for your users"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter notification title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input 
                id="subtitle" 
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                placeholder="Enter notification subtitle"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input 
                id="icon" 
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                placeholder="📚"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tag">Target Audience</Label>
              <Select 
                value={formData.tag} 
                onValueChange={(value) => setFormData({...formData, tag: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Select 
                value={formData.schedule} 
                onValueChange={(value) => setFormData({...formData, schedule: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Send Now</SelectItem>
                  <SelectItem value="schedule">Schedule for Later</SelectItem>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification}>
              <Send className="w-4 h-4 mr-2" />
              {formData.schedule === "draft" ? "Save Draft" : 
               formData.schedule === "schedule" ? "Schedule" : "Send"} Notification
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}