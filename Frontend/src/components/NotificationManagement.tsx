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
    openRate: 68.5,
    clickRate: 12.3
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
    openRate: 89.2,
    clickRate: 34.1
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
    openRate: 0,
    clickRate: 0
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
    openRate: 0,
    clickRate: 0
  }
];

const subscribers = [
  {
    id: 1,
    userId: 1001,
    userName: "Arjun Sharma",
    email: "arjun@example.com",
    tags: ["jee", "global"],
    joinDate: "2025-01-10T10:00:00Z",
    isActive: true
  },
  {
    id: 2,
    userId: 1002,
    userName: "Priya Patel",
    email: "priya@example.com",
    tags: ["neet", "global"],
    joinDate: "2025-01-09T15:30:00Z",
    isActive: true
  },
  {
    id: 3,
    userId: 1003,
    userName: "Rahul Gupta",
    email: "rahul@example.com",
    tags: ["jee", "cat"],
    joinDate: "2025-01-08T09:20:00Z",
    isActive: false
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

export function NotificationManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("notifications");

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

  const totalNotifications = notifications.length;
  const sentNotifications = notifications.filter(n => n.status === "sent").length;
  const totalRecipients = notifications.reduce((sum, n) => sum + n.recipients, 0);
  const avgOpenRate = notifications.filter(n => n.status === "sent").reduce((sum, n) => sum + n.openRate, 0) / sentNotifications || 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <CardTitle className="text-sm">Open Rate</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{avgOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average across all notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active subscribers
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3>Notification Management</h3>
              <p className="text-muted-foreground">Create and manage push notifications for your users</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedNotification(null)}>
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
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" defaultValue={selectedNotification?.title || ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input id="subtitle" defaultValue={selectedNotification?.subtitle || ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="icon">Icon (Emoji)</Label>
                    <Input id="icon" placeholder="📚" defaultValue={selectedNotification?.icon || ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tag">Target Audience</Label>
                    <Select defaultValue={selectedNotification?.tag || "global"}>
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
                    <Select defaultValue="now">
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
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    <Send className="w-4 h-4 mr-2" />
                    {selectedNotification ? "Update" : "Send"} Notification
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notification</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Open Rate</TableHead>
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
                            <div>{notification.title}</div>
                            <div className="text-sm text-muted-foreground">{notification.subtitle}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTagBadge(notification.tag)}</TableCell>
                      <TableCell>{notification.recipients.toLocaleString()}</TableCell>
                      <TableCell>
                        {notification.status === "sent" ? (
                          <div className="text-sm">
                            {notification.openRate}%
                            <div className="text-xs text-muted-foreground">
                              {notification.clickRate}% clicked
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(notification.status)}</TableCell>
                      <TableCell>{new Date(notification.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedNotification(notification);
                              setIsCreateDialogOpen(true);
                            }}
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

        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Subscribers</CardTitle>
              <CardDescription>Manage users who have subscribed to notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Subscribed Tags</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="" />
                            <AvatarFallback>{subscriber.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{subscriber.userName}</div>
                            <div className="text-sm text-muted-foreground">{subscriber.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subscriber.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {notificationTypes.find(t => t.value === tag)?.label || tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(subscriber.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                          {subscriber.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={subscriber.isActive} 
                            onCheckedChange={() => {}} 
                            size="sm"
                          />
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Performance</CardTitle>
                <CardDescription>Open and click rates by notification type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationTypes.slice(0, 5).map((type) => {
                    const typeNotifications = notifications.filter(n => n.tag === type.value && n.status === "sent");
                    const avgOpenRate = typeNotifications.reduce((sum, n) => sum + n.openRate, 0) / typeNotifications.length || 0;
                    const avgClickRate = typeNotifications.reduce((sum, n) => sum + n.clickRate, 0) / typeNotifications.length || 0;
                    
                    return (
                      <div key={type.value} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </span>
                          <span className="text-sm">{avgOpenRate.toFixed(1)}% / {avgClickRate.toFixed(1)}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${avgOpenRate}%` }}
                            />
                          </div>
                          <div className="w-full bg-muted rounded-full h-1">
                            <div 
                              className="bg-green-500 h-1 rounded-full" 
                              style={{ width: `${avgClickRate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>Recent notification engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="text-sm">Best Performing</div>
                      <div className="text-xs text-muted-foreground">Weekly Test Reminder</div>
                    </div>
                    <Badge variant="default">89.2% open rate</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="text-sm">Most Clicked</div>
                      <div className="text-xs text-muted-foreground">Weekly Test Reminder</div>
                    </div>
                    <Badge variant="secondary">34.1% click rate</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="text-sm">Widest Reach</div>
                      <div className="text-xs text-muted-foreground">New Physics Chapter</div>
                    </div>
                    <Badge variant="outline">1,250 users</Badge>
                  </div>
                </div>
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
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">📚</span>
                    <div>
                      <div className="text-sm">New Content Available</div>
                      <div className="text-xs text-muted-foreground">Course updates</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Use Template</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <div className="text-sm">Test Reminder</div>
                      <div className="text-xs text-muted-foreground">Upcoming assessments</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Use Template</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <div className="text-sm">Goal Achievement</div>
                      <div className="text-xs text-muted-foreground">Milestone celebrations</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Use Template</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <div className="text-sm">Feature Update</div>
                      <div className="text-xs text-muted-foreground">New features</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Use Template</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <div className="text-sm">Progress Report</div>
                      <div className="text-xs text-muted-foreground">Learning analytics</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Use Template</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <div className="text-sm">Study Tip</div>
                      <div className="text-xs text-muted-foreground">Learning advice</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Use Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}