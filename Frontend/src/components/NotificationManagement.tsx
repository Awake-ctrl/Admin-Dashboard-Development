import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Bell, Send, Users, MessageCircle, Plus, Edit, Trash2, Target, Globe, User, Loader2, TrendingUp } from "lucide-react";
import { notificationService, Notification, NotificationStats } from "./api/notificationService";
import { useToast } from "./ui/use-toast";

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

const notificationTemplates = [
  {
    id: 1,
    icon: "📚",
    title: "New Content Available",
    subtitle: "Check out our latest course materials",
    description: "Course updates",
    category: "content",
    tag: "global"
  },
  {
    id: 2,
    icon: "⏰",
    title: "Test Reminder",
    subtitle: "Your test is starting soon",
    description: "Upcoming assessments",
    category: "test",
    tag: "personlized"
  },
  {
    id: 3,
    icon: "🎯",
    title: "Goal Achievement",
    subtitle: "Congratulations on reaching your milestone!",
    description: "Milestone celebrations",
    category: "goal",
    tag: "global"
  },
  {
    id: 4,
    icon: "🚀",
    title: "Feature Update",
    subtitle: "New features are now available",
    description: "New features",
    category: "feature",
    tag: "global"
  },
  {
    id: 5,
    icon: "📊",
    title: "Progress Report",
    subtitle: "Your weekly learning summary is ready",
    description: "Learning analytics",
    category: "progress",
    tag: "personlized"
  },
  {
    id: 6,
    icon: "💡",
    title: "Study Tip",
    subtitle: "Here's a tip to improve your learning",
    description: "Learning advice",
    category: "tip",
    tag: "global"
  }
];

export function NotificationManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    icon: "",
    tag: "global",
    schedule: "now"
  });

  useEffect(() => {
    loadNotifications();
    loadStats();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await notificationService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let status = "draft";
      if (formData.schedule === "now") {
        status = "sent";
      } else if (formData.schedule === "schedule") {
        status = "scheduled";
      }

      const notificationData = {
        title: formData.title,
        subtitle: formData.subtitle?.trim() || undefined,
        icon: formData.icon?.trim() || undefined,
        tag: formData.tag,
        status: status
      };

      if (selectedNotification) {
        await notificationService.updateNotification(selectedNotification.id!, notificationData);
        toast({
          title: "Success",
          description: "Notification updated successfully"
        });
      } else {
        await notificationService.createNotification(notificationData);
        toast({
          title: "Success",
          description: status === "sent" ? "Notification sent successfully" : "Notification created successfully"
        });
      }

      setIsCreateDialogOpen(false);
      resetForm();
      loadNotifications();
      loadStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save notification",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      await notificationService.deleteNotification(id);
      toast({
        title: "Success",
        description: "Notification deleted successfully"
      });
      loadNotifications();
      loadStats();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setFormData({
      title: notification.title,
      subtitle: notification.subtitle || "",
      icon: notification.icon || "",
      tag: notification.tag,
      schedule: notification.status === "sent" ? "now" : notification.status === "scheduled" ? "schedule" : "draft"
    });
    setIsCreateDialogOpen(true);
  };

  const handleUseTemplate = (template: any) => {
    setFormData({
      title: template.title,
      subtitle: template.subtitle,
      icon: template.icon,
      tag: template.tag,
      schedule: "draft"
    });
    setSelectedNotification(null);
    setIsCreateDialogOpen(true);
    setActiveTab("notifications");
    toast({
      title: "Template Loaded",
      description: "Template has been loaded. Customize and send!",
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      icon: "",
      tag: "global",
      schedule: "now"
    });
    setSelectedNotification(null);
  };

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

  // Calculate analytics data
  const getAnalyticsData = () => {
    const byTag = notificationTypes.map(type => {
      const tagNotifs = notifications.filter(n => n.tag === type.value && n.status === "sent");
      
      return {
        tag: type.label,
        icon: type.icon,
        count: tagNotifs.length,
        recipients: tagNotifs.reduce((sum, n) => sum + (n.recipients_count || 0), 0)
      };
    }).filter(item => item.count > 0);

    const topPerforming = [...notifications]
      .filter(n => n.status === "sent")
      .sort((a, b) => (b.recipients_count || 0) - (a.recipients_count || 0))
      .slice(0, 3);

    return { byTag, topPerforming };
  };

  const analytics = getAnalyticsData();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_notifications || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.sent_notifications || 0} sent this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_recipients?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Users reached
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
              <p className="text-sm text-muted-foreground">Create and manage push notifications for your users</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              setIsCreateDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedNotification ? "Edit Notification" : "Create New Notification"}</DialogTitle>
                  <DialogDescription>
                    {selectedNotification ? "Modify the notification details" : "Create a new push notification for your users"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
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
                      placeholder="Enter subtitle (optional)"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="icon">Icon (Emoji)</Label>
                    <Input 
                      id="icon" 
                      placeholder="📚" 
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value.trim()})}
                      maxLength={2}
                      className="text-2xl"
                    />
                    <p className="text-xs text-muted-foreground">Enter a single emoji (e.g., 📚, 🎯, 🚀)</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tag">Target Audience *</Label>
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
                    <Label htmlFor="schedule">Schedule *</Label>
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
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateOrUpdate}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {selectedNotification ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {selectedNotification ? "Update" : formData.schedule === "now" ? "Send" : "Save"} Notification
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No notifications found. Create your first notification!
                </div>
              ) : (
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
                            <span className="text-2xl">{notification.icon || "📧"}</span>
                            <div>
                              <div className="font-medium">{notification.title}</div>
                              <div className="text-sm text-muted-foreground">{notification.subtitle}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTagBadge(notification.tag)}</TableCell>
                        <TableCell className="text-right font-medium">{notification.recipients_count?.toLocaleString() || 0}</TableCell>
                        <TableCell>{getStatusBadge(notification.status)}</TableCell>
                        <TableCell>
                          {notification.created_at 
                            ? new Date(notification.created_at).toLocaleDateString()
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(notification)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(notification.id!)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Audience</CardTitle>
                <CardDescription>Notifications sent by target audience</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.byTag.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.byTag.map((item) => (
                      <div key={item.tag} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2 text-sm">
                            <item.icon className="w-4 h-4" />
                            {item.tag}
                          </span>
                          <span className="text-sm font-medium">
                            {item.recipients.toLocaleString()} recipients
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all" 
                            style={{ width: `${Math.min((item.count / notifications.filter(n => n.status === "sent").length) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{item.count} notifications sent</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No analytics data available yet</p>
                    <p className="text-sm">Send notifications to see performance metrics</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Notifications by Reach</CardTitle>
                <CardDescription>Highest recipient counts</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topPerforming.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.topPerforming.map((notif, index) => (
                      <div key={notif.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{notif.icon || "📧"}</span>
                          <div>
                            <div className="text-sm font-medium">{notif.title}</div>
                            <div className="text-xs text-muted-foreground">{notif.subtitle}</div>
                          </div>
                        </div>
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          {notif.recipients_count?.toLocaleString() || 0}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No performance data yet</p>
                    <p className="text-sm">Top notifications will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
                  <Card key={template.id} className="hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl">{template.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{template.title}</div>
                          <div className="text-sm text-muted-foreground mb-2">{template.subtitle}</div>
                          <Badge variant="outline" className="text-xs">{template.description}</Badge>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}