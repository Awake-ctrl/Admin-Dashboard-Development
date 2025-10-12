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
  Eye,
  CheckCircle,
  Crown,
  Star,
  Award,
  Loader2
} from "lucide-react";
import { useRolesData } from "./hooks/userRolesData";
import { permissionCategories } from "./api/rolesServices";

export function RolesManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    level: 1,
    permissions: [] as string[]
  });

  const { 
    roles, 
    assignments, 
    loading, 
    actionLoading, 
    handleCreateRole, 
    handleDeleteRole, 
    handleToggleRoleStatus 
  } = useRolesData(activeTab);

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "all" || 
                        (filterLevel === "system" && role.isSystem) ||
                        (filterLevel === "custom" && !role.isSystem);
    return matchesSearch && matchesLevel;
  });

  const onCreateRole = async () => {
    try {
      await handleCreateRole(newRole);
      setNewRole({ name: "", description: "", level: 1, permissions: [] });
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const onDeleteRole = async (roleId: string) => {
    try {
      await handleDeleteRole(roleId);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const onToggleRoleStatus = async (roleId: string, currentStatus: boolean) => {
    try {
      await handleToggleRoleStatus(roleId, currentStatus);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const getRoleIcon = (role: any) => {
    if (role.level >= 9) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (role.level >= 7) return <Star className="w-4 h-4 text-orange-500" />;
    if (role.level >= 5) return <Award className="w-4 h-4 text-blue-500" />;
    return <Shield className="w-4 h-4 text-gray-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && activeTab === "overview") {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading roles...</span>
      </div>
    );
  }

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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions and access level
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
                  placeholder="Describe the role's purpose and responsibilities"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Access Level</Label>
                <Select
                  value={newRole.level.toString()}
                  onValueChange={(value) => setNewRole({ ...newRole, level: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1 - Basic</SelectItem>
                    <SelectItem value="2">Level 2 - Standard</SelectItem>
                    <SelectItem value="3">Level 3 - Elevated</SelectItem>
                    <SelectItem value="4">Level 4 - Advanced</SelectItem>
                    <SelectItem value="5">Level 5 - Manager</SelectItem>
                    <SelectItem value="6">Level 6 - Supervisor</SelectItem>
                    <SelectItem value="7">Level 7 - Director</SelectItem>
                    <SelectItem value="8">Level 8 - Administrator</SelectItem>
                    <SelectItem value="9">Level 9 - Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  {Object.entries(permissionCategories).map(([category, permissions]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <h4 className="font-medium text-sm mb-2">{category}</h4>
                      <div className="grid gap-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={newRole.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewRole({
                                    ...newRole,
                                    permissions: [...newRole.permissions, permission.id]
                                  });
                                } else {
                                  setNewRole({
                                    ...newRole,
                                    permissions: newRole.permissions.filter(p => p !== permission.id)
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor={permission.id}
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.name}
                              <p className="text-xs text-muted-foreground">{permission.description}</p>
                            </label>
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
              <Button 
                onClick={onCreateRole} 
                disabled={!newRole.name.trim() || actionLoading === "create"}
              >
                {actionLoading === "create" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Roles ({filteredRoles.length})</CardTitle>
                  <CardDescription>
                    Manage role definitions and user assignments
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search roles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading roles...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(role)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{role.name}</span>
                                {role.isSystem && (
                                  <Badge variant="outline" className="text-xs">System</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{role.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Level {role.level}</Badge>
                        </TableCell>
                        <TableCell>{role.userCount}</TableCell>
                        <TableCell>
                          {role.permissions.length === 1 && role.permissions[0] === "all" 
                            ? "All Permissions" 
                            : `${role.permissions.length} permissions`
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={role.isActive ? "default" : "secondary"}>
                              {role.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onToggleRoleStatus(role.id, role.isActive)}
                              disabled={role.isSystem || actionLoading === `toggle-${role.id}`}
                            >
                              {actionLoading === `toggle-${role.id}` ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className={`w-3 h-3 ${role.isActive ? 'text-green-500' : 'text-gray-400'}`} />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(role.updatedAt)}
                          </div>
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
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  disabled={role.isSystem || role.userCount > 0}
                                >
                                  {actionLoading === `delete-${role.id}` ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{role.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-destructive"
                                    onClick={() => onDeleteRole(role.id)}
                                  >
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Assignments */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Recent Role Assignments</CardTitle>
              <CardDescription>
                Track role changes and assignments across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading assignments...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {assignment.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm">
                            <span className="font-medium">{assignment.user.name}</span>{" "}
                            <span className="capitalize">{assignment.action}</span>{" "}
                            <span className="font-medium">{assignment.role}</span> role
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(assignment.date)} • By {assignment.assignedBy}
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        assignment.action === 'assigned' ? 'default' :
                        assignment.action === 'updated' ? 'secondary' :
                        'destructive'
                      }>
                        {assignment.action.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                  {assignments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No role assignments found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}