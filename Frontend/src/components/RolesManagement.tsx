// components/RolesManagement.tsx
import { useState, useEffect } from "react";
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
  Loader2,
  UserPlus,
  UserMinus,
  Filter
} from "lucide-react";
import { useRolesData } from "./hooks/userRolesData";
import { permissionCategories, rolesService, User } from "./api/rolesServices";

export function RolesManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    level: 1,
    permissions: [] as string[]
  });

  const [assignment, setAssignment] = useState({
    user_id: "",
    role_id: "",
    assigned_by: "current_user" // Replace with actual user from auth context
  });

  const [bulkAssignment, setBulkAssignment] = useState({
    user_ids: [] as string[],
    role_id: "",
    assigned_by: "current_user" // Replace with actual user from auth context
  });

  const { 
    roles, 
    assignments, 
    loading, 
    actionLoading, 
    handleCreateRole, 
    handleDeleteRole, 
    handleToggleRoleStatus,
    handleAssignRole,
    handleBulkAssignRole,
    handleRemoveRole
  } = useRolesData(activeTab);

  // Load users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const usersData = await rolesService.getUsers();
        setAllUsers(usersData);
      } catch (error) {
        console.error("Error loading users:", error);
        // Fallback to mock data if API fails
        setAllUsers([
          { id: "user_001", name: "John Doe", email: "john@example.com" },
          { id: "user_002", name: "Jane Smith", email: "jane@example.com" },
          { id: "user_003", name: "Bob Johnson", email: "bob@example.com" },
          { id: "user_004", name: "Alice Brown", email: "alice@example.com" },
          { id: "user_005", name: "Charlie Wilson", email: "charlie@example.com" },
        ]);
      } finally {
        setUsersLoading(false);
      }
    };

    if (activeTab === "assignments" || isAssignModalOpen || isBulkAssignModalOpen) {
      loadUsers();
    }
  }, [activeTab, isAssignModalOpen, isBulkAssignModalOpen]);

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "all" || 
                        (filterLevel === "system" && role.isSystem) ||
                        (filterLevel === "custom" && !role.isSystem);
    return matchesSearch && matchesLevel;
  });

  const activeRoles = roles.filter(role => role.is_active);

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

  // assign roles
// Add this component before your RolesManagement component
const UserRolesCard = ({ user, onAssignRole, onRemoveRole, actionLoading, showOnlyWithRoles = false }: {
  user: User;
  onAssignRole: (user: User) => void;
  onRemoveRole: (userId: string, roleId: string) => void;
  actionLoading: string | null;
  showOnlyWithRoles?: boolean; // New prop to filter users without roles
}) => {
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [userRolesLoading, setUserRolesLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        console.log(`Fetching roles for user: ${user.id}`);
        const roles = await rolesService.getUserRoles(user.id);
        console.log(`Fetched roles for user ${user.id}:`, roles);
        setUserRoles(roles);
      } catch (error) {
        console.error(`Error fetching roles for user ${user.id}:`, error);
        setUserRoles([]);
      } finally {
        setUserRolesLoading(false);
      }
    };

    fetchUserRoles();
  }, [user.id]);

  // If showOnlyWithRoles is true and user has no roles, return null
  if (showOnlyWithRoles && !userRolesLoading && userRoles.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-muted-foreground truncate">{user.email}</div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAssignRole(user)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>
      
      {userRolesLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Loading user roles...</span>
        </div>
      ) : userRoles.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {userRoles.map((role) => (
            <Badge 
              key={role.id} 
              variant="secondary" 
              className="flex items-center gap-2 px-3 py-1.5"
            >
              {getRoleIcon(role)}
              <span>{role.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent hover:text-destructive"
                onClick={() => onRemoveRole(user.id, role.id)}
                disabled={actionLoading === "remove"}
              >
                {actionLoading === "remove" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <UserMinus className="w-3 h-3" />
                )}
              </Button>
            </Badge>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No roles assigned</p>
        </div>
      )}
    </div>
  );
};
  const onToggleRoleStatus = async (roleId: string, currentStatus: boolean) => {
    try {
      await handleToggleRoleStatus(roleId, currentStatus);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const onAssignRole = async () => {
    try {
      await handleAssignRole(assignment);
      setAssignment({ user_id: "", role_id: "", assigned_by: "current_user" });
      setIsAssignModalOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const onBulkAssignRole = async () => {
    try {
      await handleBulkAssignRole(bulkAssignment);
      setBulkAssignment({ user_ids: [], role_id: "", assigned_by: "current_user" });
      setIsBulkAssignModalOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const onRemoveRole = async (user_id: string, role_id: string) => {
    try {
      await handleRemoveRole({
        user_id,
        role_id,
        assigned_by: "current_user"
      });
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
          <h1 className="text-3xl font-bold tracking-tight">Roles Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user roles, permissions, and access levels across the platform
          </p>
        </div>
        <div className="flex gap-2">
          {/* Assign Role Button */}
          <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Role to User</DialogTitle>
                <DialogDescription>
                  Assign a specific role to a user. This will grant them all permissions associated with the role.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="user">Select User</Label>
                  <Select
                    value={assignment.user_id}
                    onValueChange={(value) => setAssignment({ ...assignment, user_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {usersLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Loading users...
                        </div>
                      ) : (
                        allUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Select Role</Label>
                  <Select
                    value={assignment.role_id}
                    onValueChange={(value) => setAssignment({ ...assignment, role_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(role)}
                            <div>
                              <div className="font-medium">{role.name}</div>
                              <div className="text-xs text-muted-foreground">Level {role.level}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={onAssignRole} 
                  disabled={!assignment.user_id || !assignment.role_id || actionLoading === "assign"}
                >
                  {actionLoading === "assign" && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Assign Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bulk Assign Role Button */}
          <Dialog open={isBulkAssignModalOpen} onOpenChange={setIsBulkAssignModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Bulk Assign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Assign Role</DialogTitle>
                <DialogDescription>
                  Assign the same role to multiple users at once. Select users and choose a role to assign.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Select Users ({bulkAssignment.user_ids.length} selected)</Label>
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                    {usersLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Loading users...
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {allUsers.map((user) => (
                          <div key={user.id} className="flex items-center space-x-3 py-2 px-2 rounded hover:bg-accent">
                            <Checkbox
                              id={`user-${user.id}`}
                              checked={bulkAssignment.user_ids.includes(user.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setBulkAssignment({
                                    ...bulkAssignment,
                                    user_ids: [...bulkAssignment.user_ids, user.id]
                                  });
                                } else {
                                  setBulkAssignment({
                                    ...bulkAssignment,
                                    user_ids: bulkAssignment.user_ids.filter(id => id !== user.id)
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor={`user-${user.id}`}
                              className="flex items-center gap-3 flex-1 cursor-pointer"
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Select Role</Label>
                  <Select
                    value={bulkAssignment.role_id}
                    onValueChange={(value) => setBulkAssignment({ ...bulkAssignment, role_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(role)}
                            <div>
                              <div className="font-medium">{role.name}</div>
                              <div className="text-xs text-muted-foreground">Level {role.level} • {role.userCount} users</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBulkAssignModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={onBulkAssignRole} 
                  disabled={bulkAssignment.user_ids.length === 0 || !bulkAssignment.role_id || actionLoading === "bulk-assign"}
                >
                  {actionLoading === "bulk-assign" && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Assign to {bulkAssignment.user_ids.length} Users
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create Role Button */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions and access level. Roles help manage user permissions across the platform.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Moderator, Content Manager, Analyst"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role's purpose, responsibilities, and scope..."
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Access Level</Label>
                  <Select
                    value={newRole.level.toString()}
                    onValueChange={(value) => setNewRole({ ...newRole, level: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Level 1 - Basic (View Only)</SelectItem>
                      <SelectItem value="2">Level 2 - Standard (Basic Actions)</SelectItem>
                      <SelectItem value="3">Level 3 - Elevated (Content Management)</SelectItem>
                      <SelectItem value="4">Level 4 - Advanced (User Management)</SelectItem>
                      <SelectItem value="5">Level 5 - Manager (Team Management)</SelectItem>
                      <SelectItem value="6">Level 6 - Supervisor (Department Management)</SelectItem>
                      <SelectItem value="7">Level 7 - Director (Organization Management)</SelectItem>
                      <SelectItem value="8">Level 8 - Administrator (System Management)</SelectItem>
                      <SelectItem value="9">Level 9 - Super Admin (Full System Access)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Higher levels have more permissions and access to sensitive features.
                  </p>
                </div>
                <div className="space-y-3">
                  <Label>Permissions</Label>
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                    {Object.entries(permissionCategories).map(([category, permissions]) => (
                      <div key={category} className="mb-6 last:mb-0">
                        <h4 className="font-medium text-sm mb-3 capitalize border-b pb-1">
                          {category.replace('_', ' ')}
                        </h4>
                        <div className="grid gap-3">
                          {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-accent/50">
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
                                className="flex-1 text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                <div className="font-medium">{permission.name}</div>
                                <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selected {newRole.permissions.length} permission(s)
                  </p>
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
                  {actionLoading === "create" && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Roles</p>
                <p className="text-2xl font-bold">{roles.filter(r => r.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Roles</p>
                <p className="text-2xl font-bold">{roles.filter(r => r.isSystem).length}</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Assignments</p>
                <p className="text-2xl font-bold">{roles.reduce((sum, role) => sum + role.userCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Roles Overview
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Role Assignments
          </TabsTrigger>
        </TabsList>

        {/* Roles Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>All Roles</CardTitle>
                  <CardDescription>
                    Manage role definitions, permissions, and access levels. {filteredRoles.length} role(s) found
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search roles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full sm:w-64"
                    />
                  </div>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="w-full sm:w-32">
                      <Filter className="w-4 h-4 mr-2" />
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
              ) : filteredRoles.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No roles found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterLevel !== "all" 
                      ? "Try adjusting your search or filter criteria"
                      : "Get started by creating your first role"
                    }
                  </p>
                  {!searchQuery && filterLevel === "all" && (
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Role
                    </Button>
                  )}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Role</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoles.map((role) => (
                        <TableRow key={role.id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {getRoleIcon(role)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold truncate">{role.name}</span>
                                  {role.isSystem && (
                                    <Badge variant="secondary" className="text-xs">
                                      System
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {role.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              L{role.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{role.userCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              {role.permissions.length === 0 ? (
                                <span className="text-muted-foreground text-sm">No permissions</span>
                              ) : role.permissions.includes('all') ? (
                                <Badge variant="default" className="text-xs">
                                  All Permissions
                                </Badge>
                              ) : (
                                <span className="text-sm">
                                  {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={role.is_active ? "default" : "secondary"}
                                className="capitalize"
                              >
                                {role.is_active ? (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                ) : null}
                                {role.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              {!role.isSystem && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onToggleRoleStatus(role.id, role.is_active)}
                                  disabled={actionLoading === `toggle-${role.id}`}
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  {actionLoading === `toggle-${role.id}` ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <CheckCircle className={`w-3 h-3 ${role.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedRole(role);
                                  setIsViewModalOpen(true);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                disabled={role.isSystem}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    disabled={role.isSystem || role.userCount > 0}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                                      Are you sure you want to delete the role "{role.name}"? This action cannot be undone and will remove all permissions associated with this role.
                                      {role.userCount > 0 && (
                                        <span className="text-destructive block mt-2">
                                          This role has {role.userCount} user(s) assigned. You cannot delete a role with active users.
                                        </span>
                                      )}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => onDeleteRole(role.id)}
                                      disabled={role.userCount > 0}
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
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Role Assignments</CardTitle>
                  <CardDescription>
                    Manage role assignments and track assignment history across the platform
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Assign Role
                      </Button>
                    </DialogTrigger>
                    {/* Assign Role Dialog Content - Same as above */}
                  </Dialog>
                </div>
              </div>
            </CardHeader>
           <CardContent>
  {loading ? (
    <div className="flex items-center justify-center h-32">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="ml-2">Loading assignments...</span>
    </div>
  ) : (
    <div className="space-y-8">
      {/* Current User Roles Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current Role Assignments</h3>
          <span className="text-sm text-muted-foreground">
            {allUsers.length} user(s) total
          </span>
        </div>
        <div className="space-y-4">
          {allUsers.map((user) => (
            <UserRolesCard
              key={user.id}
              user={user}
              onAssignRole={(user) => {
                setAssignment({
                  user_id: user.id,
                  role_id: "",
                  assigned_by: "current_user"
                });
                setIsAssignModalOpen(true);
              }}
              onRemoveRole={onRemoveRole}
              actionLoading={actionLoading}
              showOnlyWithRoles={true} // Add this prop to filter
            />
          )).filter(Boolean)} {/* This removes any null/undefined entries */}
        </div>
      </div>

      {/* Assignment History Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Assignment History</h3>
        <div className="space-y-3">
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {getInitials(assignment.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <span className="font-medium">{assignment.user.name}</span>{" "}
                      <span className="capitalize">{assignment.action}</span>{" "}
                      <span className="font-medium text-primary">{assignment.role}</span> role
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
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No assignment history</h3>
              <p className="text-muted-foreground mb-4">
                Role assignment history will appear here when you start assigning roles to users.
              </p>
              <Button onClick={() => setIsAssignModalOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Assign First Role
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Role Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Role Details</DialogTitle>
            <DialogDescription>
              View complete information about the selected role
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {getRoleIcon(selectedRole)}
                <div>
                  <h3 className="text-xl font-bold">{selectedRole.name}</h3>
                  <p className="text-muted-foreground">{selectedRole.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Access Level</Label>
                  <p className="text-sm font-medium">Level {selectedRole.level}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={selectedRole.is_active ? "default" : "secondary"}>
                    {selectedRole.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <Label>Users Assigned</Label>
                  <p className="text-sm font-medium">{selectedRole.userCount} user(s)</p>
                </div>
                <div>
                  <Label>Role Type</Label>
                  <Badge variant="outline">
                    {selectedRole.isSystem ? 'System Role' : 'Custom Role'}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Permissions ({selectedRole.permissions.length})</Label>
                <div className="mt-2 border rounded-lg p-4 max-h-40 overflow-y-auto">
                  {selectedRole.permissions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No permissions assigned</p>
                  ) : selectedRole.permissions.includes('all') ? (
                    <Badge variant="default" className="text-sm">
                      All Permissions Granted
                    </Badge>
                  ) : (
                    <div className="grid gap-2">
                      {selectedRole.permissions.map((permissionId: string) => {
                        // Find permission details
                        let permissionName = permissionId;
                        let categoryName = "Unknown";
                        
                        for (const [category, perms] of Object.entries(permissionCategories)) {
                          const perm = perms.find(p => p.id === permissionId);
                          if (perm) {
                            permissionName = perm.name;
                            categoryName = category.replace('_', ' ');
                            break;
                          }
                        }
                        
                        return (
                          <div key={permissionId} className="flex items-center justify-between py-1">
                            <div>
                              <div className="text-sm font-medium">{permissionName}</div>
                              <div className="text-xs text-muted-foreground capitalize">{categoryName}</div>
                            </div>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Created</Label>
                  <p className="text-muted-foreground">{formatDate(selectedRole.createdAt)}</p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-muted-foreground">{formatDate(selectedRole.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}