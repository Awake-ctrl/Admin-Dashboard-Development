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
      const createdRole = await rolesService.createRole(roleData);
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
    setActionLoading(`toggle-${roleId}`);
    try {
      const updatedRole = await rolesService.updateRole(roleId, { 
        isActive: !currentStatus 
      });
      setRoles(prev => prev.map(role => 
        role.id === roleId ? updatedRole : role
      ));
      toast.success(`Role ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast.error(error.message || "Failed to update role");
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
    refetch
  };
}