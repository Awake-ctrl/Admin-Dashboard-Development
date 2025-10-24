// hooks/useRolesData.ts
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { rolesService, Role, RoleAssignment } from '../api/rolesServices';

export function useRolesData(activeTab: string) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [assignments, setAssignments] = useState<RoleAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load data on component mount and tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const rolesData = await rolesService.getRoles();
        setRoles(rolesData);
      } else if (activeTab === "assignments") {
        const assignmentsData = await rolesService.getRoleAssignments();
        setAssignments(assignmentsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (roleData: any) => {
    setActionLoading("create");
    try {
      // Add created_by field (you'll need to get this from your auth context)
      const currentUser = "current_user_id"; // Replace with actual user from context
      const roleWithCreator = {
        ...roleData,
        created_by: currentUser
      };
      
      const createdRole = await rolesService.createRole(roleWithCreator);
      setRoles(prev => [...prev, createdRole]);
      toast.success("Role created successfully");
      return createdRole;
    } catch (error: any) {
      console.error("Error creating role:", error);
      toast.error(error.message || "Failed to create role");
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    setActionLoading(`delete-${roleId}`);
    try {
      // Check if role has users before deleting
      const role = roles.find(r => r.id === roleId);
      if (role?.userCount && role.userCount > 0) {
        toast.error(`Cannot delete role with ${role.userCount} active users`);
        return;
      }
      
      await rolesService.deleteRole(roleId);
      setRoles(prev => prev.filter(role => role.id !== roleId));
      toast.success("Role deleted successfully");
    } catch (error: any) {
      console.error("Error deleting role:", error);
      toast.error(error.message || "Failed to delete role");
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRoleStatus = async (roleId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setActionLoading(`toggle-${roleId}`);
    
    // Store original state for rollback
    const originalRoles = [...roles];
    
    try {
      // Check if it's a system role
      const role = roles.find(r => r.id === roleId);
      if (role?.isSystem) {
        toast.error("Cannot modify system roles");
        return;
      }
      
      // Check if deactivating a role with active users
      if (newStatus === false && role?.userCount && role.userCount > 0) {
        const confirmed = window.confirm(
          `This role has ${role.userCount} active users. Deactivating it will affect these users. Continue?`
        );
        if (!confirmed) return;
      }
      
      // Optimistic update
      setRoles(prev => prev.map(role => 
        role.id === roleId ? { ...role, isActive: newStatus } : role
      ));
      
      // API call with updated_by field
      const currentUser = "current_user_id"; // Replace with actual user from context
      const updatedRole = await rolesService.updateRole(roleId, { 
        is_active: newStatus,
        updated_by: currentUser
      });
      
      // Update with server response
      setRoles(prev => prev.map(role => 
        role.id === roleId ? updatedRole : role
      ));
      
      toast.success(`Role ${newStatus ? 'activated' : 'deactivated'} successfully`);
      
    } catch (error: any) {
      console.error("Error updating role:", error);
      
      // Rollback on error
      setRoles(originalRoles);
      
      // Enhanced error handling
      let errorMessage = "Failed to update role status";
      
      if (error.response?.status === 403) {
        errorMessage = "You don't have permission to modify roles";
      } else if (error.response?.status === 409) {
        errorMessage = "Cannot deactivate role with active users";
      } else {
        errorMessage = error.response?.data?.detail || error.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssignRole = async (assignmentData: any) => {
    setActionLoading("assign");
    try {
      await rolesService.assignRole(assignmentData);
      toast.success("Role assigned successfully");
      // Refresh assignments data
      if (activeTab === "assignments") {
        const assignmentsData = await rolesService.getRoleAssignments();
        setAssignments(assignmentsData);
      }
      // Refresh roles to update user counts
      const rolesData = await rolesService.getRoles();
      setRoles(rolesData);
    } catch (error: any) {
      console.error("Error assigning role:", error);
      toast.error(error.message || "Failed to assign role");
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAssignRole = async (bulkAssignmentData: any) => {
    setActionLoading("bulk-assign");
    try {
      const result = await rolesService.bulkAssignRole(bulkAssignmentData);
      toast.success(`Role assigned to ${result.success_count} users`);
      // Refresh assignments data
      if (activeTab === "assignments") {
        const assignmentsData = await rolesService.getRoleAssignments();
        setAssignments(assignmentsData);
      }
      // Refresh roles to update user counts
      const rolesData = await rolesService.getRoles();
      setRoles(rolesData);
      return result;
    } catch (error: any) {
      console.error("Error in bulk role assignment:", error);
      toast.error(error.message || "Failed to assign roles");
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveRole = async (assignmentData: any) => {
    setActionLoading("remove");
    try {
      await rolesService.removeRole(assignmentData);
      toast.success("Role removed successfully");
      // Refresh assignments data
      if (activeTab === "assignments") {
        const assignmentsData = await rolesService.getRoleAssignments();
        setAssignments(assignmentsData);
      }
      // Refresh roles to update user counts
      const rolesData = await rolesService.getRoles();
      setRoles(rolesData);
    } catch (error: any) {
      console.error("Error removing role:", error);
      toast.error(error.message || "Failed to remove role");
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const refetch = () => {
    loadData();
  };

  return {
    roles,
    assignments,
    loading,
    actionLoading,
    handleCreateRole,
    handleDeleteRole,
    handleToggleRoleStatus,
    handleAssignRole,
    handleBulkAssignRole,
    handleRemoveRole,
    refetch
  };
}