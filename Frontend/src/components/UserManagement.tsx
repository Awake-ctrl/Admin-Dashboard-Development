import { useState } from "react";
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
import { Users, Search, Filter, Download, Trash2, UserX, AlertTriangle, Calendar, BookOpen, Trophy, CreditCard } from "lucide-react";

const mockUsers = [
  {
    id: "user_001",
    name: "Arjun Patel",
    email: "arjun.patel@email.com",
    phone: "+91 9876543210",
    examType: "JEE",
    subscriptionStatus: "active",
    subscriptionPlan: "JEE Main + Advanced",
    joinDate: "2024-01-15",
    lastActive: "2024-08-19",
    totalStudyHours: 245,
    testsAttempted: 42,
    averageScore: 78,
    currentRank: 156,
    accountStatus: "active",
    deletionRequested: false,
    avatar: null
  },
  {
    id: "user_002",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 9876543211",
    examType: "NEET",
    subscriptionStatus: "active",
    subscriptionPlan: "NEET Premium",
    joinDate: "2024-02-20",
    lastActive: "2024-08-18",
    totalStudyHours: 189,
    testsAttempted: 38,
    averageScore: 85,
    currentRank: 89,
    accountStatus: "active",
    deletionRequested: false,
    avatar: null
  },
  {
    id: "user_003",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 9876543212",
    examType: "UPSC",
    subscriptionStatus: "expired",
    subscriptionPlan: "UPSC Comprehensive",
    joinDate: "2023-12-10",
    lastActive: "2024-08-10",
    totalStudyHours: 312,
    testsAttempted: 67,
    averageScore: 72,
    currentRank: 245,
    accountStatus: "suspended",
    deletionRequested: false,
    avatar: null
  },
  {
    id: "user_004",
    name: "Sneha Gupta",
    email: "sneha.gupta@email.com",
    phone: "+91 9876543213",
    examType: "CAT",
    subscriptionStatus: "cancelled",
    subscriptionPlan: "CAT Complete",
    joinDate: "2024-03-05",
    lastActive: "2024-07-25",
    totalStudyHours: 156,
    testsAttempted: 28,
    averageScore: 81,
    currentRank: null,
    accountStatus: "deletion_requested",
    deletionRequested: true,
    deletionRequestDate: "2024-08-15",
    deletionReason: "Privacy concerns and switching platforms",
    avatar: null
  }
];

const accountDeletionRequests = [
  {
    id: "del_001",
    userId: "user_004",
    userName: "Sneha Gupta",
    email: "sneha.gupta@email.com",
    requestDate: "2024-08-15T10:30:00Z",
    reason: "Privacy concerns and switching platforms",
    dataToDelete: ["Profile Data", "Study History", "Test Results", "Subscription Data", "Payment History"],
    dataToRetain: ["Aggregated Analytics (anonymized)", "Financial Records (legal requirement)"],
    status: "pending_review",
    estimatedDeletionDate: "2024-08-25T00:00:00Z",
    reviewedBy: null,
    approvedDate: null
  },
  {
    id: "del_002",
    userId: "user_005",
    userName: "Amit Singh",
    email: "amit.singh@email.com",
    requestDate: "2024-08-10T14:20:00Z",
    reason: "Completed exam, no longer need the platform",
    dataToDelete: ["Profile Data", "Study History", "Test Results"],
    dataToRetain: ["Aggregated Analytics (anonymized)"],
    status: "approved",
    estimatedDeletionDate: "2024-08-20T00:00:00Z",
    reviewedBy: "admin_001",
    approvedDate: "2024-08-12T09:00:00Z"
  }
];

export function UserManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");

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

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.accountStatus === statusFilter;
    const matchesExam = examFilter === "all" || user.examType === examFilter;
    return matchesSearch && matchesStatus && matchesExam;
  });

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
            <div className="text-2xl">12,847</div>
            <p className="text-xs text-muted-foreground">+234 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">9,652</div>
            <p className="text-xs text-green-600">+8.2% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Deletion Requests</CardTitle>
            <UserX className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">7</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Monthly Churn</CardTitle>
            <Trash2 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">2.3%</div>
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
                  <h4>Users by Exam Type</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>JEE</span>
                      <span>4,523 (35.2%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NEET</span>
                      <span>3,876 (30.2%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>UPSC</span>
                      <span>2,145 (16.7%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CAT</span>
                      <span>1,203 (9.4%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GATE</span>
                      <span>854 (6.6%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Others</span>
                      <span>246 (1.9%)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4>Subscription Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Subscribers</span>
                      <span>8,234 (64.1%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trial Users</span>
                      <span>2,145 (16.7%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expired</span>
                      <span>1,876 (14.6%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancelled</span>
                      <span>592 (4.6%)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4>Activity Levels</h4>
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
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Users
                  </Button>
                  {selectedUsers.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Bulk Edit ({selectedUsers.length})
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Bulk Suspend ({selectedUsers.length})
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Suspend Selected Users</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to suspend {selectedUsers.length} selected users? 
                              This action can be reversed later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600">Suspend Users</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
                    <TableRow key={user.id} className={user.deletionRequested ? "bg-orange-50" : ""}>
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
                              {user.deletionRequested && (
                                <AlertTriangle className="h-4 w-4 text-orange-500" title="Deletion Requested" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                            <div className="text-xs text-muted-foreground">{user.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.examType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getSubscriptionBadge(user.subscriptionStatus)}
                          <div className="text-xs text-muted-foreground">{user.subscriptionPlan}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            Last: {new Date(user.lastActive).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            {user.totalStudyHours}h studied
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{user.averageScore}% avg</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Trophy className="h-3 w-3" />
                            {user.currentRank ? `Rank #${user.currentRank}` : "Unranked"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.accountStatus)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">View</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>User Details - {user.name}</DialogTitle>
                                <DialogDescription>Complete user information and management options</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm">Full Name:</label>
                                    <p>{user.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm">Email:</label>
                                    <p>{user.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm">Phone:</label>
                                    <p>{user.phone}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm">Exam Type:</label>
                                    <p>{user.examType}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm">Join Date:</label>
                                    <p>{new Date(user.joinDate).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm">Last Active:</label>
                                    <p>{new Date(user.lastActive).toLocaleDateString()}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center p-3 bg-blue-50 rounded">
                                    <div className="text-2xl text-blue-600">{user.totalStudyHours}</div>
                                    <div className="text-xs text-muted-foreground">Study Hours</div>
                                  </div>
                                  <div className="text-center p-3 bg-green-50 rounded">
                                    <div className="text-2xl text-green-600">{user.testsAttempted}</div>
                                    <div className="text-xs text-muted-foreground">Tests Attempted</div>
                                  </div>
                                  <div className="text-center p-3 bg-purple-50 rounded">
                                    <div className="text-2xl text-purple-600">{user.averageScore}%</div>
                                    <div className="text-xs text-muted-foreground">Average Score</div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h4>Account Management</h4>
                                  <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm">
                                      <CreditCard className="w-4 h-4 mr-2" />
                                      View Subscription
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Reset Password
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Send Message
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-orange-600">
                                      Suspend Account
                                    </Button>
                                  </div>
                                </div>

                                {user.deletionRequested && (
                                  <div className="bg-orange-50 p-4 rounded border border-orange-200">
                                    <div className="flex items-center gap-2 mb-2">
                                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                                      <h4 className="text-orange-800">Account Deletion Requested</h4>
                                    </div>
                                    <p className="text-sm text-orange-700 mb-3">
                                      This user has requested account deletion on {new Date(user.deletionRequestDate).toLocaleDateString()}.
                                    </p>
                                    <div className="flex gap-2">
                                      <Button size="sm" className="bg-red-600">
                                        Process Deletion
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        Contact User
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Close</Button>
                                <Button>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          {!user.deletionRequested && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600">
                                  <UserX className="w-4 h-4" />
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
                                  <AlertDialogAction className="bg-red-600">Start Deletion Process</AlertDialogAction>
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
                  {accountDeletionRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{request.userName}</div>
                          <div className="text-xs text-muted-foreground">{request.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={request.reason}>
                          {request.reason}
                        </div>
                      </TableCell>
                      <TableCell>{getDeletionStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {new Date(request.estimatedDeletionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
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
                                  <label className="text-sm">User:</label>
                                  <p>{request.userName} ({request.email})</p>
                                </div>
                                <div>
                                  <label className="text-sm">Request Date:</label>
                                  <p>{new Date(request.requestDate).toLocaleDateString()}</p>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm">Deletion Reason:</label>
                                <p className="text-sm bg-muted p-3 rounded mt-1">{request.reason}</p>
                              </div>

                              <div>
                                <label className="text-sm">Data to be Deleted:</label>
                                <ul className="text-sm mt-1 space-y-1">
                                  {request.dataToDelete.map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <label className="text-sm">Data to be Retained:</label>
                                <ul className="text-sm mt-1 space-y-1">
                                  {request.dataToRetain.map((item, index) => (
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
                                  <h4 className="text-yellow-800">GDPR Compliance Notice</h4>
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
                                      <Button size="sm" className="bg-green-600">
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
                                        <AlertDialogAction className="bg-green-600">Approve & Schedule Deletion</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  
                                  <Button variant="outline" size="sm">
                                    Request More Information
                                  </Button>
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="text-red-600">
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
                                        <AlertDialogAction className="bg-red-600">Reject Request</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Close</Button>
                              {request.status === "approved" && (
                                <Button className="bg-red-600">Execute Deletion Now</Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* GDPR Compliance Information */}
          <Card>
            <CardHeader>
              <CardTitle>GDPR Compliance Guidelines</CardTitle>
              <CardDescription>Important information for handling account deletion requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4>Data Deletion Timeline</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                    <li>• Requests must be acknowledged within 3 days</li>
                    <li>• Complete deletion within 30 days of approval</li>
                    <li>• 7-day grace period for user cancellation</li>
                    <li>• Confirmation email sent after completion</li>
                  </ul>
                </div>
                <div>
                  <h4>Data Retention Requirements</h4>
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