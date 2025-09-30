import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Checkbox } from "./ui/checkbox";
import { Users, Search, Filter, Download, Trash2, UserX, AlertTriangle, Calendar, BookOpen, Trophy, CreditCard, Loader2, Mail, Key, MessageSquare } from "lucide-react";
import { userService, User, AccountDeletionRequest, UserStats, UserDemographics, SubscriptionStats } from "./api/userService";
import { toast } from "sonner"; // Assuming you're using sonner for notifications

export function UserManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");
  
  // State for data from backend
  const [users, setUsers] = useState<User[]>([]);
  const [deletionRequests, setDeletionRequests] = useState<AccountDeletionRequest[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userDemographics, setUserDemographics] = useState<UserDemographics[]>([]);
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // State for forms and dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");

  // Load data based on active tab
  useEffect(() => {
    loadData();
  }, [activeTab, statusFilter, examFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "overview":
          const [stats, demographics, subscriptions] = await Promise.all([
            userService.getUserStats(),
            userService.getUserDemographics(),
            userService.getSubscriptionStats()
          ]);
          setUserStats(stats);
          setUserDemographics(demographics.demographics);
          setSubscriptionStats(subscriptions.subscription_stats);
          break;
        case "management":
          const usersData = await userService.getUsers({
            account_status: statusFilter !== "all" ? statusFilter : undefined,
            exam_type: examFilter !== "all" ? examFilter : undefined
          });
          setUsers(usersData);
          break;
        case "deletions":
          const requestsData = await userService.getDeletionRequests();
          setDeletionRequests(requestsData);
          break;
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Status badge functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "deletion_requested":
        return <Badge className="bg-orange-500">Deletion Requested</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "expired":
        return <Badge className="bg-orange-500">Expired</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "trial":
        return <Badge variant="secondary">Trial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeletionStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge className="bg-orange-500">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Selection handlers
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    );
  };

  // User action handlers
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;
    
    setActionLoading(`update-${selectedUser.id}`);
    try {
      await userService.updateUser(selectedUser.id, userData);
      toast.success("User updated successfully");
      setIsUserDialogOpen(false);
      loadData();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    setActionLoading(`suspend-${userId}`);
    try {
      await userService.updateUser(userId, { account_status: "suspended" });
      toast.success("User suspended successfully");
      loadData();
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error("Failed to suspend user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivateUser = async (userId: string) => {
    setActionLoading(`activate-${userId}`);
    try {
      await userService.updateUser(userId, { account_status: "active" });
      toast.success("User activated successfully");
      loadData();
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Failed to activate user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async (userId: string) => {
    setActionLoading(`reset-password-${userId}`);
    try {
      // This would typically call a backend endpoint to reset password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Password reset email sent");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendMessage = async (userId: string) => {
    setActionLoading(`message-${userId}`);
    try {
      // This would typically call a backend endpoint to send message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setActionLoading(null);
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;

    setActionLoading("bulk-action");
    try {
      const updates = selectedUsers.map(userId => {
        switch (action) {
          case "suspend":
            return userService.updateUser(userId, { account_status: "suspended" });
          case "activate":
            return userService.updateUser(userId, { account_status: "active" });
          case "export":
            // Handle export logic
            return Promise.resolve();
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(updates);
      
      if (action !== "export") {
        toast.success(`Bulk ${action} completed for ${selectedUsers.length} users`);
        setSelectedUsers([]);
        loadData();
      } else {
        handleExportUsers();
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Failed to perform bulk action");
    } finally {
      setActionLoading(null);
      setIsBulkEditOpen(false);
    }
  };

  const handleExportUsers = () => {
    const dataToExport = users.filter(user => selectedUsers.includes(user.id));
    const csvContent = [
      ["ID", "Name", "Email", "Phone", "Exam Type", "Subscription Status", "Account Status"],
      ...dataToExport.map(user => [
        user.id,
        user.name,
        user.email,
        user.phone,
        user.exam_type,
        user.subscription_status,
        user.account_status
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${selectedUsers.length} users`);
    setSelectedUsers([]);
  };

  // Deletion request handlers
  const handleInitiateDeletion = async (userId: string) => {
    setActionLoading(`delete-${userId}`);
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        await userService.updateUser(userId, { 
          deletion_requested: true,
          account_status: "deletion_requested"
        });
        
        await userService.createDeletionRequest({
          user_id: userId,
          user_name: user.name,
          email: user.email,
          request_date: new Date().toISOString(),
          reason: "Admin initiated deletion",
          data_to_delete: ["Profile Data", "Study History", "Test Results", "Subscription Data", "Payment History"],
          data_to_retain: ["Aggregated Analytics (anonymized)", "Financial Records (legal requirement)"],
          status: "pending_review",
          estimated_deletion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
        
        toast.success("Deletion request initiated");
        loadData();
      }
    } catch (error) {
      console.error("Error initiating deletion:", error);
      toast.error("Failed to initiate deletion");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveDeletion = async (requestId: string) => {
    setActionLoading(`approve-${requestId}`);
    try {
      await userService.updateDeletionRequest(requestId, {
        status: "approved",
        reviewed_by: "admin",
        approved_date: new Date().toISOString()
      });
      
      toast.success("Deletion request approved");
      loadData();
    } catch (error) {
      console.error("Error approving deletion:", error);
      toast.error("Failed to approve deletion");
    } finally {
      setActionLoading(null);
    }
  };

 const handleRejectDeletion = async (requestId: string) => {
    setActionLoading(`reject-${requestId}`);
    try {
        const request = deletionRequests.find(r => r.id === requestId);
        if (request) {
            // Update user status first
            await userService.updateUser(request.user_id, {
                deletion_requested: false,
                account_status: "active"
            });
            
            // Then remove the deletion request from database
            await userService.deleteDeletionRequest(requestId);
            
            toast.success("Deletion request rejected and removed");
            loadData();
        }
    } catch (error) {
        console.error("Error rejecting deletion:", error);
        toast.error("Failed to reject deletion request");
    } finally {
        setActionLoading(null);
    }
};

  const handleExecuteDeletion = async (requestId: string) => {
    setActionLoading(`execute-${requestId}`);
    try {
      const request = deletionRequests.find(r => r.id === requestId);
      if (request) {
        // First update the request status
        await userService.updateDeletionRequest(requestId, {
          status: "completed"
        });
        
        // Then delete the user (this would be the actual deletion logic)
        await userService.deleteUser(request.user_id);
        
        toast.success("User account deleted successfully");
        loadData();
      }
    } catch (error) {
      console.error("Error executing deletion:", error);
      toast.error("Failed to delete user account");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && activeTab === "overview") {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userStats?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">+234 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userStats?.active_users || 0}</div>
            <p className="text-xs text-green-600">+8.2% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Deletion Requests</CardTitle>
            <UserX className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userStats?.deletion_requests || 0}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Monthly Churn</CardTitle>
            <Trash2 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userStats?.monthly_churn || 0}%</div>
            <p className="text-xs text-green-600">-0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">User Overview</TabsTrigger>
          <TabsTrigger value="management">User Management</TabsTrigger>
          <TabsTrigger value="deletions">Account Deletions</TabsTrigger>
        </TabsList>

        {/* User Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>Overview of user demographics and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Users by Exam Type</h4>
                  <div className="space-y-2">
                    {userDemographics.map((demo) => (
                      <div key={demo.exam_type} className="flex justify-between">
                        <span>{demo.exam_type}</span>
                        <span>{demo.count} ({demo.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Subscription Status</h4>
                  <div className="space-y-2">
                    {subscriptionStats.map((stat) => (
                      <div key={stat.status} className="flex justify-between">
                        <span className="capitalize">{stat.status}</span>
                        <span>{stat.count} ({stat.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Activity Levels</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Daily Active</span>
                      <span>5,234 (40.7%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly Active</span>
                      <span>7,845 (61.1%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Active</span>
                      <span>9,652 (75.1%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inactive (30+ days)</span>
                      <span>3,195 (24.9%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts, subscriptions, and access</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExportUsers}
                    disabled={selectedUsers.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Users ({selectedUsers.length})
                  </Button>
                  {selectedUsers.length > 0 && (
                    <div className="flex gap-2">
                      <Dialog open={isBulkEditOpen} onOpenChange={setIsBulkEditOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Bulk Actions ({selectedUsers.length})
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Bulk Actions</DialogTitle>
                            <DialogDescription>
                              Choose an action to perform on {selectedUsers.length} selected users
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => handleBulkAction("activate")}
                              disabled={actionLoading === "bulk-action"}
                            >
                              {actionLoading === "bulk-action" ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : null}
                              Activate Selected
                            </Button>
                            <Button 
                              variant="outline" 
                              className="text-orange-600"
                              onClick={() => handleBulkAction("suspend")}
                              disabled={actionLoading === "bulk-action"}
                            >
                              {actionLoading === "bulk-action" ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : null}
                              Suspend Selected
                            </Button>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsBulkEditOpen(false)}>
                              Cancel
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4 items-center flex-wrap">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Account Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="deletion_requested">Deletion Requested</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={examFilter} onValueChange={setExamFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Exam Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exams</SelectItem>
                    <SelectItem value="JEE">JEE</SelectItem>
                    <SelectItem value="NEET">NEET</SelectItem>
                    <SelectItem value="UPSC">UPSC</SelectItem>
                    <SelectItem value="CAT">CAT</SelectItem>
                    <SelectItem value="GATE">GATE</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* Users Table */}
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Exam Type</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className={user.deletion_requested ? "bg-orange-50" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleSelectUser(user.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <div>{user.name}</div>
                                {user.deletion_requested && (
                                  <AlertTriangle className="h-4 w-4 text-orange-500" title="Deletion Requested" />
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                              <div className="text-xs text-muted-foreground">{user.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.exam_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getSubscriptionBadge(user.subscription_status)}
                            <div className="text-xs text-muted-foreground">{user.subscription_plan}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="h-3 w-3" />
                              Last: {user.last_active ? formatDate(user.last_active) : 'Never'}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <BookOpen className="h-3 w-3" />
                              {user.total_study_hours}h studied
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{user.average_score}% avg</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Trophy className="h-3 w-3" />
                              {user.current_rank ? `Rank #${user.current_rank}` : "Unranked"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.account_status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewUser(user)}
                            >
                              View
                            </Button>
                            
                            {user.account_status === "active" ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-orange-600"
                                    disabled={actionLoading === `suspend-${user.id}`}
                                  >
                                    {actionLoading === `suspend-${user.id}` ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      "Suspend"
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Suspend User Account</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to suspend {user.name}'s account? 
                                      They will not be able to access the platform until reactivated.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-orange-600"
                                      onClick={() => handleSuspendUser(user.id)}
                                    >
                                      Suspend Account
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600"
                                onClick={() => handleActivateUser(user.id)}
                                disabled={actionLoading === `activate-${user.id}`}
                              >
                                {actionLoading === `activate-${user.id}` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Activate"
                                )}
                              </Button>
                            )}
                            
                            {!user.deletion_requested && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-600"
                                    disabled={actionLoading === `delete-${user.id}`}
                                  >
                                    {actionLoading === `delete-${user.id}` ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <UserX className="w-4 h-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Initiate Account Deletion</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will start the account deletion process for {user.name}. 
                                      The user will be notified and have 7 days to cancel before permanent deletion.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-red-600"
                                      onClick={() => handleInitiateDeletion(user.id)}
                                    >
                                      Start Deletion Process
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
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

        {/* Account Deletions Tab */}
        <TabsContent value="deletions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Deletion Requests</CardTitle>
              <CardDescription>
                Manage user account deletion requests and ensure GDPR compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading deletion requests...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled Deletion</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletionRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <div>{request.user_name}</div>
                            <div className="text-xs text-muted-foreground">{request.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(request.request_date)}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={request.reason}>
                            {request.reason}
                          </div>
                        </TableCell>
                        <TableCell>{getDeletionStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.estimated_deletion_date ? formatDate(request.estimated_deletion_date) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Review</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Account Deletion Request - {request.id}</DialogTitle>
                                  <DialogDescription>Review and process account deletion request</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">User:</label>
                                      <p>{request.user_name} ({request.email})</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Request Date:</label>
                                      <p>{formatDate(request.request_date)}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium">Deletion Reason:</label>
                                    <p className="text-sm bg-muted p-3 rounded mt-1">{request.reason}</p>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium">Data to be Deleted:</label>
                                    <ul className="text-sm mt-1 space-y-1">
                                      {request.data_to_delete.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium">Data to be Retained:</label>
                                    <ul className="text-sm mt-1 space-y-1">
                                      {request.data_to_retain.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                                    <div className="flex items-center gap-2 mb-2">
                                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                      <h4 className="text-yellow-800 font-medium">GDPR Compliance Notice</h4>
                                    </div>
                                    <p className="text-sm text-yellow-700">
                                      This deletion request must be processed within 30 days as per GDPR requirements. 
                                      Certain financial data may be retained for legal compliance purposes.
                                    </p>
                                  </div>

                                  {request.status === "pending_review" && (
                                    <div className="flex gap-2">
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button 
                                            size="sm" 
                                            className="bg-green-600"
                                            disabled={actionLoading === `approve-${request.id}`}
                                          >
                                            {actionLoading === `approve-${request.id}` ? (
                                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : null}
                                            Approve Deletion
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Approve Account Deletion</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to approve this account deletion request? 
                                              This action cannot be undone and all specified data will be permanently deleted.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                              className="bg-green-600"
                                              onClick={() => handleApproveDeletion(request.id)}
                                            >
                                              Approve & Schedule Deletion
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                      
                                      <Button variant="outline" size="sm">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Contact User
                                      </Button>
                                      
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="text-red-600"
                                            disabled={actionLoading === `reject-${request.id}`}
                                          >
                                            {actionLoading === `reject-${request.id}` ? (
                                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : null}
                                            Reject Request
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Reject Deletion Request</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Please provide a valid reason for rejecting this account deletion request. 
                                              The user will be notified of your decision.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                              className="bg-red-600"
                                              onClick={() => handleRejectDeletion(request.id)}
                                            >
                                              Reject Request
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  )}

                                  {request.status === "approved" && (
                                    <div className="flex gap-2">
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button 
                                            size="sm" 
                                            className="bg-red-600"
                                            disabled={actionLoading === `execute-${request.id}`}
                                          >
                                            {actionLoading === `execute-${request.id}` ? (
                                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : null}
                                            Execute Deletion Now
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Execute Account Deletion</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This will permanently delete the user account and all specified data. 
                                              This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                              className="bg-red-600"
                                              onClick={() => handleExecuteDeletion(request.id)}
                                            >
                                              Delete Account Permanently
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Close</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* User Details Dialog */}
          <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>User Details - {selectedUser?.name}</DialogTitle>
                <DialogDescription>Complete user information and management options</DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name:</label>
                      <p>{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email:</label>
                      <p>{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone:</label>
                      <p>{selectedUser.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Exam Type:</label>
                      <p>{selectedUser.exam_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Join Date:</label>
                      <p>{selectedUser.join_date ? formatDate(selectedUser.join_date) : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Active:</label>
                      <p>{selectedUser.last_active ? formatDate(selectedUser.last_active) : 'Never'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl text-blue-600">{selectedUser.total_study_hours}</div>
                      <div className="text-xs text-muted-foreground">Study Hours</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl text-green-600">{selectedUser.tests_attempted}</div>
                      <div className="text-xs text-muted-foreground">Tests Attempted</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-2xl text-purple-600">{selectedUser.average_score}%</div>
                      <div className="text-xs text-muted-foreground">Average Score</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Account Management</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <CreditCard className="w-4 h-4 mr-2" />
                        View Subscription
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleResetPassword(selectedUser.id)}
                        disabled={actionLoading === `reset-password-${selectedUser.id}`}
                      >
                        {actionLoading === `reset-password-${selectedUser.id}` ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Key className="w-4 h-4 mr-2" />
                        )}
                        Reset Password
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendMessage(selectedUser.id)}
                        disabled={actionLoading === `message-${selectedUser.id}`}
                      >
                        {actionLoading === `message-${selectedUser.id}` ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Mail className="w-4 h-4 mr-2" />
                        )}
                        Send Message
                      </Button>
                      {selectedUser.account_status === "active" ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-orange-600"
                          onClick={() => handleSuspendUser(selectedUser.id)}
                          disabled={actionLoading === `suspend-${selectedUser.id}`}
                        >
                          {actionLoading === `suspend-${selectedUser.id}` ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            "Suspend Account"
                          )}
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600"
                          onClick={() => handleActivateUser(selectedUser.id)}
                          disabled={actionLoading === `activate-${selectedUser.id}`}
                        >
                          {actionLoading === `activate-${selectedUser.id}` ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            "Activate Account"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {selectedUser.deletion_requested && (
                    <div className="bg-orange-50 p-4 rounded border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <h4 className="text-orange-800 font-medium">Account Deletion Requested</h4>
                      </div>
                      <p className="text-sm text-orange-700 mb-3">
                        This user has requested account deletion on {selectedUser.deletion_request_date ? formatDate(selectedUser.deletion_request_date) : 'unknown date'}.
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-red-600"
                          onClick={() => handleExecuteDeletion(selectedUser.id)}
                        >
                          Process Deletion
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact User
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => handleUpdateUser({})}
                  disabled={actionLoading === `update-${selectedUser?.id}`}
                >
                  {actionLoading === `update-${selectedUser?.id}` ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* GDPR Compliance Information */}
          <Card>
            <CardHeader>
              <CardTitle>GDPR Compliance Guidelines</CardTitle>
              <CardDescription>Important information for handling account deletion requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium">Data Deletion Timeline</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                    <li>• Requests must be acknowledged within 3 days</li>
                    <li>• Complete deletion within 30 days of approval</li>
                    <li>• 7-day grace period for user cancellation</li>
                    <li>• Confirmation email sent after completion</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Data Retention Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                    <li>• Financial records (7 years)</li>
                    <li>• Anonymized analytics data</li>
                    <li>• Legal compliance data</li>
                    <li>• Fraud prevention records</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}