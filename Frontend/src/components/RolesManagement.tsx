import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { 
  Shield, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Settings,
  Eye,
  Lock,
  Unlock,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Crown,
  Star,
  Award,
  UserCog
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  userCount: number;
  isActive: boolean;
  isSystem: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    level: 10,
    userCount: 2,
    isActive: true,
    isSystem: true,
    permissions: ["all"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "Admin",
    description: "Administrative access to most platform features",
    level: 8,
    userCount: 5,
    isActive: true,
    isSystem: true,
    permissions: ["user_management", "course_management", "content_management", "analytics_view"],
    createdAt: "2024-01-15",
    updatedAt: "2024-02-10"
  },
  {
    id: "3",
    name: "Teacher",
    description: "Access to teaching tools and student management",
    level: 6,
    userCount: 45,
    isActive: true,
    isSystem: false,
    permissions: ["course_create", "student_view", "assessment_create", "content_create"],
    createdAt: "2024-01-16",
    updatedAt: "2024-03-05"
  },
  {
    id: "4",
    name: "Content Manager",
    description: "Manages educational content and materials",
    level: 5,
    userCount: 12,
    isActive: true,
    isSystem: false,
    permissions: ["content_management", "course_edit", "media_upload"],
    createdAt: "2024-01-20",
    updatedAt: "2024-02-28"
  },
  {
    id: "5",
    name: "Support Staff",
    description: "Customer support and help desk access",
    level: 4,
    userCount: 8,
    isActive: true,
    isSystem: false,
    permissions: ["support_tickets", "user_view", "feedback_management"],
    createdAt: "2024-02-01",
    updatedAt: "2024-03-01"
  },
  {
    id: "6",
    name: "Analyst",
    description: "Access to analytics and reporting features",
    level: 4,
    userCount: 3,
    isActive: true,
    isSystem: false,
    permissions: ["analytics_view", "reports_generate", "data_export"],
    createdAt: "2024-02-15",
    updatedAt: "2024-03-10"
  }
];

const permissionCategories = {
  "User Management": [
    { id: "user_create", name: "Create Users", description: "Add new users to the system" },
    { id: "user_edit", name: "Edit Users", description: "Modify user profiles and settings" },
    { id: "user_delete", name: "Delete Users", description: "Remove users from the system" },
    { id: "user_view", name: "View Users", description: "Access user profiles and lists" },
    { id: "user_management", name: "Full User Management", description: "Complete user management access" }
  ],
  "Course Management": [
    { id: "course_create", name: "Create Courses", description: "Add new courses" },
    { id: "course_edit", name: "Edit Courses", description: "Modify existing courses" },
    { id: "course_delete", name: "Delete Courses", description: "Remove courses" },
    { id: "course_management", name: "Full Course Management", description: "Complete course management access" }
  ],
  "Content Management": [
    { id: "content_create", name: "Create Content", description: "Add educational materials" },
    { id: "content_edit", name: "Edit Content", description: "Modify existing content" },
    { id: "content_delete", name: "Delete Content", description: "Remove content" },
    { id: "content_management", name: "Full Content Management", description: "Complete content management access" },
    { id: "media_upload", name: "Media Upload", description: "Upload videos, images, documents" }
  ],
  "Analytics & Reports": [
    { id: "analytics_view", name: "View Analytics", description: "Access platform analytics" },
    { id: "reports_generate", name: "Generate Reports", description: "Create custom reports" },
    { id: "data_export", name: "Export Data", description: "Download platform data" }
  ],
  "Support & Communication": [
    { id: "support_tickets", name: "Manage Support", description: "Handle support tickets" },
    { id: "feedback_management", name: "Manage Feedback", description: "View and respond to feedback" },
    { id: "notifications_send", name: "Send Notifications", description: "Send platform notifications" }
  ],
  "Assessment": [
    { id: "assessment_create", name: "Create Assessments", description: "Add tests and quizzes" },
    { id: "assessment_grade", name: "Grade Assessments", description: "Review and grade submissions" },
    { id: "assessment_manage", name: "Manage Assessments", description: "Full assessment control" }
  ],
  "System": [
    { id: "system_settings", name: "System Settings", description: "Modify platform settings" },
    { id: "role_management", name: "Role Management", description: "Manage user roles and permissions" },
    { id: "billing_management", name: "Billing Management", description: "Handle subscriptions and payments" }
  ]
};

export function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    level: 1,
    permissions: [] as string[]
  });

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "all" || 
                        (filterLevel === "system" && role.isSystem) ||
                        (filterLevel === "custom" && !role.isSystem) ||
                        (filterLevel === "high" && role.level >= 7) ||
                        (filterLevel === "medium" && role.level >= 4 && role.level < 7) ||
                        (filterLevel === "low" && role.level < 4);
    return matchesSearch && matchesLevel;
  });

  const handleCreateRole = () => {
    const role: Role = {
      id: (roles.length + 1).toString(),
      name: newRole.name,
      description: newRole.description,
      level: newRole.level,
      userCount: 0,
      isActive: true,
      isSystem: false,
      permissions: newRole.permissions,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setRoles([...roles, role]);
    setNewRole({ name: "", description: "", level: 1, permissions: [] });
    setIsCreateModalOpen(false);
  };

  const handleTogglePermission = (permissionId: string, isChecked: boolean) => {
    if (isChecked) {
      setNewRole({ ...newRole, permissions: [...newRole.permissions, permissionId] });
    } else {
      setNewRole({ ...newRole, permissions: newRole.permissions.filter(p => p !== permissionId) });
    }
  };

  const getRoleIcon = (role: Role) => {
    if (role.level >= 9) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (role.level >= 7) return <Star className="w-4 h-4 text-orange-500" />;
    if (role.level >= 5) return <Award className="w-4 h-4 text-blue-500" />;
    return <Shield className="w-4 h-4 text-gray-500" />;
  };

  const getLevelColor = (level: number) => {
    if (level >= 9) return "bg-yellow-500";
    if (level >= 7) return "bg-orange-500";
    if (level >= 5) return "bg-blue-500";
    return "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2">Roles Management</h1>
          <p className="text-muted-foreground">
            Manage user roles, permissions, and access levels across the platform
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions and access levels
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input
                    id="role-name"
                    placeholder="e.g., Content Moderator"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-level">Access Level (1-10)</Label>
                  <Select 
                    value={newRole.level.toString()} 
                    onValueChange={(value) => setNewRole({ ...newRole, level: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(level => (
                        <SelectItem key={level} value={level.toString()}>
                          Level {level} {level >= 9 ? "(Critical)" : level >= 7 ? "(High)" : level >= 5 ? "(Medium)" : "(Basic)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  placeholder="Describe the role's responsibilities and scope"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <Label>Permissions</Label>
                <div className="grid gap-4 max-h-80 overflow-y-auto">
                  {Object.entries(permissionCategories).map(([category, permissions]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="text-sm text-muted-foreground">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={newRole.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => 
                                handleTogglePermission(permission.id, checked as boolean)
                              }
                            />
                            <Label htmlFor={permission.id} className="text-sm">
                              {permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole} disabled={!newRole.name.trim()}>
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Roles</p>
                <p className="text-2xl">{roles.length}</p>
              </div>
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Roles</p>
                <p className="text-2xl">{roles.filter(r => r.isActive).length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Roles</p>
                <p className="text-2xl">{roles.filter(r => r.isSystem).length}</p>
              </div>
              <Lock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl">{roles.reduce((sum, role) => sum + role.userCount, 0)}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Roles Overview</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
          <TabsTrigger value="assignments">Role Assignments</TabsTrigger>
          <TabsTrigger value="hierarchy">Role Hierarchy</TabsTrigger>
        </TabsList>

        {/* Roles Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="system">System Roles</SelectItem>
                    <SelectItem value="custom">Custom Roles</SelectItem>
                    <SelectItem value="high">High Level (7-10)</SelectItem>
                    <SelectItem value="medium">Medium Level (4-6)</SelectItem>
                    <SelectItem value="low">Low Level (1-3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Roles Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Roles ({filteredRoles.length})</CardTitle>
              <CardDescription>
                Manage role definitions, permissions, and user assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getRoleIcon(role)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{role.name}</span>
                              {role.isSystem && (
                                <Badge variant="outline" className="text-xs">
                                  System
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getLevelColor(role.level)}`} />
                          <span className="text-sm">Level {role.level}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{role.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {role.permissions.length} permissions
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.isActive ? "default" : "secondary"}>
                          {role.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRole(role)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={role.isSystem}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={role.isSystem || role.userCount > 0}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the "{role.name}" role? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive">
                                  Delete Role
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permission Matrix Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>
                View which permissions are assigned to each role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Permission</th>
                      {roles.slice(0, 6).map(role => (
                        <th key={role.id} className="text-center p-2 min-w-24">
                          <div className="flex flex-col items-center gap-1">
                            {getRoleIcon(role)}
                            <span className="text-xs">{role.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(permissionCategories).map(([category, permissions]) => (
                      permissions.map((permission, index) => (
                        <tr key={permission.id} className="border-b">
                          <td className="p-2">
                            {index === 0 && (
                              <div className="text-xs text-muted-foreground mb-1">{category}</div>
                            )}
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-xs text-muted-foreground">{permission.description}</div>
                          </td>
                          {roles.slice(0, 6).map(role => (
                            <td key={role.id} className="text-center p-2">
                              {role.permissions.includes(permission.id) || role.permissions.includes("all") ? (
                                <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                              ) : (
                                <div className="w-4 h-4 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Role Assignments</CardTitle>
              <CardDescription>
                Track recent changes to user role assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "Sarah Wilson", role: "Content Manager", action: "Assigned", date: "2 hours ago" },
                  { user: "Mike Johnson", role: "Teacher", action: "Updated", date: "1 day ago" },
                  { user: "Emma Davis", role: "Support Staff", action: "Assigned", date: "2 days ago" },
                  { user: "John Smith", role: "Analyst", action: "Removed", date: "3 days ago" },
                  { user: "Lisa Chen", role: "Admin", action: "Assigned", date: "1 week ago" }
                ].map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {assignment.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm">
                          <span className="font-medium">{assignment.user}</span>
                          <span className="text-muted-foreground"> was </span>
                          <span className={
                            assignment.action === "Assigned" ? "text-green-600" :
                            assignment.action === "Updated" ? "text-blue-600" :
                            "text-red-600"
                          }>
                            {assignment.action.toLowerCase()}
                          </span>
                          <span className="text-muted-foreground"> the </span>
                          <span className="font-medium">{assignment.role}</span>
                          <span className="text-muted-foreground"> role</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{assignment.date}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Hierarchy Tab */}
        <TabsContent value="hierarchy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Hierarchy</CardTitle>
              <CardDescription>
                Visual representation of role levels and permissions inheritance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles
                  .sort((a, b) => b.level - a.level)
                  .map((role, index) => (
                    <div key={role.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(role)}
                        <div className={`w-3 h-3 rounded-full ${getLevelColor(role.level)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{role.name}</span>
                          <Badge variant="outline" className="text-xs">
                            Level {role.level}
                          </Badge>
                          {role.isSystem && (
                            <Badge variant="secondary" className="text-xs">
                              System
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {role.userCount} users
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {role.permissions.length} permissions
                          </span>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="text-xs text-muted-foreground mb-1">Access Level</div>
                        <Progress value={role.level * 10} className="h-2" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Details Modal */}
      {selectedRole && (
        <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getRoleIcon(selectedRole)}
                {selectedRole.name}
                {selectedRole.isSystem && (
                  <Badge variant="outline">System Role</Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedRole.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Access Level</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${getLevelColor(selectedRole.level)}`} />
                    <span>Level {selectedRole.level}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Users Assigned</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4" />
                    <span>{selectedRole.userCount} users</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Permissions</Label>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {selectedRole.permissions.includes("all") ? (
                    <Badge className="bg-yellow-500">All Permissions</Badge>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRole.permissions.map(permId => {
                        const permission = Object.values(permissionCategories)
                          .flat()
                          .find(p => p.id === permId);
                        return permission ? (
                          <div key={permId} className="text-sm p-2 bg-muted rounded">
                            {permission.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}