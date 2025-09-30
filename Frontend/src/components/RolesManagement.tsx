import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  Shield, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  Lock,
  CheckCircle,
  Crown,
  Star,
  Award
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
    { id: "user_create", name: "Create Users", description: "Add new users" },
    { id: "user_edit", name: "Edit Users", description: "Modify user profiles" }
  ]
};

export function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
                        (filterLevel === "custom" && !role.isSystem);
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

  const getRoleIcon = (role: Role) => {
    if (role.level >= 9) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (role.level >= 7) return <Star className="w-4 h-4 text-orange-500" />;
    if (role.level >= 5) return <Award className="w-4 h-4 text-blue-500" />;
    return <Shield className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2">Roles Management</h1>
          <p className="text-muted-foreground">
            Manage user roles, permissions, and access levels
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input
                  placeholder="e.g., Moderator"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe role"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Roles</p>
            <p className="text-2xl">{roles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Roles</p>
            <p className="text-2xl">{roles.filter(r => r.isActive).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">System Roles</p>
            <p className="text-2xl">{roles.filter(r => r.isSystem).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl">{roles.reduce((sum, role) => sum + role.userCount, 0)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Roles Overview</TabsTrigger>
          <TabsTrigger value="assignments">Role Assignments</TabsTrigger>
        </TabsList>

        {/* Roles Overview */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>All Roles ({filteredRoles.length})</CardTitle>
              <CardDescription>
                Manage role definitions and user assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
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
                        <div className="flex items-center gap-2">
                          {getRoleIcon(role)}
                          <span>{role.name}</span>
                          {role.isSystem && (
                            <Badge variant="outline" className="text-xs">System</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </TableCell>
                      <TableCell>{role.userCount}</TableCell>
                      <TableCell>{role.permissions.length} permissions</TableCell>
                      <TableCell>
                        <Badge variant={role.isActive ? "default" : "secondary"}>
                          {role.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedRole(role)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" disabled={role.isSystem}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" disabled={role.isSystem || role.userCount > 0}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{role.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive">Delete</AlertDialogAction>
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

        {/* Role Assignments */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Recent Role Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { user: "Sarah Wilson", role: "Content Manager", action: "Assigned", date: "2 hours ago" },
                  { user: "Mike Johnson", role: "Teacher", action: "Updated", date: "1 day ago" },
                  { user: "Emma Davis", role: "Support Staff", action: "Assigned", date: "2 days ago" },
                  { user: "John Smith", role: "Analyst", action: "Removed", date: "3 days ago" },
                  { user: "Lisa Chen", role: "Admin", action: "Assigned", date: "1 week ago" }
                ].map((assignment, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{assignment.user[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm">
                          <span className="font-medium">{assignment.user}</span> {assignment.action.toLowerCase()}{" "}
                          <span className="font-medium">{assignment.role}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{assignment.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

